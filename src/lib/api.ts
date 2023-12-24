/**
 * Collection of helper functions for interacting with the API
 */

/**
 * Wrapper for the native `Response.json` to provide type safe responses
 */
export function JsonResponse<InputType>(
  data: InputType,
  init?: ResponseInit | undefined,
) {
  return Response.json(data, init);
}

/**
 * Standardized fetch wrapper to perform boilerplate
 *
 * todo: should we add some error handling things
 */
export async function fetcher<ApiInputType>(
  apiUrl: string,
  init: Omit<RequestInit, "body"> & { body: ApiInputType },
  //   apiVersion = "v0",
): Promise<string> {
  // auto-magically add in the correct api version (when not included)
  //   if (!apiUrl.startsWith("/api/v")) {
  //     apiUrl = apiUrl.replace("/api/", `/api/${apiVersion}/`);
  //   }

  // perform a standardized fetch to the api
  return fetch(apiUrl, {
    // parse in the provided `init` settings
    ...init,
    // default method to GET
    method: init?.method || "GET",
    headers: {
      ...init?.headers,
      // always set the content type to json
      "Content-Type": "application/json",
    },
    // always stringify the body because this is json land and we always use it every time
    body: JSON.stringify(init.body),
  }).then(async (res) => {
    return res.text();
  });
}
