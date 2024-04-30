import { memo } from "react";

type Props = {
  className?: string;
};

export const NewsletterSignupForm = memo(({ className = "" }: Props) => (
  <iframe
    className={`w-full max-w-sm ${className}`}
    src="https://embeds.beehiiv.com/a66adadb-697d-4f5a-b645-69fd28b6c9f9?slim=true"
    data-test-id="beehiiv-embed"
    height="52"
    frameBorder="0"
    scrolling="no"
  ></iframe>
));
