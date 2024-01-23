import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import {
  verifyMessageSignature,
  verifySignIn,
} from "@solana/wallet-standard-util";
import { PublicKey, Transaction } from "@solana/web3.js";
import base58 from "bs58";
import { MEMO_PROGRAM_ID } from "../const/general";

export interface SolanaSignInMessageData extends SolanaSignInInput {
  /** domain used to generate the message */
  domain: string;
  /** user address used for signing */
  address: string;
  /** unique value added into the message */
  nonce: string;
}

export type SolanaSignedMessageData = {
  /**
   * base58 encoded signature of the signed message
   **/
  signature: string;
  /**
   * base58 encoded bytes that were signed
   * */
  signedMessage: string;
  /**
   * the wallet address that signed the message
   * defaults to the `data.address` when not provided
   * */
  address?: string;
  nonce?: string | undefined;
  /** if signing in with ledger */
  isLedger?: boolean | undefined;
};

type SolanaSignInMessageArgs = {
  /**
   * Sign in message data the user is to sign
   */
  message: SolanaSignInMessageData | string;

  /**
   * Optional `message` override data to replace the provided `message`
   */
  overrides?: Partial<SolanaSignInMessageData>;

  /**
   * The signed message data
   */ signedData?: SolanaSignedMessageData | string;
};

export class SolanaSignInMessage {
  /** stored `SignInInput` data */
  message: SolanaSignInMessageData;

  /** signed message data */
  signedData: SolanaSignedMessageData | undefined = undefined;

  constructor({ message, signedData, overrides }: SolanaSignInMessageArgs) {
    // const currentUrl = new URL(window.location.href);

    if (typeof message == "string") {
      message = JSON.parse(message) as unknown as SolanaSignInMessageData;
    }

    this.message = {
      // version: "1",
      // chainId: "solana:mainnet",
      statement:
        "Clicking Sign or Approve only means you have proved this wallet is " +
        "owned by you. This request will not trigger any blockchain transaction" +
        " or cost any gas fee.",
      ...message,
      // always slice in the `overrides` last
      ...overrides,
    };

    if (!!signedData) {
      if (typeof signedData == "string") {
        signedData = JSON.parse(
          signedData,
        ) as unknown as SolanaSignedMessageData;
      }

      this.signedData = signedData;
    }
  }

  /**
   * Store the base58 encoded values for the `signature` and `signedMessage`
   */
  storeSignature({
    signature,
    signedMessage,
    address,
    isLedger,
  }: SolanaSignedMessageData) {
    this.signedData = {
      signature,
      signedMessage,
      address: address ?? this.message.address,
      isLedger,
    };
  }

  /**
   * Prepare a fresh SIWS data object with an updated `issuedAt`
   */
  prepareSIWS(): SolanaSignInMessageData {
    return {
      ...this.message,
      // always override the issued date for the current timestamp
      issuedAt: new Date().toISOString(),
    };
  }

  /**
   * Prepare a simple string message to be signed
   */
  prepare(): string {
    return `${this.message.statement}\n${this.message.nonce}`;
  }

  /**
   * Verify the current instance's data against any of the available signature verification methods
   */
  verifyAny() {
    return this.verifySignature() || this.verifySIWS();
  }

  /*
   * Verify the signature for the `Sign in with Solana` spec
   */
  verifySIWS(
    signedData: SolanaSignedMessageData | undefined = this.signedData,
  ) {
    if (!signedData) throw Error("Invalid signedData");

    const serializedOutput: SolanaSignInOutput = {
      account: {
        publicKey: new Uint8Array(
          base58.decode(signedData.address || this.message.address),
        ),
        address: this.signedData?.address || this.message.address,
        features: [],
        chains: [],
      },
      signature: new Uint8Array(base58.decode(signedData.signature)),
      signedMessage: new Uint8Array(base58.decode(signedData.signedMessage)),
    };

    return verifySignIn(this.message, serializedOutput);
  }

  /**
   * Verify a signature matches
   */
  verifySignature(
    signature: string | undefined = this.signedData?.signature,
    message: string = this.prepare(),
  ) {
    if (!signature) throw Error("No signature to verify");

    if (this.signedData?.isLedger) {
      const tx = Transaction.from(base58.decode(this.signedData.signature));
      return validateAuthTx(tx, message, this.message.address);
    }
    // parse each of the values as Uint8 arrays
    return verifyMessageSignature({
      publicKey: base58.decode(this.message.address),
      signature: base58.decode(signature),
      message: new TextEncoder().encode(message),
      signedMessage: new TextEncoder().encode(message),
    });
  }

  /**
   *
   */
  validateData(message: Partial<SolanaSignInInput>): boolean {
    try {
      if (!message.domain || this.message.domain !== message.domain)
        throw Error("Invalid domain");

      if (
        !message.address ||
        this.message.address !== message.address ||
        this.message.address !== this.message.address
      )
        throw Error("Invalid address");

      // ttl on the issuedAt?

      // all checks have passed!!!
      return true;
    } catch (err) {}

    // default return to invalid
    return false;
  }
}

export const validateAuthTx = (
  tx: Transaction,
  message: string,
  publicKey: string,
): boolean => {
  try {
    const inx = tx.instructions.find((x) =>
      x.programId.equals(new PublicKey(MEMO_PROGRAM_ID)),
    );
    if (!inx) return false;
    if (inx.data.toString() != message) return false;
    if (!tx.verifySignatures()) return false;
    if (!tx.signatures.find((x) => x.publicKey.toBase58() === publicKey))
      return false;
  } catch (e) {
    return false;
  }
  return true;
};
