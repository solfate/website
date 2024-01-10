/**
 * Assorted helper function for use directly within scripts handled via `esrun`
 */

/** helper to easily exit with a message */
export function exit(message?: string) {
  console.log(message || "Complete.");
  process.exit();
}

/** helper function to wait/sleep in the console */
export async function sleep(ms: number = 1000) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}
