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

export const ASSETS_DOMAIN = "assets.solfate.com";
export const ASSETS_URL = "https://" + ASSETS_DOMAIN;

export const TWITTER = {
  handle: "@SolfateHQ",
  username: "SolfateHQ",
  url: "https://twitter.com/SolfateHQ",
};

export const GITHUB = "https://github.com/solfate/website";
