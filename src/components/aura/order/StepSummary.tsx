import type { Pack, PackUnit } from "@/lib/store-service";

interface Step2Props {
  pack: Pack;
  qty: number;
  units: PackUnit[];
  values: Record<string, { size?: string; color?: string }>;
  onQty: (n: number) => void;
}

export function StepSummary({ pack, qty, units, values, onQty }: Step2Props) {
  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-10 space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="text-center">
        <div className="caption-sm text-aura-text-muted mb-6 uppercase tracking-widest">عدد الباكات</div>
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => onQty(Math.max(1, qty - 1))}
            className="h-16 w-16 rounded-full border border-aura-border flex items-center justify-center text-3xl text-aura-text hover:bg-aura-surface-2 transition-all duration-base active:scale-90"
          >
            −
          </button>
          <div className="display-md text-aura-text w-24 text-center">{qty}</div>
          <button
            onClick={() => onQty(qty + 1)}
            className="h-16 w-16 rounded-full border border-aura-border flex items-center justify-center text-3xl text-aura-text hover:bg-aura-surface-2 transition-all duration-base active:scale-90"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-aura-surface-2 p-8 rounded-[12px] border border-aura-border/50">
        <div className="heading-md text-aura-text mb-8 uppercase tracking-tight border-b border-aura-border pb-4 flex justify-between">
          <span>ملخص الطلب</span>
          <span className="text-aura-text-muted">({qty} × {pack.name})</span>
        </div>
        <div className="space-y-4">
          {units.map((u) => {
            const v = values[u.id] ?? {};
            return (
              <div key={u.id} className="flex justify-between items-center group">
                <span className="body-strong text-aura-text group-hover:translate-x-1 transition-transform duration-base">{u.label}</span>
                <span className="caption-md text-aura-text-muted bg-aura-surface px-4 py-1.5 rounded-full border border-aura-border">
                  {v.size ? `${v.size} · ` : ""}
                  {v.color}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-10 pt-8 border-t border-aura-border flex justify-between items-baseline">
          <div className="flex flex-col">
             <span className="body-md text-aura-text-muted italic">السعر الإجمالي</span>
             <span className="caption-sm text-aura-text-muted uppercase mt-1">توصيل مجاني مشمول</span>
          </div>
          <span className="display-md text-aura-text">{(pack.price * qty).toLocaleString("fr-DZ")} دج</span>
        </div>
      </div>
    </div>
  );
}
