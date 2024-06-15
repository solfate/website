import { z } from "zod";
import { usernameSchema } from "@/lib/validators";
import { PublicKey } from "@solana/web3.js";

export const ApiSettingsPatchInputSchema = z.object({
  username: usernameSchema,
  wallet: z.string().refine((val) => {
    try {
      new PublicKey(val);
      return true;
    } catch (err) {
      return false;
    }
  }, `Wallet address is invalid`),
});

export type ApiSettingsPatchInput = z.infer<typeof ApiSettingsPatchInputSchema>;
