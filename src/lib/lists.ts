import prisma from "@/lib/prisma";
import { WalletList } from "@prisma/client";
import { Connection, PublicKey } from "@solana/web3.js";

/**
 * Check the Solana blockchain for the a specific token's account existing onchain.
 * When the mint account exists, we update the applicant's record to reflect
 */
export async function checkMintAndUpdateApplicantStatus(
  applicantId: WalletList["id"],
  connection: Connection,
  accountAddress: PublicKey,
  newStatus: WalletList["status"] = "ACTIVE",
) {
  try {
    // check if the account `accountAddress` exists on chain
    const accountInfo = await connection.getAccountInfo(accountAddress, {
      commitment: "single",
    });

    // the `accountAddress` does not exist
    if (accountInfo == null) return false;

    // since the token account already exists, update the db record
    await prisma.walletList.update({
      where: {
        id: applicantId,
      },
      data: {
        status: newStatus,
      },
    });

    return accountInfo;
  } catch (err) {
    // default return true since this is the worst case: the address exists
    return true;
  }
}
