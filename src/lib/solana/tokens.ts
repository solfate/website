/**
 * note:
 * we prettier ignore the imports and keep them on a single line because
 * esrun has an issue on windows without it...
 */

// prettier-ignore
import { SystemProgram,Connection,Keypair,PublicKey,Transaction} from "@solana/web3.js";
// prettier-ignore
import { ASSOCIATED_TOKEN_PROGRAM_ID,ExtensionType,LENGTH_SIZE,TOKEN_2022_PROGRAM_ID,TYPE_SIZE,createInitializeMetadataPointerInstruction,createInitializeMintInstruction,getMintLen,createInitializeInstruction,createUpdateFieldInstruction,createInitializeNonTransferableMintInstruction,getAssociatedTokenAddressSync,createAssociatedTokenAccountInstruction,createMintToInstruction,createSetAuthorityInstruction, AuthorityType} from "@solana/spl-token";
// prettier-ignore
import { pack,TokenMetadata,createUpdateAuthorityInstruction} from "@solana/spl-token-metadata";

/**
 * Grind for a keypair that has a public key that the desired criteria
 */
export function grindKeypairSync({ startsWith }: { startsWith: string }) {
  const startTime = Date.now();
  let keypair = new Keypair();

  while (!keypair.publicKey.toBase58().toLowerCase().startsWith(startsWith)) {
    keypair = new Keypair();
  }

  return {
    keypair,
    grindTime: Date.now() - startTime,
  };
}

type CreateDevListTokenInstructionType = {
  connection: Connection;
  /** end owner of the asset */
  owner: PublicKey;
  /** the payer of the transaction (defaults to the `owner`) */
  payer?: PublicKey;
  /**  */
  customMint?: PublicKey;
  /**  */
  metadata: TokenMetadata;
  /** mint keypair */
  mint?: Keypair;
  /** the master authority */
  authority: PublicKey;
  /** the final update authority - note: this is not required to sign the transaction */
  updateAuthority?: PublicKey;
};

