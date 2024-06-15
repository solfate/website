"use client";

import { memo } from "react";
import { getUser } from "@/lib/queries/users";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/api";
import {
  ApiSettingsPatchInput,
  ApiSettingsPatchInputSchema,
} from "@/lib/schemas/settings";
import { SITE } from "@/lib/const/general";
import { USERNAME_MAX_LEN } from "@/lib/const/profile";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = z.infer<typeof ApiSettingsPatchInputSchema>;

const SettingsPageClient = memo(
  ({
    user,
    wallets,
  }: {
    user: Awaited<ReturnType<typeof getUser>>;
    wallets: string[];
  }) => {
    const form = useForm<FormValues>({
      resolver: zodResolver(ApiSettingsPatchInputSchema),
      defaultValues: {
        username: user?.username,
        wallet: wallets[0],
      },
    });

    return (
      <Form {...form}>
        <FormContent form={form} wallets={wallets} />
      </Form>
    );
  },
);

const FormContent = ({
  form,
  wallets,
}: {
  form: UseFormReturn<FormValues>;
  wallets: string[];
}) => {
  const {
    formState: { dirtyFields, isSubmitting, defaultValues },
    reset,
  } = useFormContext();

  async function onSubmit(formData: FormValues) {
    try {
      const res = await fetcher<ApiSettingsPatchInput>("/api/settings", {
        method: "PATCH",
        body: formData,
      });

      // force update the user's current session
      // (to capture their new username change in the jwt)
      if (
        !!formData.username &&
        formData.username !== defaultValues?.username
      ) {
        await signIn("jwt", {
          redirect: false,
        });
      }

      // reset the form with the new state
      reset(formData);

      return toast.success(res);
    } catch (err) {
      console.error("failed::", err);

      if (typeof err == "string") toast.error(err);
      else if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");
    } finally {
      // setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <SettingsHeader
        title={"General Settings"}
        description={`Manage your ${SITE.name} account settings`}
      >
        <Button
          type="submit"
          variant={
            isSubmitting || !Object.keys(dirtyFields).length
              ? "outline"
              : "default"
          }
          disabled={isSubmitting || !Object.keys(dirtyFields).length}
        >
          Save Changes
        </Button>
      </SettingsHeader>

      <section className="card">
        <section className="space-y-6 max-w-xl">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="max-w-xl">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Enter a unique username"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name and part of your unique URL
                  here on {SITE.name}
                </FormDescription>
                <FormMessage>
                  max of {USERNAME_MAX_LEN} characters: letters, numbers, dash,
                  and underscore
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wallet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Wallet</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Solana wallet address" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wallets.map((wallet, key) => (
                      <SelectItem
                        key={key}
                        disabled={!wallet && true}
                        value={wallet || "none"}
                      >
                        {wallet || "None Selected"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormDescription>
                  Select a Solana wallet address to be displayed publicly on
                  your profile.
                </FormDescription>
                <FormDescription>
                  {/* You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
      </section>
    </form>
  );
};

export default SettingsPageClient;
