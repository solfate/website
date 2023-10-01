import NextLink from "next/link";
import styles from "@/styles/SocialButton.module.css";
import { Icon as FeatherIcon } from "react-feather";
import { Linkedin, Link as LinkIcon, Twitter } from "react-feather";
import { memo } from "react";

type SocialButtonBaseProps = {
  title: string;
  label?: string;
  icon: FeatherIcon;
};

/**
 * Open a social media platform to the desired url
 */
export const SocialButtonLink = memo(
  ({
    title,
    label,
    href,
    icon: IconToUse,
  }: SocialButtonBaseProps & { href: string }) => {
    return (
      <NextLink
        title={title}
        href={href}
        className={`${styles.button} ${!!label ? "!px-3" : ""}`}
      >
        <IconToUse className="w-5 h-5" strokeWidth={1} />
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
        <IconToUse className="w-5 h-5" strokeWidth={1} />
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
