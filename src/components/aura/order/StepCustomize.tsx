import { useState, useEffect, type CSSProperties } from "react";
import type { Product, PackUnit } from "@/lib/store-service";

interface UnitState {
  size?: string;
  color?: string;
}

interface Props {
  units: PackUnit[];
  productsMap: Record<string, Product>;
  values: Record<string, UnitState>;
  onChange: (id: string, patch: UnitState) => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  image_urls: string[];
  hex: string;
  name: string;
  offsetX: number;
  offsetY: number;
}

function ColorTooltip({ tooltip }: { tooltip: TooltipState }) {
  const [current, setCurrent] = useState(0);

  const { x, y, image_urls, hex, name, offsetX, offsetY } = tooltip;

  useEffect(() => {
    setCurrent(0);
    if (image_urls.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % image_urls.length);
    }, 3000);
    return () => clearInterval(id);
  }, [image_urls]);

  if (!tooltip.visible) return null;

  const baseClasses = "fixed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200";
  const sizeClasses = "w-44 sm:w-52 aspect-[9/16]";
  const roundedClasses = "rounded-xl overflow-hidden border border-aura-border shadow-2xl";

  const style: CSSProperties = {
    left: x + offsetX,
    top: y + offsetY,
  };

  if (image_urls.length > 0) {
    return (
      <div className={baseClasses} style={style}>
        <div className={`${sizeClasses} ${roundedClasses} bg-aura-surface-2 relative`}>
          {image_urls.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`${name} ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{ opacity: i === current ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses} style={style}>
      <div className={`${sizeClasses} ${roundedClasses}`} style={{ backgroundColor: hex }}>
        <div className="w-full h-full flex items-center justify-center text-aura-text-muted/50 display-md uppercase italic text-sm">
          {name}
        </div>
      </div>
    </div>
  );
}

export function StepCustomize({ units, productsMap, values, onChange }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, image_urls: [], hex: "", name: "", offsetX: 0, offsetY: 0 });

  const TOOLTIP_W = 208;
  const TOOLTIP_H = (TOOLTIP_W * 16) / 9;
  const GAP = 16;

  const calcPosition = (clientX: number, clientY: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let offsetX = GAP;
    let offsetY = -TOOLTIP_H / 2;

    if (clientX + GAP + TOOLTIP_W > vw) {
      offsetX = -GAP - TOOLTIP_W;
    }

    if (clientY - TOOLTIP_H / 2 < 0) {
      offsetY = GAP;
    } else if (clientY + TOOLTIP_H / 2 > vh) {
      offsetY = -TOOLTIP_H - GAP;
    }

    return { offsetX, offsetY };
  };

  const handleColorMove = (e: React.MouseEvent, image_urls: string[], hex: string, name: string) => {
    const { offsetX, offsetY } = calcPosition(e.clientX, e.clientY);
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, image_urls, hex, name, offsetX, offsetY });
  };

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-10 space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
      <ColorTooltip tooltip={tooltip} />
      {units.map((u) => {
        const def = productsMap[u.product];
        const v = values[u.id] ?? {};

        return (
          <div key={u.id} className="border-b border-aura-border pb-10 last:border-0 group">
            <div className="heading-lg text-aura-text mb-6 uppercase tracking-tight group-hover:translate-x-1 transition-transform duration-base">
              {u.label}
            </div>

            {def?.has_size && (def.sizes?.length ?? 0) > 0 && (
              <div className="mb-8">
                <div className="caption-sm text-aura-text-muted mb-4 uppercase tracking-widest">المقاس</div>
                <div className="flex flex-wrap gap-2">
                  {def.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => onChange(u.id, { size: s })}
                      className={`min-w-[56px] h-14 rounded-full px-6 body-strong border transition-all duration-base active:scale-95 ${
                        v.size === s
                          ? "bg-aura-violet text-white border-aura-violet"
                          : "bg-aura-surface-2 text-aura-text border-aura-border hover:border-aura-violet"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="caption-sm text-aura-text-muted mb-4 uppercase tracking-widest">اللون</div>
              <div className="flex flex-wrap gap-3">
                {def?.colors.map((c) => {
                  const selected = v.color === c.name;
                  return (
                    <button
                      key={c.id}
                      onMouseMove={(e) => handleColorMove(e, c.image_urls, c.hex, c.name)}
                      onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                      onClick={() => onChange(u.id, { color: c.name })}
                      title={c.name}
                      className={`relative h-14 w-14 rounded-full border-2 transition-all duration-base active:scale-90 overflow-hidden ${
                        selected ? "ring-2 ring-aura-violet ring-offset-2 ring-offset-aura-surface" : "border-aura-border"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {c.image_url && <img src={c.image_url} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />}
                      {selected && (
                        <div className="absolute inset-0 m-auto h-6 w-6 rounded-full border-2 border-white bg-aura-violet/70" />
                      )}
                    </button>
                  );
                })}
              </div>
              {v.color && <div className="caption-md text-aura-text mt-4 font-medium">{v.color}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
