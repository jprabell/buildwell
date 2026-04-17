import { cn } from "@/lib/utils";

interface CostBadgeProps {
  level: 1 | 2 | 3 | 4;
  note?: string;
  className?: string;
}

export default function CostBadge({ level, note, className }: CostBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="font-bold text-sm tracking-tight">
        <span className="text-amber-500">{"$".repeat(level)}</span>
        <span className="text-slate-200">{"$".repeat(4 - level)}</span>
      </span>
      {note && <span className="text-xs text-slate-400">{note}</span>}
    </div>
  );
}
