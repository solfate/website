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
  /** awaiting the user to sign or reject */
  WALLET_SIGN,
  /** awaiting the user to sign or reject the message */
  WALLET_SIGN_MESSAGE,
  /** awaiting the user to sign or reject the transaction */
  WALLET_SIGN_TRANSACTION,
  /** building a transaction, either client side or server side */
  BUILDING_TRANSACTION,
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
      return "Waiting for wallet...";
    case WALLET_STAGE.WALLET_SIGN_MESSAGE:
      return "Waiting for wallet...";
    case WALLET_STAGE.WALLET_SIGN_TRANSACTION:
      return "Waiting for wallet...";
    case WALLET_STAGE.BUILDING_TRANSACTION:
      return "Building transaction...";
    case WALLET_STAGE.SUCCESS:
      return success;
    case WALLET_STAGE.IDLE:
    // note: idle uses default
    default:
      return placeholder;
  }
};
