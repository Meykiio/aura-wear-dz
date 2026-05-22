import { useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

interface HeroProps {
  scrollToPacks: () => void;
}

const DEFAULT_HERO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4";

export function Hero({ scrollToPacks }: HeroProps) {
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  const heroVideoUrl = import.meta.env.VITE_HERO_VIDEO_URL || DEFAULT_HERO_VIDEO;

  return (
    <section className="relative bg-aura-black text-aura-text min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Video Background (Direct MP4) */}
      <div className="absolute inset-0 z-0 bg-aura-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source
            src={heroVideoUrl}
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-aura-black/50 backdrop-blur-[1px]" />
      </div>

      <div className="absolute inset-0 opacity-10 z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full border border-aura-text animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[80%] h-[80%] rounded-full border border-aura-text/20" />
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 py-24 w-full flex flex-col items-center text-center">
        <span className="inline-flex items-center rounded-full border border-aura-text/40 px-4 py-1.5 utility-xs uppercase tracking-[0.2em] mb-8 bg-aura-black/20 backdrop-blur-sm">
          AURA WEAR — PACKS COLLECTION
        </span>
        <h1 className="display-campaign max-w-4xl tracking-tighter mb-8">
          ستايل كامل
          <br />
          لكل يوم.
        </h1>
        <p className="body-md text-aura-text-muted max-w-xl leading-relaxed mb-12">
          قطن عالي الجودة، ستايلات عصرية، وتوصيل مجاني لـ 58 ولاية مع ضمان التبديل.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-16">
          {[
            "توصيل مجاني 58 ولاية",
            "الدفع عند الاستلام",
            "قطن عالي الجودة",
            "ضمان التبديل أو الاسترجاع"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center justify-center sm:justify-start gap-3 text-aura-text">
              <div className="h-6 w-6 rounded-full bg-aura-success/20 flex items-center justify-center">
                <Check size={14} className="text-aura-success shrink-0" strokeWidth={3} />
              </div>
              <span className="body-strong tracking-tight">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            ref={heroCtaRef}
            onClick={scrollToPacks}
            className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-aura-violet px-12 text-white body-strong hover:bg-aura-violet-dim transition-all duration-base active:scale-95 uppercase tracking-tight"
          >
            استعرض الباكات
          </button>
          <button
            onClick={scrollToPacks}
            className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full border border-aura-border px-12 text-aura-text body-strong hover:border-aura-violet transition-all duration-base active:scale-95 backdrop-blur-sm"
          >
            اطلب الآن
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-aura-text/60 animate-bounce z-20">
        <ChevronDown size={32} strokeWidth={1.5} />
      </div>
    </section>
  );
}
