import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";
import { sleep } from "@/lib/scripts";
import { ASSETS_DOMAIN, ASSETS_URL, SITE } from "@/lib/const/general";
import { Storage } from "@google-cloud/storage";
import { TwitterProfile } from "next-auth/providers/twitter";
import { exec } from "child_process";

dotenv.config();

const storage = new Storage({
  credentials: {
    type: "service_account",
    project_id: process.env.GCP_STORAGE_PROJECT_ID,
    private_key_id: process.env.GCP_STORAGE_PRIVATE_KEY_ID,
    private_key: process.env.GCP_STORAGE_PRIVATE_KEY,
    client_id: process.env.GCP_STORAGE_CLIENT_ID,
    client_email: process.env.GCP_STORAGE_CLIENT_EMAIL,
  },
});

async function downloadImageUsingCurl(
  imageUrl: string,
  downloadFolder: string,
  fileName?: string,
): Promise<{ file: File; filePath: string }> {
  downloadFolder = path.join(__dirname, downloadFolder);

  // Ensure the download folder exists
  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
  }

  const url = new URL(imageUrl);

  let pathnames = url.pathname.split("/");
  pathnames[pathnames.length - 1] = pathnames[pathnames.length - 1].replace(
    "_normal",
    // "_400x400",
    "",
  );
  url.pathname = pathnames.join("/");

  if (!fileName) {
    fileName = pathnames[pathnames.length - 1];
  } else {
    fileName = `${fileName}.${pathnames[pathnames.length - 1].split(".").pop()?.toLocaleLowerCase()}`;
  }

  const filePath = path.join(downloadFolder, fileName);

  console.log("image url:", url.toString());

  const curlCommand = `curl -o "${filePath}" -O "${url.toString()}"`;

  await new Promise<void>((resolve, reject) => {
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error downloading image: ${stderr}`);
      } else {
        resolve();
      }
    });
  });

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found after download: ${filePath}`);
  }

  await sleep(2435 * (1 + Math.random()));

  // console.log("filePath:", filePath);

  // Create a Blob from the ArrayBuffer
  const blob = new Blob([fs.readFileSync(filePath)], {
    type: `image/${fileName.split(".").pop()}`,
  });

  // Convert the Blob to a File
  const file = new File([blob], fileName, { type: blob.type });

  // console.log("file:", file);

  return { file, filePath };
  // return filePath;
}

async function uploadFile(file: File, userId: string) {
  try {
    let contentType = file.type;
    let fileType = file.type.split("/").pop()?.toLocaleLowerCase();

    const fileKey = `profile/${userId}-${Date.now()}.${fileType}`;

    const [signedUrl] = await storage
      .bucket(ASSETS_DOMAIN)
      .file(fileKey)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 60 * 1000 * 3, // 3 minutes
        contentType,
      });

    if (!signedUrl) throw "Invalid upload response";

    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      body: file,
    });

    if (!uploadRes.ok) {
      console.error(uploadRes);
      throw "Upload failed";
    }

    console.log("Upload complete!");

    return new URL(`/${fileKey}`, ASSETS_URL).toString();
  } catch (err) {
    console.warn("[upload error]", err);

    let message = "An upload error occurred";
    if (typeof err == "string") message = err;

    console.error(err);
    console.error(message);
  }
}

const providerName: "twitter" | "github" = "twitter";
type ProfileType = TwitterProfile;

const userIdWithErrors: string[] = [];

// find all the users with the provider and no existing profile
const users = await prisma.user.findMany({
  where: {
    id: {
      notIn: userIdWithErrors,
    },
    profile: {
      is: null,
    },
    accounts: {
      some: {
        provider: providerName,
      },
    },
  },
  include: {
    profile: true,
    accounts: {
      where: {
        provider: providerName,
      },
    },
  },
  take: 200,
});

const usersWithBrokenImages: string[] = [];
const userUpdateErrors: string[] = [];

let updatedCounter: number = 0;

console.log("total users:", users.length);

for (let i = 0; i < users.length; i++) {
  const user = users[i];

  const profile = (user.accounts[0].provider_profile as object as ProfileType)
    .data;

  const newData = {
    name: profile.name,
    username: profile.username,
    image: "",
  };

  try {
    if (!profile.profile_image_url) throw "No image found";
    // const imageFile = await downloadImageAsFile(profile.profile_image_url);

    const { file: imageFile, filePath } = await downloadImageUsingCurl(
      profile.profile_image_url,
      "./profile_images/",
      profile.username,
    );

    if (imageFile.size == 0) {
      console.log(imageFile);
      throw "invalid file downloaded. was it a 404?";
    }

    const assetUrl = await uploadFile(imageFile, user.id);

    if (assetUrl) newData.image = assetUrl;

    // delete the local image after upload to the s3 bucket
    fs.unlinkSync(filePath);
  } catch (err) {
    console.log("[image error]", "userId:", user.id);
    console.log("social username:", profile.username);
    console.error(err);

    usersWithBrokenImages.push(profile.username);
  }

  try {
    // update or create the user's profile on solfate
    const solfateProfile = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: newData.username,
        profile: {
          upsert: {
            create: {
              name: newData.name,
              image: newData.image,
              twitter: providerName == "twitter" ? profile.username : undefined,
              // github: providerName == "github" ? profile.username : undefined
            },
            update: {
              image: newData.image,
              twitter: providerName == "twitter" ? profile.username : undefined,
              // todo: do we want to force update the user's name?
              // name: newData.name,
              // github: providerName == "github" ? profile.username : undefined
            },
          },
        },
      },
    });

    if (!solfateProfile) throw "Unable to update user";

    // success!
    updatedCounter++;
    console.log(`${providerName} handle:`, profile.username);

    console.log("Updated:", `http://localhost:3000/${solfateProfile.username}`);
    console.log("Updated:", `https://solfate.com/${solfateProfile.username}`);

    // success!
  } catch (err) {
    console.error("[update user error]", "unable to update the user's account");
    console.error(err);
    userUpdateErrors.push(profile.username);
  }
}

console.log("\n-----------------------------");
console.log("Complete!");

if (updatedCounter == users.length) {
  console.log("All successful!");
}

console.log("userUpdateErrors:", userUpdateErrors);
console.log("usersWithBrokenImages:", usersWithBrokenImages);
