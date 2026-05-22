import { useEffect, useMemo, useReducer, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { storeService, productsToMap, unitsForPack, type Pack } from "@/lib/store-service";
import { StepCustomize } from "./order/StepCustomize";
import { StepSummary } from "./order/StepSummary";
import { StepShipping } from "./order/StepShipping";
import { StepSuccess } from "./order/StepSuccess";

type Step = 0 | 1 | 2 | 3;
interface State {
  step: Step;
  units: Record<string, { size?: string; color?: string }>;
  qty: number;
  customer: { name: string; phone: string; wilaya: string; address: string; note: string };
}

type OrderAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "setUnit"; id: string; patch: { size?: string; color?: string } }
  | { type: "setQty"; qty: number }
  | { type: "setCustomer"; patch: Partial<State["customer"]> }
  | { type: "success" };

export function OrderModal({ pack, onClose }: { pack: Pack; onClose: () => void }) {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: storeService.getProducts,
  });
  const productsMap = useMemo(() => productsToMap(products), [products]);
  const units = useMemo(() => unitsForPack(pack, productsMap), [pack, productsMap]);

  const [state, dispatch] = useReducer((s: State, a: OrderAction) => {
    if (a.type === "next") return { ...s, step: (s.step + 1) as Step };
    if (a.type === "back") return { ...s, step: (s.step - 1) as Step };
    if (a.type === "setUnit") return { ...s, units: { ...s.units, [a.id]: { ...s.units[a.id], ...a.patch } } };
    if (a.type === "setQty") return { ...s, qty: a.qty };
    if (a.type === "setCustomer") return { ...s, customer: { ...s.customer, ...a.patch } };
    if (a.type === "success") return { ...s, step: 3 as Step };
    return s;
  }, { step: 0, units: {}, qty: 1, customer: { name: "", phone: "", wilaya: "", address: "", note: "" } } as State);

  const [submitting, setSubmitting] = useState(false);
  const total = pack.price * state.qty;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const isValid = () => {
    if (state.step === 0) return units.every(u => {
      const def = productsMap[u.product];
      const v = state.units[u.id];
      return v?.color && (!def?.has_size || v?.size);
    });
    if (state.step === 2) return state.customer.name.length >= 2 && /^[0-9+\s]{8,}$/.test(state.customer.phone) && !!state.customer.wilaya && state.customer.address.length >= 5;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert({
      customer_name: state.customer.name,
      phone: state.customer.phone,
      wilaya: state.customer.wilaya,
      address: state.customer.address,
      note: state.customer.note,
      pack_name: pack.name,
      pack_quantity: state.qty,
      pack_price: pack.price,
      total_price: total,
      customizations: units.map(u => ({
        product_key: u.product,
        product_name: productsMap[u.product]?.name,
        label: u.label,
        size: state.units[u.id]?.size || null,
        color: state.units[u.id]?.color,
      })),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Error submitting order.");
    } else {
      dispatch({ type: "success" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-aura-black/90 backdrop-blur-sm rtl flex flex-col" dir="rtl">
      <header className="flex items-center justify-between border-b border-aura-border px-8 py-6 bg-aura-surface sticky top-0 z-10">
        <button onClick={onClose} className="size-12 flex items-center justify-center rounded-full hover:bg-aura-surface-2 transition-all duration-base active:scale-95 text-aura-text"><X size={28} /></button>
        <div className="heading-lg text-aura-text uppercase tracking-tighter">{pack.name}</div>
        <div className="w-12" />
      </header>

      <div className="flex-1 overflow-y-auto bg-aura-surface pb-32">
        {state.step === 0 && <StepCustomize units={units} productsMap={productsMap} values={state.units} onChange={(id, patch) => dispatch({ type: "setUnit", id, patch })} />}
        {state.step === 1 && <StepSummary pack={pack} qty={state.qty} units={units} values={state.units} onQty={(q) => dispatch({ type: "setQty", qty: q })} />}
        {state.step === 2 && <StepShipping customer={state.customer} onChange={(patch) => dispatch({ type: "setCustomer", patch })} />}
        {state.step === 3 && <StepSuccess onClose={onClose} />}
      </div>

      {state.step < 3 && (
        <footer className="fixed bottom-0 inset-x-0 border-t border-aura-border p-8 bg-aura-surface flex items-center gap-6 z-10">
          {state.step > 0 && <button onClick={() => dispatch({ type: "back" })} className="h-16 px-10 rounded-full border border-aura-border text-aura-text body-strong hover:border-aura-border-light transition-all duration-base active:scale-95">السابق</button>}
          <div className="flex-1 text-end"><div className="caption-sm text-aura-text-muted uppercase tracking-widest">المجموع النهائي</div><div className="heading-xl text-aura-text">{total.toLocaleString()} دج</div></div>
          <button disabled={!isValid() || submitting} onClick={state.step < 2 ? () => dispatch({ type: "next" }) : submit} className="h-16 px-12 rounded-full bg-aura-violet text-white body-strong disabled:opacity-20 active:scale-95 transition-all duration-base flex items-center gap-4 hover:bg-aura-violet-dim">
            {state.step < 2 ? "التالي" : submitting ? "جارٍ الإرسال..." : "تأكيد الطلب"} {state.step < 2 && <ChevronRight size={20} className="rotate-180" />}
          </button>
        </footer>
      )}
    </div>
  );
}
