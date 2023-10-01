import clsx from "clsx";

type SimpleHeroHeaderProps = SimpleComponentProps & {
  title: string;
  description: string;
};

export const SimpleHeroHeader = ({
  title,
  description,
  className,
}: SimpleHeroHeaderProps) => {
  return (
    <section className={clsx("py-4 md:py-8", className)}>
      <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>

      <p className="text-base md:text-lg text-gray-500">{description}</p>
    </section>
  );
};
