import type { ReactNode } from "react";

// The dark strip at the top of every page (Figma: Utility Bar).
export default function UtilityBar({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-[30px] items-center gap-[18px] border-t-[3px] border-brand-purple bg-util px-6">
      <span className="bg-white px-[14px] py-[5px] font-heading text-[10px] font-bold uppercase text-ink">
        {label}
      </span>
      <div className="flex-1" />
      <div className="flex items-center gap-[18px] font-heading text-[10px] font-bold uppercase text-white">
        {children}
      </div>
    </div>
  );
}
