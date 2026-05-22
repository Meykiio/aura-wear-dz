import logoWhite from "@/assets/aura-logo-white.png";

interface NavbarProps {
  isScrolled: boolean;
  scrollToPacks: () => void;
}

export function Navbar({ isScrolled, scrollToPacks }: NavbarProps) {
  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-base ${
        isScrolled
          ? "bg-aura-void/80 backdrop-blur-md h-16 border-b border-aura-border"
          : "bg-transparent h-20"
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-8 h-full">
        <a href="/" className="flex items-center gap-2 group">
          <img
            src={logoWhite}
            alt="AURA WEAR"
            className={`transition-transform duration-base group-hover:scale-105 ${isScrolled ? 'h-7' : 'h-8'} w-auto`}
          />
        </a>
        <button
          onClick={scrollToPacks}
          className={`inline-flex h-11 items-center rounded-full px-8 body-strong transition-all duration-base active:scale-95 ${
            isScrolled
              ? "bg-aura-violet text-white hover:bg-aura-violet-dim"
              : "bg-aura-violet/90 text-white border border-aura-violet hover:bg-aura-violet backdrop-blur-md"
          }`}
        >
          اطلب الآن
        </button>
      </div>
    </header>
  );
}
