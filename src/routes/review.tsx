import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Upload, X, ChevronRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaUploader } from "@/components/admin/MediaUploader";
import logoWhite from "@/assets/aura-logo-white.png";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        customer_name: customerName,
        rating,
        comment,
        image_url: imageUrl,
        is_approved: false,
      });

      if (error) throw error;
      setSubmitted(true);
      toast.success("Review submitted! Thank you.");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-aura-black flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full text-center space-y-6 bg-aura-surface border border-aura-border rounded-[16px] p-10">
          <div className="flex justify-center">
            <CheckCircle2 size={64} className="text-aura-success animate-in zoom-in duration-500" />
          </div>
          <h1 className="heading-xl text-aura-text tracking-tight">شكراً لك!</h1>
          <p className="body-md text-aura-text-muted leading-relaxed">
            تم استلام رأيك بنجاح. سيتم نشره على الموقع بعد مراجعته من قبل فريقنا.
          </p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full h-16 rounded-full bg-aura-violet text-white body-strong flex items-center justify-center gap-2 hover:bg-aura-violet-dim transition-all duration-base active:scale-95"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aura-black rtl" dir="rtl">
      {/* Header */}
      <header className="border-b border-aura-border px-8 py-6 flex justify-center sticky top-0 bg-aura-void z-10">
        <img src={logoWhite} alt="AURA WEAR" className="h-8 w-auto" />
      </header>

      <main className="max-w-xl mx-auto px-4 py-12 sm:py-20">
        <div className="space-y-2 mb-12 text-center">
          <span className="caption-sm text-aura-text-faint uppercase tracking-widest block">رأيك يهمنا</span>
          <h1 className="display-md text-aura-text tracking-tight">شاركنا تجربتك</h1>
          <p className="body-md text-aura-text-muted">أخبرنا عن رأيك في منتجات AURA WEAR</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <div className="space-y-4">
            <label className="caption-sm text-aura-text-muted uppercase tracking-widest block text-center">التقييم</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-2 transition-all duration-base hover:scale-110 active:scale-90"
                >
                  <Star
                    size={40}
                    className={s <= rating ? "fill-aura-violet-text text-aura-violet-text" : "text-aura-border"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <label htmlFor="customer-name" className="caption-sm text-aura-text-muted uppercase tracking-widest block">الاسم الكامل</label>
            <input
              id="customer-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثلاً: محمد الأمين"
              className="w-full h-14 rounded-full border border-aura-border px-6 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="review-comment" className="caption-sm text-aura-text-muted uppercase tracking-widest block">رأيك</label>
            <textarea
              id="review-comment"
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك هنا..."
              className="w-full rounded-[28px] border border-aura-border p-6 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="caption-sm text-aura-text-muted uppercase tracking-widest block">صورة المنتج (اختياري)</label>
            <div className="flex justify-center">
              <MediaUploader
                value={imageUrl}
                onChange={setImageUrl}
                prefix="reviews"
                label="ارفع صورة وأنت ترتدي المنتج"
              />
            </div>
            {imageUrl && (
              <div className="relative aspect-square w-32 mx-auto rounded-lg overflow-hidden border border-aura-border">
                <img src={imageUrl} alt="Review preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-1 right-1 h-6 w-6 bg-aura-error/70 text-white rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-aura-error transition-all duration-base"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-16 rounded-full bg-aura-violet text-white body-strong flex items-center justify-center gap-3 disabled:opacity-50 transition-all duration-base active:scale-95 hover:bg-aura-violet-dim"
          >
            {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
            {!submitting && <ChevronRight size={20} className="rotate-180" />}
          </button>
        </form>
      </main>
    </div>
  );
}
