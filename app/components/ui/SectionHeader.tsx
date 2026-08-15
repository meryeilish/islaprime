interface SectionHeaderProps {
  label: string;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
}

export default function SectionHeader({
  label,
  title,
  description,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={`mb-14 max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      <div
        className={`mb-5 flex items-center gap-4 ${centered ? "justify-center" : ""}`}
      >
        <span className="h-px w-12 bg-red-600" />
        <p className="text-xs font-black uppercase tracking-[0.45em] text-red-500">
          {label}
        </p>
        {centered && <span className="h-px w-12 bg-red-600" />}
      </div>

      <h2 className="text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 text-lg leading-8 text-zinc-400">{description}</p>
      )}
    </div>
  );
}
