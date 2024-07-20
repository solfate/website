/**
 * Max character length for profile usernames
 */
export const USERNAME_MAX_LEN = 16;

/**
 *
 */
export const profileConfig = {
  headline: {
    max: 255,
  },
  bio: {
    max: 255,
  },
};

/**
 * Minimum character length for profile usernames
 */
export const USERNAME_MIN_LEN = 5;

/**
 * Default regular expression for allowed characters in a username
 *
 * todo: should this restrict the starting and ending characters?
 */
export const USERNAME_REGEX = /^[a-z0-9\_\-]*$/i;

/**
 * List of usernames that are not allowed to be created
 *
 * note: this list should include the page routes that the site uses
 */
export const USERNAME_BLACKLIST = [
  // comment for better diffs
  "admin",
  "api",
  "help",
  "blog",
  "dashboard",
  "settings",
  "account",
  "profile",
  "changelog",
  "stats",
  "tools",
  "utils",
  "manage",
  "features",
  "welcome",
  "login",
  "logout",
  "signin",
  "signout",
  "creators",
  "fund",
  // branded names
  "solfate",
  "devlist",
];

/**
 * List of username prefixes that are not allowed to be created
 */
export const USERNAME_BLACKLIST_PREFIX = [
  // comment for better diffs
  "_",
  "-",
  "solana",
  "solfate",
];

/**
 * Default regular expression for allowed characters in an invite code
 *
 * todo: should this restrict the starting and ending characters?
 */
export const INVITE_CODE_REGEX = /^solfate-[a-z0-9\-]*$/i;

/**
 * Is a person looking for work? If so, what level of work?
 */
export const PROFILE_WORK_STATUS = {
  0: "Unknown",
  1: "Not Looking",
  2: "Part Time",
  3: "Contract Based",
  4: "Full Time",
};

/**
 *
 */
export enum PROFILE_CATEGORY {
  Unknown,
  Founder,
  Developer,
  Marketer,
  Designer,
  CommunityManager,
  Writer,
  ContentCreator,
  Trader,
}

/**
 * What (self declared) skills does this person have
 */
export const PROFILE_SKILLS = {
  0: "None",
  1: "Frontend",
  2: "Backend",
  3: "Rust",
  4: "Anchor",
  5: "iOS",
  6: "Android",
  7: "Mobile",
  8: "Javascript",
  9: "Typescript",
  10: "React",
  11: "Vue",
  12: "Svelte",
  13: "Go-Lang",
  14: "Kotlin",
  15: "Swift",
  16: "",
};
