import { z } from "zod";
import { usernameSchema } from "@/lib/validators";

export const ApiSettingsPatchInputSchema = z.object({
  username: z.union([usernameSchema.nullish(), z.literal("")]),
});

export type ApiSettingsPatchInput = z.infer<typeof ApiSettingsPatchInputSchema>;
