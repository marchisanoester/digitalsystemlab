export function BrandDots({ small = false }: { small?: boolean }) {
  const size = small ? "h-1.5 w-1.5" : "h-[7px] w-[7px]";
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className={`${size} rounded-full bg-teal`} />
      <span className={`${size} rounded-full bg-orange`} />
      <span className={`${size} rounded-full bg-yellow`} />
    </span>
  );
}
