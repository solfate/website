import NextLink from "next/link";
import styles from "@/styles/SocialButton.module.css";
import { Icon as FeatherIcon } from "react-feather";
import { Linkedin, Link as LinkIcon, Twitter } from "react-feather";
import { memo } from "react";
import clsx from "clsx";
import { SITE, TWITTER } from "@/lib/const/general";

type SocialButtonBaseProps = {
  title: string;
  label?: string;
  icon: FeatherIcon;
  strokeWidth?: number;
  className?: string;
};

/**
 * Open a social media platform to the desired url
 */
export const SocialButtonLink = memo(
  ({
    title,
    label,
    href,
    newTab,
    strokeWidth,
    className,
    icon: IconToUse,
  }: SocialButtonBaseProps & { href: string; newTab?: boolean }) => {
    return (
      <NextLink
        target={newTab ? "_blank" : undefined}
        title={title}
        href={href}
        className={clsx(styles.button, !!label ? "!px-3" : "", className)}
      >
        <IconToUse
          className="w-4 md:w-5 h-4 md:h-5"
          strokeWidth={strokeWidth ?? 1}
        />
        {!!label && label}
      </NextLink>
    );
  },
);

type SocialButtonProps = SocialButtonBaseProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

/**
 *
 */
export const SocialButton = memo(
  ({ title, icon: IconToUse, ...props }: SocialButtonProps) => {
    return (
      <button type="button" title={title} className={styles.button} {...props}>
        <IconToUse className="w-4 md:w-5 h-4 md:h-5" strokeWidth={1} />
      </button>
    );
  },
);

type SocialShareButtonsProps = {
  href: string;
};

/**
 * Standard buttons to share a link on popular social media platforms
 *
 * todo: add some props to support changing the message,
 * todo: and maybe have a list of standard messages to rotate though?
 */
export const SocialShareButtons = memo(({ href }: SocialShareButtonsProps) => {
  // auto convert the provided `href` to an absolute url
  if (href.startsWith("/")) href = new URL(href, SITE.url).toString();

  // compute the url to use for the "click to tweet" style button
  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.append(
    "text",
    `Checkout this on ${TWITTER.handle}!\n\n${href}`,
  );
  twitterUrl.searchParams.append("original_referer", SITE.url);
  twitterUrl.searchParams.append("related", TWITTER.handle);

  return (
    <>
      <SocialButtonLink
        href={twitterUrl.toString()}
        title={"Share Twitter / X"}
        icon={Twitter}
        newTab={true}
      />
      {/* <SocialButtonLink
        href={twitterUrl.toString()}
        title={"Share on Linkedin"}
        icon={Linkedin}
        newTab={true}
      /> */}
      {/* <SocialButton
        title={"Copy link to clipboard"}
        icon={LinkIcon}
        // onClick={() => {
        //   navigator.clipboard.writeText(href);
        // }}
      /> */}
    </>
  );
});
