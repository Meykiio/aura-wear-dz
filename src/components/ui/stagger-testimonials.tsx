import React, { useState, useEffect, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  imgSrc: string;
  name: string;
  offsetX: number;
  offsetY: number;
}

const TOOLTIP_W = 208;
const TOOLTIP_H = (TOOLTIP_W * 16) / 9;
const GAP = 16;

function calcPosition(clientX: number, clientY: number) {
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
}

function ReviewTooltip({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip.visible) return null;

  const { x, y, imgSrc, offsetX, offsetY } = tooltip;

  const baseClasses = "fixed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200";
  const sizeClasses = "w-44 sm:w-52 aspect-[9/16]";
  const roundedClasses = "rounded-xl overflow-hidden border border-aura-border shadow-2xl";

  const style: CSSProperties = {
    left: x + offsetX,
    top: y + offsetY,
  };

  return (
    <div className={baseClasses} style={style}>
      <div className={`${sizeClasses} ${roundedClasses} bg-aura-surface-2`}>
        <img src={imgSrc} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
  onAvatarHover: (e: React.MouseEvent, imgSrc: string, name: string) => void;
  onAvatarLeave: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
  onAvatarHover,
  onAvatarLeave,
}) => {
  const isCenter = position === 0;

  return (
    <button
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out text-left",
        isCenter
          ? "z-10 bg-aura-violet text-white border-aura-violet"
          : "z-0 bg-aura-surface text-aura-text border-aura-border hover:border-aura-violet/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
      }}
    >
      {testimonial.imgSrc && (
        <img
          src={testimonial.imgSrc}
          alt={testimonial.by}
          onMouseMove={(e) => onAvatarHover(e, testimonial.imgSrc!, testimonial.by)}
          onMouseLeave={onAvatarLeave}
          className="mb-4 size-12 rounded-full object-cover grayscale cursor-pointer"
        />
      )}
      <p className="body-md italic leading-relaxed">
        "{testimonial.testimonial}"
      </p>
      <div className="mt-6">
        <p className="caption-sm uppercase tracking-widest opacity-70">
          - {testimonial.by}
        </p>
      </div>
    </button>
  );
};

interface StaggerTestimonialsProps {
  testimonials: {
    testimonial: string;
    by: string;
    imgSrc?: string;
  }[];
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({ testimonials }) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, imgSrc: "", name: "", offsetX: 0, offsetY: 0 });

  useEffect(() => {
    setTestimonialsList(testimonials.map((t, i) => ({ ...t, tempId: i })));
  }, [testimonials]);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleAvatarHover = (e: React.MouseEvent, imgSrc: string, name: string) => {
    const { offsetX, offsetY } = calcPosition(e.clientX, e.clientY);
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, imgSrc, name, offsetX, offsetY });
  };

  const handleAvatarLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  if (testimonialsList.length === 0) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-aura-void">
      <ReviewTooltip tooltip={tooltip} />
      <div className="absolute inset-0 flex items-center justify-center">
        {testimonialsList.map((testimonial, index) => {
          const position = testimonialsList.length % 2
            ? index - (testimonialsList.length - 1) / 2
            : index - testimonialsList.length / 2;

          if (Math.abs(position) > 3) return null;

          return (
            <TestimonialCard
              key={testimonial.tempId}
              position={position}
              testimonial={testimonial}
              handleMove={handleMove}
              cardSize={cardSize}
              onAvatarHover={handleAvatarHover}
              onAvatarLeave={handleAvatarLeave}
            />
          );
        })}
      </div>

      <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex size-14 items-center justify-center transition-colors",
            "bg-aura-surface border-2 border-aura-border hover:bg-aura-violet hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-violet focus-visible:ring-offset-2 focus-visible:ring-offset-aura-void"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex size-14 items-center justify-center transition-colors",
            "bg-aura-surface border-2 border-aura-border hover:bg-aura-violet hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-violet focus-visible:ring-offset-2 focus-visible:ring-offset-aura-void"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};
