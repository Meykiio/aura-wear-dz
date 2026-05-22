import { useQuery } from "@tanstack/react-query";
import { productsToMap, catalogQuery, type Pack, type PackItem } from "@/lib/store-service";

interface PackCardProps {
  pack: Pack;
  onOrder: () => void;
}

export function PackCard({ pack, onOrder }: PackCardProps) {
  const { data: products = [] } = useQuery(catalogQuery);
  const productsMap = productsToMap(products);
  const items = ((pack.items as unknown) as PackItem[]) || [];
  const labelPiece = pack.name.split(" ")[1] || pack.name;

  return (
    <article
      onClick={onOrder}
      className="group flex flex-col bg-aura-surface border border-aura-border hover:border-aura-violet rounded-[12px] transition-all duration-base cursor-pointer active:scale-[0.99] hover:scale-[1.01]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOrder();
        }
      }}
    >
      <div className="aspect-[4/5] bg-aura-surface-2 flex items-center justify-center overflow-hidden relative rounded-t-[12px]">
        {pack.media_url ? (
          pack.media_type === "video" ? (
            <video src={pack.media_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={pack.media_url} alt={pack.name} loading="lazy" className="w-full h-full object-cover" />
          )
        ) : (
          <>
            <div className="display-lg text-aura-text-muted/20 select-none rotate-[-12deg] scale-150">AURA</div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="w-full h-full border border-aura-border/30 flex flex-col items-center justify-center gap-4 bg-aura-surface/40 backdrop-blur-sm transition-all group-hover:bg-aura-surface/60">
                <span className="display-md text-aura-text-muted/30">{labelPiece}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display-md text-aura-text tracking-tight uppercase">{pack.name}</h3>
          <div className="text-end">
            <div className="body-strong text-aura-violet-text leading-none font-bold">
              {pack.price.toLocaleString("fr-DZ")}
              <span className="caption-sm ml-1 text-aura-text-muted uppercase">دج</span>
            </div>
          </div>
        </div>

        <p className="caption-md text-aura-text-muted mt-2 line-clamp-2">{pack.positioning}</p>

        <ul className="mt-8 space-y-3 flex-1">
          {items.map((it) => {
            const def = productsMap[it.product];
            return (
              <li key={it.product} className="flex items-center justify-between group/item">
                <span className="body-md text-aura-text">
                  {def?.name || it.product} {it.qty > 1 ? `× ${it.qty}` : ""}
                </span>
                {it.free && (
                  <span className="inline-flex items-center rounded-full bg-aura-surface-2 border border-aura-border text-aura-text-muted px-2 py-0.5 utility-xs font-bold">
                    مجاناً
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div
          className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-aura-violet text-white body-strong group-hover:bg-aura-violet-dim transition-all duration-base uppercase tracking-tight"
        >
          اطلب هذا الباك
        </div>
      </div>
    </article>
  );
}
