"use client";

import { memo, useMemo } from "react";
import toast from "react-hot-toast";
import { fetcher } from "@/lib/api";
import {
  ApiSettingsTipPatchInput,
  ApiSettingsTipPatchInputSchema,
} from "@/lib/schemas/settings";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CopyIcon, InfoIcon } from "lucide-react";
import { SITE, TWITTER } from "@/lib/const/general";
import { Icons } from "@/components/ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FormValues = z.infer<typeof ApiSettingsTipPatchInputSchema>;

const SettingsPageClient = memo(
  ({ username, wallets }: { username: string; wallets: string[] }) => {
    const form = useForm<FormValues>({
      resolver: zodResolver(ApiSettingsTipPatchInputSchema),
      defaultValues: {
        wallet: wallets[0],
      },
    });

    return (
      <Form {...form}>
        <FormContent form={form} wallets={wallets} username={username} />
      </Form>
    );
  },
);

const FormContent = ({
  form,
  wallets,
  username,
}: {
  form: UseFormReturn<FormValues>;
  wallets: string[];
  username: string;
}) => {
  const {
    formState: { dirtyFields, isSubmitting, defaultValues },
    reset,
  } = useFormContext();

  const profileUrl = useMemo(
    () => new URL(`/${username}`, SITE.url).toString(),
    [username],
  );

  async function onSubmit(formData: FormValues) {
    try {
      const res = await fetcher<ApiSettingsTipPatchInput>(
        "/api/settings/tips",
        {
          method: "PATCH",
          body: formData,
        },
      );

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
        title={"Tips and Donations"}
        description={`Accept tips and donations directly to your Solana wallet on your Solfate profile or blink`}
      >
        <div className="relative">
          <Button
            type="submit"
            variant={
              isSubmitting || !Object.keys(dirtyFields).length
                ? "outline"
                : "default"
            }
            disabled={isSubmitting || !Object.keys(dirtyFields).length}
          >
            <span className={cn(isSubmitting && "opacity-0")}>
              Save Changes
            </span>
            {isSubmitting && (
              <Icons.spinner className="absolute mx-auto h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </SettingsHeader>

      {!defaultValues?.wallet && (
        <Alert variant={"destructive"}>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Heads up: No public wallet, no tips!</AlertTitle>
          <AlertDescription>
            You do not have a public Solana wallet selected for your profile.
            You cannot accept tips/donations via your profile or blink until you
            select one.
          </AlertDescription>
        </Alert>
      )}

      <section className="block md:flex gap-6">
        <section className="card flex-grow">
          <section className="space-y-6">
            <FormField
              control={form.control}
              name="wallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    <span>Public Wallet</span>
                    <Link
                      href="/settings/connections"
                      className={cn(
                        buttonVariants({ size: "sm", variant: "link" }),
                        "underline !text-xs px-0 text-hot-pink",
                      )}
                    >
                      Connect New Wallet
                    </Link>
                  </FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </section>
        <section className="card flex-grow max-w-80 space-y-3">
          {/* <FormLabel className="flex justify-between items-center">
            Accept Tips via Blinks
          </FormLabel> */}

          <div className="grid grid-cols-2 gap-3 items-center justify-between text-sm">
            <Button
              type="button"
              variant={"twitter"}
              size={"sm"}
              className="inline-flex"
              onClick={(e) => {
                e.preventDefault();

                const post =
                  `Send a SOL tip to my wallet directly using my @${TWITTER.username} profile` +
                  `\n${profileUrl}` +
                  `\n\n` +
                  "On the website or this blink!";

                window
                  .open(
                    `https://x.com/intent/post?text=${encodeURIComponent(post)}`,
                    "_blank",
                  )
                  ?.focus();
              }}
              disabled={!defaultValues?.wallet}
            >
              Share Blink
            </Button>
            <Button
              size={"sm"}
              type="button"
              variant={"default"}
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();

                window.navigator.clipboard.writeText(profileUrl);

                toast.success("Copied to clipboard!");
              }}
              disabled={!defaultValues?.wallet}
            >
              <span>Copy Link</span>
              <CopyIcon size={14} />
            </Button>
          </div>

          <Image
            src={`/api/images/tip/${username}?${dirtyFields.wallet || defaultValues?.wallet}`}
            alt={"Your tip image"}
            width={600}
            height={600}
            className="aspect-square border rounded-lg mx-auto"
          />

          <p className="text-muted-foreground text-xs">
            *image may take a few minutes to refresh
          </p>

          {/* <p>Simply share your Solfate profile link:</p>
          <div className="group flex items-center gap-2 text-lg">
            <span>/url</span>
            <Input value={`${SITE.url}`} className="text-sm" />
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-6 w-6 transition-opacity group-hover:opacity-100"
            >
              <CopyIcon className="h-3 w-3" />
              <span className="sr-only">Copy Blink URL</span>
            </Button>
          </div> */}
        </section>
      </section>
    </form>
  );
};

export default SettingsPageClient;
