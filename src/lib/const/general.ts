/*
  General constants for use throughout the site
*/

export const SITE = {
  name: "Solfate",
  domain: "solfate.com",
  url:
    process.env.NODE_ENV == "development"
      ? "http://localhost:3000"
      : "https://solfate.com",
};

export const TWITTER = {
  handle: "@SolfatePod",
  username: "SolfatePod",
  url: "https://twitter.com/SolfatePod",
};

export const YOUTUBE = {
  handle: "@SolfatePod",
  username: "SolfatePod",
  url: "https://youtube.com/@SolfatePod",
};

export const GITHUB = "https://github.com/nickfrosty/solfate";
// export const GITHUB = "https://github.com/solfate";

export const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
