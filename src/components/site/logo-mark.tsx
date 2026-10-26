export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src="/brand/logo.png"
      alt=""
      width={176}
      height={140}
      className={`object-contain mix-blend-screen ${className}`}
    />
  );
}
