import Image from "next/image";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className = "" }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[color:var(--brand-soft)] bg-[linear-gradient(135deg,var(--surface)_0%,var(--brand-soft)_100%)] p-2 shadow-[0_10px_25px_rgba(47,93,80,0.16)] ${compact ? "h-11 w-11" : "h-14 w-14"}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(78,123,109,0.25),transparent_70%)]" />
        <Image
          src="/ethny-logo-cercle-brise.svg"
          alt="Ethny"
          width={compact ? 28 : 36}
          height={compact ? 28 : 36}
          priority
          className="relative z-10 drop-shadow-sm"
        />
      </div>
      <div className="min-w-0">
        <p className={`font-semibold uppercase tracking-[0.32em] text-[color:var(--brand-strong)] ${compact ? "text-[10px]" : "text-sm"}`}>
          Ethny
        </p>
        <p className={`mt-1 text-[color:var(--foreground-muted)] ${compact ? "text-[9px]" : "text-xs"}`}>
          Chef Réginald Smit
        </p>
      </div>
    </div>
  );
}
