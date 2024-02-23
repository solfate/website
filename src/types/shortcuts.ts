export type WalletShortcutSchema = {
  /**
   * Version of the targeted schema.
   */
  version: number;
  /**
   * The list of shortcuts this project supports.
   */
  shortcuts: WalletShortcutItem[];
};

export type WalletShortcutItem = {
  /**
   * The suggested text to display on the link
   */
  label: string;
  /**
   * URI pointing to the destination of the shortcut
   */
  uri: string;
  /**
   * (Optional) The suggested icon to display on the link
   */
  icon?:
    | "vote"
    | "vote-2"
    | "stake"
    | "stake-2"
    | "view"
    | "chat"
    | "tip"
    | "mint"
    | "mint-2"
    | "discord"
    | "twitter"
    | "x"
    | "instagram"
    | "telegram"
    | "leaderboard"
    | "gaming"
    | "gaming-2"
    | "generic-link"
    | "generic-add";
  /**
   * (Optional) Whether the shortcut prefers to be opened outside of the client
   * (e.g. Outside of Phantom's in-app browser). Defaults to `false`
   */
  prefersExternalTarget?: boolean;
  /**
   * (Optional) How the shortcut prefers to be displayed. The platform would
   * choose how that translates to their UX. Defaults to `immerse`
   */
  preferredPresentation?: "default" | "immerse";
  /**
   * (Optional) A list of collection addresses that should display this
   * shortcut. If provided, the client should only show the shortcut on
   * collections that are in this array. Other collections that share the same
   * `external_url` will not show this shortcut. Addresses should be provided
   * as strings. Defaults to an empty array `[]`
   */
  limitToCollections?: string[];
  /**
   * (Optional) Indicates to the client that this shortcut should only be
   * displayed for the specified platform. Defaults to `all`.
   */
  platform?: "desktop" | "mobile" | "all";
};
