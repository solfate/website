import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";
import { exit } from "@/lib/scripts";

const COHORT_TO_SEARCH = 2;
const REQUEST_QUANTITY = 1000;

/**
 * whether or not to print the accounts that have not yet been checked by the automation script
 */
const PRINT_UNCHECKED_BY_AUTOMATION = true;

// declare the cache dir to save all the devlist data
const devlistCacheDir = path.resolve("./.cache/devlist");
const pendingFileName = `pending-cohort-${COHORT_TO_SEARCH}.md`;

try {
  fs.statfsSync(devlistCacheDir);

  // clear the current file contents
  fs.writeFileSync(
    path.join(devlistCacheDir, pendingFileName),
    `Pending list generated: ${new Date().toISOString()}\n\n`,
    {
      encoding: "utf-8",
    },
  );

  // todo: delete the file
} catch (err) {
  // todo: force create the required directories
  exit("devlist cache dir does not exist");
}

dotenv.config();

/**
 * Get the list of all all DevList applicants that are potentially eligible
 */
const applicants = await prisma.walletList.findMany({
  // limit the number of waitlist applicants to parse at a time
  take: REQUEST_QUANTITY,
  orderBy: {
    // the unchecked applications (aka `null`) will appear first
    // lastCheck: "asc",
    id: "asc",
  },
  where: {
    AND: {
      // only check for applicants that have not already been checked
      //   lastCheck: null,
      // we are only checking the devlist applications
      type: "DEVELOPER",
      // only applicants that have not been approved yet
      status: "PENDING",
      // only parse applications in the desired cohort
      cohort: COHORT_TO_SEARCH,
    },
  },
  include: {
    user: {
      include: {
        accounts: {
          // we need the person's github account stored from the OAuth connection
          where: {
            provider: "github",
          },
        },
      },
    },
  },
});

if (!applicants || applicants.length == 0) {
  exit("There are no pending DevList applicants");
}

console.log("Total applicants:", applicants.length);

//
for (let i = 0; i < applicants.length; i++) {
  if (!applicants[i]?.data) {
    console.warn("\n[UNKNOWN DATA]", `${applicants[i].twitter}`, "\n");
    continue;
  }

  if (!PRINT_UNCHECKED_BY_AUTOMATION && !applicants[i].lastCheck) {
    // do not process uncheck applicants
    continue;
  }

  // parse the custom data stored in the application
  const customData: {
    twitter: { id: string; username: string };
    github: { id: string; username: string };
  } = applicants[i].data as any;

  //   console.log(
  //     `\n - Twitter: https://twitter.com/${customData.twitter.username}`,
  //   );
  //   console.log(` - GitHub: https://github.com/${customData.github.username}`);
  //   console.log(` - has GitHub check: ${!!applicants[i].lastCheck}`);

  try {
    fs.appendFileSync(
      path.join(devlistCacheDir, pendingFileName),
      `- applicant id: ${applicants[i].id}` +
        `\n   - Twitter: https://twitter.com/${customData.twitter.username}` +
        `\n   - GitHub: https://github.com/${customData.github.username}` +
        `\n`,
      {
        encoding: "utf-8",
      },
    );
  } catch (err) {
    console.error("[ERROR]", "unable to save the data");
  }
}

console.log(`\nFinished printing ${applicants.length} applicants`);
