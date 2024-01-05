/**
 * API input from a `POST` request to the `/api/lists/developers` endpoint
 * (aka submitting a person's response to the questions)
 */
export type ApiDevelopersPostInput = {
  why: string;
  who?: string;
};
