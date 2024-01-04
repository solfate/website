/**
 * list of known stages when interacting with a wallet
 */
export enum WALLET_STAGE {
  /** idle state, awaiting a user action */
  IDLE,
  /** completed status! */
  SUCCESS,
  /** awaiting the user to authorize their wallet to connect to the app */
  WALLET_CONNECT,
  /** awaiting the user to sign or reject the message */
  WALLET_SIGN,
}

export const walletButtonLabel = ({
  stage,
  placeholder = "Sign in with Solana",
  success,
}: {
  stage: WALLET_STAGE;
  placeholder?: string;
  success: string;
}) => {
  switch (stage) {
    case WALLET_STAGE.WALLET_CONNECT:
      return "Connecting to wallet...";
    case WALLET_STAGE.WALLET_SIGN:
      return "Waiting for wallet approval...";
    case WALLET_STAGE.SUCCESS:
      return success;
    case WALLET_STAGE.IDLE:
    // note: idle uses default
    default:
      return placeholder;
  }
};
