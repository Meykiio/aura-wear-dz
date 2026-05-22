import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Trash2, Star, X } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";

export function ReviewManager() {
  const qc = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const approve = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase.from("reviews").update({ is_approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["approved-reviews"] });
      toast.success("Review updated");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
  });

  if (isLoading) return <div className="p-12 text-center body-md text-aura-text-muted">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="heading-lg text-aura-text">Reviews</h2>
        <span className="caption-sm text-aura-text-muted">{reviews.length} total</span>
      </div>

      {reviews.length === 0 && (
        <div className="bg-aura-surface p-12 text-center body-md text-aura-text-muted rounded-[12px] border border-aura-border">No reviews yet.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-aura-surface p-6 border border-aura-border rounded-[12px]">
            <div className="flex justify-between items-start mb-3 gap-4">
              <div className="flex-1">
                <h3 className="body-strong text-aura-text">{r.customer_name}</h3>
                <div className="flex gap-0.5 mt-1 text-aura-violet-text">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              {r.image_url && (
                <div className="h-16 w-16 shrink-0 rounded-md overflow-hidden border border-aura-border bg-aura-surface-2">
                  <a href={r.image_url} target="_blank" rel="noopener noreferrer">
                    <img src={r.image_url} alt="Review" className="w-full h-full object-cover hover:scale-110 transition-transform duration-base" />
                  </a>
                </div>
              )}
              <span className={`utility-xs px-2 py-1 rounded-full uppercase tracking-widest shrink-0 ${r.is_approved ? "bg-aura-success/10 text-aura-success border border-aura-success/20" : "bg-aura-surface-2 text-aura-text-muted border border-aura-border"}`}>
                {r.is_approved ? "Approved" : "Pending"}
              </span>
            </div>
            <p className="body-md text-aura-text mb-4 italic">"{r.comment}"</p>
            <div className="flex gap-2">
              {!r.is_approved ? (
                <button onClick={() => approve.mutate({ id: r.id, is_approved: true })} className="inline-flex h-9 items-center gap-2 rounded-full bg-aura-success/10 border border-aura-success/20 text-aura-success px-4 caption-md hover:bg-aura-success/20 transition-all duration-base">
                  <Check size={14} /> Approve
                </button>
              ) : (
                <button onClick={() => approve.mutate({ id: r.id, is_approved: false })} className="inline-flex h-9 items-center gap-2 rounded-full border border-aura-border text-aura-text-muted px-4 caption-md hover:bg-aura-surface-2 transition-all duration-base">
                  <X size={14} /> Unapprove
                </button>
              )}
              <button onClick={() => remove.mutate(r.id)} className="h-9 w-9 flex items-center justify-center rounded-full border border-aura-border text-aura-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-base">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
