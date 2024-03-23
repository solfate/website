/**
 * API handlers for the "/api/upload" endpoint
 */

import { withUserAuth } from "@/lib/auth";
import { ASSETS_DOMAIN, ASSETS_URL } from "@/lib/const/general";
import { ApiUploadPostInput, ApiUploadPostResponse } from "@/types/api/general";
import { Storage } from "@google-cloud/storage";

export const POST = withUserAuth(async ({ req, session }) => {
  try {
    const input: ApiUploadPostInput = await req.json();
    if (!input) throw "Invalid input";

    let fileKey = "";
    let contentType = input.fileDetails.type;
    let fileType = contentType.split("/").pop().toLocaleLowerCase();

    switch (fileType) {
      case "jpg":
      case "jpeg": {
        fileType = "jpeg";
        break;
      }
      case "png": {
        fileType = "png";
        break;
      }
      default: {
        throw "Unsupported file type";
      }
    }

    switch (input.type.toLowerCase()) {
      case "profile": {
        fileKey = `profile/${session.user.id}-${Date.now()}.${fileType}`;
        break;
      }
      default: {
        throw "Unknown input type";
      }
    }

    const storage = new Storage({
      credentials: {
        type: "service_account",
        project_id: process.env.GCP_STORAGE_PROJECT_ID,
        private_key_id: process.env.GCP_STORAGE_PRIVATE_KEY_ID,
        private_key: process.env.GCP_STORAGE_PRIVATE_KEY,
        client_email: process.env.GCP_STORAGE_CLIENT_EMAIL,
        client_id: process.env.GCP_STORAGE_CLIENT_ID,
      },
    });

    // await storage.bucket(ASSETS_DOMAIN).makePublic();
    // await storage
    //   .bucket(ASSETS_DOMAIN)
    //   .setCorsConfiguration([
    //     {
    //       maxAgeSeconds: 3600,
    //       method: ["GET", "PUT"],
    //       origin: ["*"],
    //       responseHeader: ["Content-Type"],
    //     },
    //   ])
    //   .then((res) => {
    //     console.log("setCorsConfiguration complete");
    //   });

    const [signedUrl] = await storage
      .bucket(ASSETS_DOMAIN)
      .file(fileKey)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 60 * 1000 * 3, // 3 minutes
        contentType,
      });

    const payload: ApiUploadPostResponse = {
      fileKey,
      signedUrl,
      contentType,
      assetUrl: `${ASSETS_URL}/${fileKey}`,
    };

    return Response.json(payload);
  } catch (err) {
    console.warn("[API error]", err);

    let message = "An unknown error occurred";

    if (typeof err == "string") message = err;

    return new Response(message, {
      status: 400,
    });
  }
});
