import { memo } from "react";
import { GitHub, Linkedin, Link as LinkIcon, Twitter } from "react-feather";
import { SocialButtonLink } from "./SocialButtons";

type SocialLinksProps = {
  className?: string;
  website?: string;
  twitter?: string;
  github?: string;
};

export const SocialLinks = memo(
  ({ className, website, twitter, github }: SocialLinksProps) => {
    return (
      <div className={`flex items-center gap-2 ${className ?? ""} `}>
        {!!website && (
          <SocialButtonLink
            href={new URL(
              website.replace(/^(https?:\/\/)?/gi, "https://"),
            ).toString()}
            title={website}
            icon={LinkIcon}
            newTab={true}
          />
        )}
        {!!twitter && (
          <SocialButtonLink
            href={`https://twitter.com/${twitter}`}
            title={`@${twitter} on Twitter / X`}
            icon={Twitter}
            newTab={true}
          />
        )}
        {/* {!!linkedin && (
          <SocialButtonLink
            href={"#"}
            title={`${linkedin} on Linkedin`}
            icon={Linkedin}
            newTab={true}
          />
        )} */}
        {!!github && (
          <SocialButtonLink
            href={`https://github.com/${github}`}
            title={`@${github} on GitHub`}
            icon={GitHub}
            newTab={true}
          />
        )}
      </div>
    );
  },
);
