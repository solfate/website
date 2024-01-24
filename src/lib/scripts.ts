/**
 * Assorted helper function for use directly within scripts handled via `esrun`
 */
import fs from "fs";
import path from "path";

/** helper to easily exit with a message */
export function exit(message?: string) {
  console.log(message || "Complete.");
  process.exit();
}

/** helper function to wait/sleep in the console */
export async function sleep(ms: number = 1000) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export function saveJsonCacheDataSync(
  filePath: string,
  newData: object,
  combineData: boolean = true,
) {
  let oldData = {};

  try {
    oldData = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
  } catch (err) {
    console.warn("[WARN]", "unable to load the existing data");
  }

  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(combineData ? { ...oldData, ...newData } : newData),
      {
        encoding: "utf-8",
      },
    );
  } catch (err) {
    console.error("[ERROR]", "unable to save the data");
  }
}
