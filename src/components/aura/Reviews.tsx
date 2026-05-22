import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/lib/store-service";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

export function Reviews() {
  const { data: dbReviews = [], isLoading } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: storeService.getApprovedReviews,
  });

  const reviews = dbReviews.map(r => ({
    testimonial: r.comment,
    by: r.customer_name,
    imgSrc: r.image_url || undefined
  }));

  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="bg-aura-void py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="caption-sm text-aura-text-faint uppercase tracking-widest block mb-2">آراء زبائننا</span>
          <h2 className="display-lg text-aura-text tracking-tight">ماذا يقولون عن AURA WEAR</h2>
        </div>
      </div>

      <StaggerTestimonials testimonials={reviews} />
    </section>
  );
}
