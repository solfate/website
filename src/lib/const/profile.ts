/**
 * Max character length for profile usernames
 */
export const USERNAME_MAX_LEN = 16;

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
