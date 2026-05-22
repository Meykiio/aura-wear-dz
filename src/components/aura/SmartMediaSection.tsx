interface SmartMediaProps {
  title: string;
  subtitle: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  reverse?: boolean;
}

export function SmartMediaSection({ title, subtitle, mediaUrl, mediaType, reverse }: SmartMediaProps) {
  return (
    <section className={`bg-aura-black py-24 sm:py-32 ${reverse ? 'rtl' : ''}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
          <div className="flex-1 w-full">
            <div className="aspect-[16/10] bg-aura-surface-2 overflow-hidden relative rounded-[12px] border border-aura-border">
              {mediaType === "video" ? (
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img src={mediaUrl} alt={title} className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          <div className="flex-1 text-right md:text-start">
            <span className="caption-sm text-aura-text-faint uppercase tracking-widest block mb-4">اكتشف مجموعتنا</span>
            <h2 className="display-lg text-aura-text mb-6 tracking-tight">{title}</h2>
            <p className="body-md text-aura-text-muted leading-relaxed mb-8">{subtitle}</p>
            <div className="h-1 w-20 bg-aura-violet" />
          </div>
        </div>
      </div>
    </section>
  );
}
