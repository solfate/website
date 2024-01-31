import {
  BlockhashWithExpiryBlockHeight,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { SolanaSignInMessage } from "./SignInMessage";

/**
 * SPL Memo program ID
 */
export const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

type CreateAuthMemoTransactionArgs = {
  /** connection to the desired cluster */
  connection: Connection;
  /** standard sign in message for signing */
  signInMessage: SolanaSignInMessage;
  /** fee payer for the transaction - defaults to `signInMessage.message.address` */
  feePayer?: PublicKey;
};

/**
 * Build a single memo instruction based transaction to support transaction based message signing
 * (like that of which is required by a Ledger)
 */
export async function createAuthMemoTransaction({
  feePayer,
  connection,
  signInMessage,
}: CreateAuthMemoTransactionArgs) {
  let latestBlockhash: BlockhashWithExpiryBlockHeight;
  try {
    latestBlockhash = await connection.getLatestBlockhash();
  } catch (err) {
    throw Error("Unable to get latest blockhash");
  }

  // when not manually set, use the message's `address` as the `feePayer`
  if (!feePayer) feePayer = new PublicKey(signInMessage.message.address);

  return new Transaction({
    feePayer,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }).add(
    new TransactionInstruction({
      programId: new PublicKey(MEMO_PROGRAM_ID),
      data: Buffer.from(new TextEncoder().encode(signInMessage.prepare())),
      keys: [],
    }),
  );
}
