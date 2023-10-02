import NextLink from "next/link";
import styles from "@/styles/SocialButton.module.css";
import { Icon as FeatherIcon } from "react-feather";
import { Linkedin, Link as LinkIcon, Twitter } from "react-feather";
import { memo } from "react";
import clsx from "clsx";

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

type SocialButtonProps = SocialButtonBaseProps & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 *
 */
export const SocialButton = memo(
  ({ title, onClick, icon: IconToUse }: SocialButtonProps) => {
    return (
      <button
        onClick={onClick}
        type="button"
        title={title}
        className={styles.button}
      >
        <IconToUse className="w-4 md:w-5 h-4 md:h-5" strokeWidth={1} />
      </button>
    );
  },
);

type SocialShareButtonsProps = {};

/**
 * Standard buttons to share a link on popular social media platforms
 */
export const SocialShareButtons = memo(({}: SocialShareButtonsProps) => {
  return (
    <>
      <SocialButton title={"Share Twitter / X"} icon={Twitter} />
      <SocialButton title={"Share on Linkedin"} icon={Linkedin} />
      <SocialButton title={"Copy link to clipboard"} icon={LinkIcon} />
    </>
  );
});
