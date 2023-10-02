import clsx from "clsx";
import Link from "next/link";
import { memo } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";

type NextPrevItem = {
  href?: string;
  label?: string;
  component?: React.ReactNode;
  className?: string;
};

type NextPrevButtonsProps = {
  className?: string;
  next?: NextPrevItem;
  prev?: NextPrevItem;
};

export const NextPrevButtons = memo(
  ({ next, prev, className }: NextPrevButtonsProps) => (
    <section
      className={clsx("flex items-center gap-4 justify-between", className)}
    >
      {prev?.href ? (
        <Link
          href={prev.href}
          className={clsx("btn flex items-center gap-4", prev.className)}
        >
          <ArrowLeft strokeWidth={2} className="w-5 h-5" />
          {prev.component ?? <span>{prev.label ?? "Previous"}</span>}
        </Link>
      ) : (
        <div></div>
      )}

      {next?.href ? (
        <Link
          href={next.href}
          className={clsx("btn flex items-center gap-4", next.className)}
        >
          {next.component ?? <span>{next.label ?? "Next"}</span>}
          <ArrowRight strokeWidth={2} className="w-5 h-5" />
        </Link>
      ) : (
        <div></div>
      )}
    </section>
  ),
);
