import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { TREASURY_PLATFORM_FEE, TREASURY_PUBKEY } from "@/lib/const/solana";

export function createTipSolTransaction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  solAmount: number,
): Transaction {
  const amount = solAmount * LAMPORTS_PER_SOL;

  return new Transaction().add(
    // transfer the donation funds to the end recipient
    SystemProgram.transfer({
      fromPubkey: fromPubkey,
      lamports: amount,
      toPubkey: toPubkey,
    }),
    // take the platform fee
    SystemProgram.transfer({
      fromPubkey: fromPubkey,
      lamports: amount * TREASURY_PLATFORM_FEE,
      toPubkey: TREASURY_PUBKEY,
    }),
  );
}
