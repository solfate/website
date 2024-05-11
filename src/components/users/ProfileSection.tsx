import { memo } from "react";

type ProfileSectionProps = {
  title?: string;
  children: React.ReactNode;
};

export const ProfileSection = memo(
  ({ title, children }: ProfileSectionProps) => (
    <section className="flex-grow space-y-8">
      <section className="space-y-2">
        {!!title && <h5 className="text-lg font-semibold">{title}</h5>}

        {children}
      </section>
    </section>
  ),
);
