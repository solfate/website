/**
 * Create a standard URL slug for the given `input`
 */
export function createStandardSlug(input: string) {
  const splitter: string | string[] = input.toLowerCase().split("/");
  return splitter[splitter.length - 1].split(".md")[0].replace(/\s+/g, "-");
}
