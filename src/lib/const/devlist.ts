import { PublicKey } from "@solana/web3.js";

/**
 * Cooldown period (in seconds) to force the user to wait between mints
 */
export const MINT_COOLDOWN_SECONDS = 60;

/**
 * the update authority for ALL token things
 */
export const DEVLIST_UPDATE_AUTHORITY = new PublicKey(
  // Squads Multisig
  "2KJung5NgLQ84AcPrDhDj7sMvwbYd4CwCrpEqiGQuWa4",
);
