import { Check } from "lucide-react";

export function StepSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center p-6 bg-aura-surface animate-in zoom-in-95 duration-500">
      <div className="text-center max-w-lg">
        <div className="mx-auto mb-10 inline-flex h-28 w-24 items-center justify-center rounded-full border border-aura-violet/30 bg-aura-surface text-aura-success">
          <Check size={56} strokeWidth={3} />
        </div>
        <h2 className="display-md text-aura-text mb-6 tracking-tighter uppercase">تم استلام طلبك!</h2>
        <p className="body-md text-aura-text-muted mb-12 leading-relaxed max-w-sm mx-auto">
          سوف نتصل بك هاتفياً خلال الـ 24 ساعة القادمة لتأكيد معلومات التوصيل. شكراً لثقتك بـ AURA WEAR.
        </p>
        <button
          onClick={onClose}
          className="inline-flex h-16 items-center justify-center rounded-full bg-aura-violet px-16 text-white body-strong tracking-widest uppercase transition-transform duration-base active:scale-95 hover:bg-aura-violet-dim"
        >
          العودة للمتجر
        </button>
      </div>
    </div>
  );
}
