import { memo } from "react";

type ComponentProps = SimpleComponentProps & {
  title: string;
  description?: string;
};

export const SettingsHeader = memo(
  ({ title, description, children, className = "" }: ComponentProps) => {
    return (
      <header className={`flex pb-2 justify-between items-center ${className}`}>
        <section className="space-y-2">
          <h1 className="font-semibold text-2xl">{title}</h1>
          {!!description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </section>

        {!!children && children}
      </header>
    );
  },
);
