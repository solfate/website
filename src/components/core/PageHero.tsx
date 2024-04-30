import { memo } from "react";
import Link from "next/link";

type PageHeroProps = {
  title: React.ReactNode;
  href: string;
  className?: string;
  description: React.ReactNode;
  children?: React.ReactNode;
  ctaChildren?: React.ReactNode;
};

export const PageHero = memo(
  ({
    title,
    children,
    ctaChildren,
    href,
    description,
    className,
  }: PageHeroProps) => (
    <section
      className={`flex flex-col md:flex-row items-center justify-center md:flex lg:flex gap-8 gap-y-10 lg:mx-32 py-3 ${className || ""}`}
    >
      <div className="col-span-2 items-center flex text-center md:text-left">
        <div>
          <section className={"py-4 max-w-lg space-y-5"}>
            <h1 className="text-4xl md:text-[3.4rem] font-bold">
              <Link href={href}>{title}</Link>
            </h1>

            {!!description && (
              <p className="text-base md:text-lg text-gray-500">
                {description}
              </p>
            )}
          </section>

          {ctaChildren && ctaChildren}
        </div>
      </div>

      {children && (
        <div className="grid gap-2 max-w-md mx-auto justify-center justify-items-center md:max-w-sm">
          {children}
        </div>
      )}
    </section>
  ),
);
