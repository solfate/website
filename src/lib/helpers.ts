/**
 * Create a standard URL slug for the given `input`
 */
export function createStandardSlug(input: string) {
  const splitter: string | string[] = input.toLowerCase().split("/");
  return splitter[splitter.length - 1].split(".md")[0].replace(/\s+/g, "-");
}

/**
 * Generate a random number within the provided range
 */
export function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