export async function createNonTransferableTokenTransaction({
  connection,
  owner,
  payer,
  metadata,
  mint,
  authority,
  updateAuthority,
}: CreateDevListTokenInstructionType) {
  // the asset `owner` will normally pay all fees
  if (!payer) payer = owner;

  // make the final update authority the default authority
  if (!updateAuthority) updateAuthority = authority;

  // generate a new random mint if non provided
  if (!mint) mint = Keypair.generate();
  if (!mint?.publicKey) throw Error("Mint keypair not found");

  // derive the ata for the token owner and mint
  const associatedTokenAccount = getAssociatedTokenAddressSync(
    // mint account
    mint.publicKey,
    // owner of the asset
    owner,
    // do not allow the owner to be off curve or not
    false,
    // token program
    TOKEN_2022_PROGRAM_ID,
    // ata program
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // calculate the size of the mint account
  const mintSpace = getMintLen([
    ExtensionType.NonTransferable,
    ExtensionType.MetadataPointer,

    // todo: when spl-token updates to include the group pointer...
    // ExtensionType.GroupPointer,
  ]);

  /**
   * note: token22 requires the mint account's space to be exact for the mint alone.
   * including any variable data's space will cause the initialize mint ix to fail.
   * (why? idk. because reasons.)
   *
   * we still need to pay enough lamports to have enough space for all the metadata too
   */

  // calculate the metadata space needed onchain
  const metadataSpace = pack(metadata).length + TYPE_SIZE + LENGTH_SIZE;

  // how much does the space cost?
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintSpace + metadataSpace,
  );

  // create the mint account, owned by the token22 program
  const createAccountInstruction = SystemProgram.createAccount({
    programId: TOKEN_2022_PROGRAM_ID,
    fromPubkey: payer,
    newAccountPubkey: mint.publicKey,
    // total space for the mint alone (not including the variable metadata space)
    space: mintSpace,
    // cost
    lamports,
  });

  // instruction to initialize the MetadataPointer extension
  const initializeMetadataPointerInstruction =
    createInitializeMetadataPointerInstruction(
      // mint account address
      mint.publicKey,
      // authority that can set the metadata address
      authority,
      // the token22 mint will be the metadata account
      mint.publicKey,
      // program id
      TOKEN_2022_PROGRAM_ID,
    );

  // instruction to initialize mint account data
  const initializeMintInstruction = createInitializeMintInstruction(
    // mint address
    mint.publicKey,
    // decimals for the mint - nfts have no decimals!
    0,
    // mint authority
    authority,
    // optional freeze authority
    null,
    // program id
    TOKEN_2022_PROGRAM_ID,
  );

  // we are creating non transferrable tokens - the owner can still burn them, just not transfer
  const initializeNonTransferrableInstruction =
    createInitializeNonTransferableMintInstruction(
      // mint account
      mint.publicKey,
      // program id
      TOKEN_2022_PROGRAM_ID,
    );

  // instruction to initialize metadata account data via token22
  const initializeMetadataInstruction = createInitializeInstruction({
    // token extension program as metadata program
    programId: TOKEN_2022_PROGRAM_ID,
    // account address that holds the metadata - with token22, it is the mint
    metadata: mint.publicKey,
    // authority that can update the metadata in the future
    updateAuthority: authority,
    mint: mint.publicKey,
    mintAuthority: authority,
    // required metadata fields
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
  });

  // instruction to add custom metadata fields
  const updateFieldInstructions = metadata.additionalMetadata.map(
    ([field, value]) =>
      createUpdateFieldInstruction({
        // token extension program as metadata program
        programId: TOKEN_2022_PROGRAM_ID,
        // account address that holds the metadata
        metadata: mint?.publicKey as PublicKey,
        // authority that can update the metadata
        updateAuthority: authority,
        // custom metadata field
        field: field,
        // custom metadata value
        value: value,
      }),
  );

  // create the associated token account that will ultimately own the asset
  const createAtaInstruction = createAssociatedTokenAccountInstruction(
    // payer of fees
    payer,
    // ata address
    associatedTokenAccount,
    // owner of the asset
    owner,
    // token mint
    mint.publicKey,
    // token22 program id
    TOKEN_2022_PROGRAM_ID,
    // ata program id
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );

  // mint exactly 1 token on the mint
  const mintToInstruction = createMintToInstruction(
    // mint account
    mint.publicKey,
    // ata for the owner of the token
    associatedTokenAccount,
    // mint authority
    // note: payer is always a signer, but we reset this as the final transaction
    authority,
    // quantity
    1.0,
    // multi signers
    undefined,
    // token program
    TOKEN_2022_PROGRAM_ID,
  );

  // clear the mint authority so no new tokens can ever be minted
  const clearMintTokenAuthorityIx = createSetAuthorityInstruction(
    // token account and/or mint
    mint.publicKey,
    // current authority
    authority,
    // specific authority to update
    AuthorityType.MintTokens,
    // new authority - aka clear it aka no more tokens can be created on this mint
    null,
    // multi signers
    undefined,
    // token program
    TOKEN_2022_PROGRAM_ID,
  );

  // reset the metadata update authority to be the desired key for the future
  const setUpdateAuthorityIx = createUpdateAuthorityInstruction({
    metadata: mint.publicKey,
    oldAuthority: authority,
    // note: this authority does not need to sign the transaction
    newAuthority: updateAuthority,
    programId: TOKEN_2022_PROGRAM_ID,
  });

  return new Transaction().add(
    createAccountInstruction,
    initializeNonTransferrableInstruction,
    initializeMetadataPointerInstruction,
    initializeMintInstruction,
    initializeMetadataInstruction,
    createAtaInstruction,
    mintToInstruction,
    clearMintTokenAuthorityIx,
    ...updateFieldInstructions,
    setUpdateAuthorityIx,
  );
}
