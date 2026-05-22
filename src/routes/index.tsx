import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storeService, packsQuery } from "@/lib/store-service";
import { Navbar } from "@/components/aura/Navbar";
import { Hero } from "@/components/aura/Hero";
import { PackCard } from "@/components/aura/PackCard";
import { Reviews } from "@/components/aura/Reviews";
import { OrderModal } from "@/components/aura/OrderModal";
import logoWhite from "@/assets/aura-logo-white.png";
import type { Pack } from "@/lib/store-service";

export const Route = createFileRoute("/")({
  component: Landing,
});

export function Landing() {
  const [activePack, setActivePack] = useState<Pack | null>(null);
  const [showFloating, setShowFloating] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const packsRef = useRef<HTMLElement>(null);

  const { data: packs = [] } = useQuery(packsQuery);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const packsTop = packsRef.current?.getBoundingClientRect().top ?? Infinity;
      setShowFloating(window.scrollY > 800 && packsTop > 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPacks = () =>
    packsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const socialLinks = {
    instagram: "https://www.instagram.com/aura_wear_dz",
    facebook: "https://www.facebook.com/profile.php?id=61560991005787"
  };

  return (
    <div className="rtl bg-aura-black text-aura-text min-h-screen" dir="rtl">
      <Navbar isScrolled={isScrolled} scrollToPacks={scrollToPacks} />

      <Hero scrollToPacks={scrollToPacks} />

      <Reviews />

      {/* Packs Section */}
      <section ref={packsRef} className="bg-aura-black py-24 sm:py-32 border-t border-aura-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="caption-sm text-aura-text-faint uppercase tracking-widest block mb-2">باكاتنا</span>
              <h2 className="display-lg text-aura-text tracking-tight">اختر الباك لي يوالمك</h2>
            </div>
            <div className="h-px flex-1 bg-aura-border mx-8 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                onOrder={() => setActivePack(pack)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-aura-void border-t border-aura-border text-aura-text-muted py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col items-center text-center">
          <img src={logoWhite} alt="AURA WEAR" className="h-12 w-auto mb-8" />
          <p className="body-md text-aura-text-muted/70 max-w-md mb-12 leading-relaxed">
            الماركة الجزائرية التي تجمع بين الجودة والستايل العصري.
          </p>
          <div className="flex gap-8 mb-12">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="caption-sm uppercase tracking-widest hover:text-aura-violet-text transition-colors duration-base"
            >
              Instagram
            </a>
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="caption-sm uppercase tracking-widest hover:text-aura-violet-text transition-colors duration-base"
            >
              Facebook
            </a>
          </div>
          <p className="utility-xs text-aura-text-faint uppercase tracking-[0.2em]">
            © 2026 Aura Wear.
          </p>
        </div>
      </footer>

      {/* Mobile floating CTA */}
      {showFloating && (
        <button
          onClick={scrollToPacks}
          className="md:hidden fixed bottom-6 inset-x-6 z-40 h-16 rounded-full bg-aura-violet text-white body-strong transition-all duration-base animate-in fade-in slide-in-from-bottom-4"
        >
          اطلب الآن
        </button>
      )}

      {activePack && <OrderModal pack={activePack} onClose={() => setActivePack(null)} />}
    </div>
  );
}
