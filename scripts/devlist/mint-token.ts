/**
 * note:
 * we prettier ignore the imports and keep them on a single line because
 * esrun has an issue on windows without it...
 */

import dotenv from "dotenv";
// prettier-ignore
import { Cluster, Connection, PublicKey, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
// prettier-ignore
import { getTokenMetadata } from "@solana/spl-token";
// prettier-ignore
import { type TokenMetadata } from "@solana/spl-token-metadata";
// prettier-ignore
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
// prettier-ignore
import { createNonTransferableTokenTransaction, grindKeypairSync } from "@/lib/solana/tokens";
// prettier-ignore
import { DEVLIST_UPDATE_AUTHORITY } from "@/lib/const/devlist";

dotenv.config();

// load the payer keypair from the env
const DEVLIST_SERVER_KEY =
  await getKeypairFromEnvironment("DEVLIST_SERVER_KEY");

console.log("DEVLIST_SERVER_KEY:", DEVLIST_SERVER_KEY.publicKey.toBase58());

console.log("Grinding for a vanity mint...");

const { keypair: mint, grindTime } = grindKeypairSync({
  startsWith: "dev",
});

console.log("vanity mint:", mint.publicKey.toBase58());
console.log(`Execution time: ${grindTime} ms`);

let CLUSTER: Cluster = "devnet";
const connection = new Connection(clusterApiUrl(CLUSTER), "confirmed");

// Metadata to store in Mint Account
const metadata: TokenMetadata = {
  // note: we reset this to the final desired key later
  // but it is required to sign in order to set `additionalMetadata` during the mint transaction
  updateAuthority: mint.publicKey,
  mint: mint.publicKey,
  name: "OPOS",
  symbol: "OPOS",
  uri: "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  // set the additional custom metadata
  additionalMetadata: [
    ["github", "username"],
    ["twitter", "username"],
  ],
};

// the ultimate owner of the token
const owner = new PublicKey("Ei35sTUct2j1JcKc9HhuejGtFwBWZW7SVuRU6t95ugG5");

// for mainnet mints, this will be the owner
const payer = DEVLIST_SERVER_KEY.publicKey;

// build the transaction
const transaction = await createNonTransferableTokenTransaction({
  connection,
  payer: payer,
  mint: mint.publicKey,
  owner,
  metadata,
  authority: DEVLIST_SERVER_KEY.publicKey,
  updateAuthority: DEVLIST_UPDATE_AUTHORITY,
});

console.log("Sending transaction...");

// Send transaction
const txSig = await sendAndConfirmTransaction(
  connection,
  transaction,
  // signers - the `mint` and the
  [DEVLIST_SERVER_KEY, mint],
  {
    /**
     * note:
     * there might be a race condition when triggering all of these
     * instructions at the "confirmed" level
     */
    commitment: "max",
  },
);

console.log(
  "Transaction:",
  `https://solana.fm/tx/${txSig}?cluster=${
    CLUSTER.startsWith("devnet") ? "devnet-solana" : ""
  }`,
);

console.log(
  "Token account:",
  `https://solana.fm/account/${mint.publicKey.toBase58()}?cluster=${
    CLUSTER.startsWith("devnet") ? "devnet-solana" : ""
  }`,
);

console.log("Getting the metadata from the chain...");

// get the token's metadata from the blockchain
const tokenMetadata = await getTokenMetadata(connection, mint.publicKey);
console.log("Metadata:", JSON.stringify(tokenMetadata, null, 2));

// // Instruction to remove a key from the metadata
// const removeKeyInstruction = createRemoveKeyInstruction({
//   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
//   metadata: mint.publicKey, // Address of the metadata
//   updateAuthority: updateAuthority, // Authority that can update the metadata
//   key: metaData.additionalMetadata[0][0], // Key to remove from the metadata
//   idempotent: true, // If the idempotent flag is set to true, then the instruction will not error if the key does not exist
// });

// // Add instruction to new transaction
// transaction = new Transaction().add(removeKeyInstruction);

// // Send transaction
// transactionSignature = await sendAndConfirmTransaction(
//   connection,
//   transaction,
//   [payer]
// );

// console.log(
//   "\nRemove Additional Metadata Field:",
//   `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
// );

// console.log(
//   "\nMint Account:",
//   `https://solana.fm/address/${mint}?cluster=devnet-solana`
// );
