import { memo } from "react";
import { GitHub, Link as LinkIcon, Twitter } from "react-feather";
import { SocialButtonLink } from "@/components/SocialButtons";
import clsx from "clsx";
import { Person } from "@/types";

type SocialLinksForPersonProps = SimpleComponentProps & {
  person: Person;
};

/**
 * Display the standard social links for the podcast hosts
 */
export const SocialLinksForPerson = memo(
  ({ person, className }: SocialLinksForPersonProps) => (
    <div className={clsx("flex items-center gap-3", className)}>
      {person?.twitter && (
        <SocialButtonLink
          newTab={true}
          href={`https://twitter.com/${person.twitter}`}
          title={`@${person.twitter} on Twitter`}
          icon={Twitter}
        />
      )}

      {person?.github && (
        <SocialButtonLink
          newTab={true}
          href={`https://github.com/${person.github}`}
          title={`${person.github} on Github`}
          icon={GitHub}
        />
      )}

      {person?.website && (
        <SocialButtonLink
          newTab={true}
          href={person.website}
          title={person.website}
          icon={LinkIcon}
        />
      )}
    </div>
  ),
);
