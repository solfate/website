// prettier-ignore
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
// prettier-ignore
import { TokenUnsupportedInstructionError, programSupportsExtensions } from "@solana/spl-token";

import { struct, u8 } from "@solana/buffer-layout";

// @ts-ignore
import { publicKey } from "@solana/buffer-layout-utils";

/**
 * manually define the group extension discriminators
 *
 * see:
 * https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/instruction.rs#L843-L844
 */
export enum ManualTokenInstruction {
  GroupPointerExtension = 40,
  GroupMemberPointerExtension = 41,
}

/** GroupPointer as stored by the program */
export interface GroupPointer {
  /** Optional authority that can set the group address */
  authority: PublicKey | null;
  /** Optional Account Address that contains the grouping */
  groupAddress: PublicKey | null;
}

/** Buffer layout for de/serializing a Group Pointer extension */
export const GroupPointerLayout = struct<{
  authority: PublicKey;
  groupAddress: PublicKey;
}>([publicKey("authority"), publicKey("groupAddress")]);

export const GROUP_POINTER_SIZE = GroupPointerLayout.span;

export enum GroupPointerInstruction {
  Initialize = 0,
  Update = 1,
}

export const initializeGroupPointerData = struct<{
  instruction: ManualTokenInstruction.GroupPointerExtension;
  //   todo: instruction: TokenInstruction.GroupPointerExtension;
  groupPointerInstruction: number;
  authority: PublicKey;
  groupAddress: PublicKey;
}>([
  // prettier-ignore
  u8('instruction'),
  u8("groupPointerInstruction"),
  publicKey("authority"),
  publicKey("groupAddress"),
]);

/**
 * Construct an Initialize GroupPointer instruction
 *
 * @param mint            Token mint account
 * @param authority       Optional Authority that can set the group address
 * @param groupAddress    Optional Account address that represents the grouping
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeGroupPointerInstruction(
  mint: PublicKey,
  authority: PublicKey | null,
  groupAddress: PublicKey | null,
  programId: PublicKey,
): TransactionInstruction {
  if (!programSupportsExtensions(programId)) {
    throw new TokenUnsupportedInstructionError();
  }
  const keys = [{ pubkey: mint, isSigner: false, isWritable: true }];

  const data = Buffer.alloc(initializeGroupPointerData.span);
  initializeGroupPointerData.encode(
    {
      instruction: ManualTokenInstruction.GroupPointerExtension,
      //   todo: instruction: TokenInstruction.GroupPointerExtension,
      groupPointerInstruction: GroupPointerInstruction.Initialize,
      authority: authority ?? PublicKey.default,
      groupAddress: groupAddress ?? PublicKey.default,
    },
    data,
  );

  return new TransactionInstruction({ keys, programId, data: data });
}

/** GroupMemberPointer as stored by the program */
export interface GroupMemberPointer {
  /** Optional authority that can set the group address */
  authority: PublicKey | null;
  /** Optional Account Address that contains the grouping */
  memberAddress: PublicKey | null;
}

/** Buffer layout for de/serializing a Group Pointer extension */
export const GroupMemberPointerLayout = struct<{
  authority: PublicKey;
  memberAddress: PublicKey;
}>([publicKey("authority"), publicKey("memberAddress")]);

export const GROUP_MEMBER_POINTER_SIZE = GroupPointerLayout.span;

export enum GroupMemberPointerInstruction {
  Initialize = 0,
  Update = 1,
}

export const initializeGroupMemberPointerData = struct<{
  instruction: ManualTokenInstruction.GroupMemberPointerExtension;
  //   todo: instruction: TokenInstruction.GroupMemberPointerExtension;
  groupMemberPointerInstruction: number;
  authority: PublicKey;
  memberAddress: PublicKey;
}>([
  // prettier-ignore
  u8('instruction'),
  u8("groupMemberPointerInstruction"),
  publicKey("authority"),
  publicKey("memberAddress"),
]);

/**
 * Construct an Initialize GroupMemberPointer instruction
 *
 * @param mint            Token mint account
 * @param authority       Optional Authority that can set the group address
 * @param memberAddress   Optional Account address that represents the grouping
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createInitializeGroupMemberPointerInstruction(
  mint: PublicKey,
  authority: PublicKey | null,
  memberAddress: PublicKey | null,
  programId: PublicKey,
): TransactionInstruction {
  if (!programSupportsExtensions(programId)) {
    throw new TokenUnsupportedInstructionError();
  }
  const keys = [{ pubkey: mint, isSigner: false, isWritable: true }];

  const data = Buffer.alloc(initializeGroupPointerData.span);
  initializeGroupMemberPointerData.encode(
    {
      instruction: ManualTokenInstruction.GroupMemberPointerExtension,
      //   todo: instruction: TokenInstruction.GroupPointerExtension,
      groupMemberPointerInstruction: GroupPointerInstruction.Initialize,
      authority: authority ?? PublicKey.default,
      memberAddress: memberAddress ?? PublicKey.default,
    },
    data,
  );

  return new TransactionInstruction({ keys, programId, data: data });
}
