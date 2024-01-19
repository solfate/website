/**
 * API input from a `POST` request to the `/api/lists/developers` endpoint
 * (aka submitting a person's response to the questions)
 */
export type ApiListDevelopersPostInput = {
  why: string;
  who?: string;
};

/**
 * API input from a `PUT` request to the `/api/lists/developers` endpoint
 * (aka submitting a person's response to the questions)
 */
export type ApiListDevelopersPutInput = {
  why: string;
  who?: string;
};
