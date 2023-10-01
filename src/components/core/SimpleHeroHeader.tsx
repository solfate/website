type SimpleHeroHeaderProps = {
  title: string;
  description: string;
};

export const SimpleHeroHeader = ({
  title,
  description,
}: SimpleHeroHeaderProps) => {
  return (
    <section className="py-4 md:py-8">
      <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>

      <p className="text-lg text-gray-500">{description}</p>
    </section>
  );
};
