import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, X, Save, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { storeService, type Pack, type PackItem, type Product } from "@/lib/store-service";
import { MediaUploader } from "./MediaUploader";

export function PackManager() {
  const qc = useQueryClient();
  const { data: packs = [], isLoading } = useQuery({
    queryKey: ["admin-packs"],
    queryFn: storeService.getPacks,
  });
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: storeService.getProducts,
  });

  const [editing, setEditing] = useState<Pack | null>(null);
  const [creating, setCreating] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("packs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-packs"] });
      qc.invalidateQueries({ queryKey: ["packs"] });
      toast.success("Pack deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-12 text-center text-aura-text-muted">Loading packs...</div>;

  const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="heading-lg text-aura-text">Packs</h2>
          <p className="caption-sm text-aura-text-muted mt-1">Bundle products into purchasable packs.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-aura-violet px-6 text-white body-strong hover:bg-aura-violet-dim transition-all duration-base"
        >
          <Plus size={18} /> New Pack
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packs.map((p) => (
          <PackCard
            key={p.id}
            pack={p}
            productsMap={productsMap}
            onEdit={() => setEditing(p)}
            onDelete={() => {
              if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id);
            }}
          />
        ))}
      </div>

      {(editing || creating) && (
        <PackDrawer
          pack={editing}
          products={products}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}
    </div>
  );
}

function PackCard({ pack, productsMap, onEdit, onDelete }: { pack: Pack; productsMap: Record<string, Product>; onEdit: () => void; onDelete: () => void }) {
  const items = (pack.items as unknown as PackItem[]) || [];
  return (
    <div className="bg-aura-surface border border-aura-border rounded-[12px] overflow-hidden group">
      <div className="aspect-[16/10] bg-aura-surface-2 relative">
        {pack.media_url ? (
          pack.media_type === "video" ? (
            <video src={pack.media_url} muted autoPlay loop playsInline className="w-full h-full object-cover" />
          ) : (
            <img src={pack.media_url} alt={pack.name} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-aura-text-faint caption-sm">No media</div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-base">
          <button onClick={onEdit} className="h-9 w-9 flex items-center justify-center rounded-full bg-aura-surface/95 border border-aura-border text-aura-text-muted hover:text-aura-text transition-all duration-base"><Edit2 size={14} /></button>
          <button onClick={onDelete} className="h-9 w-9 flex items-center justify-center rounded-full bg-aura-surface/95 border border-aura-border text-aura-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-base"><Trash2 size={14} /></button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="body-strong text-aura-text truncate">{pack.name}</h3>
          <span className="heading-md text-aura-violet-text shrink-0 ml-2">{pack.price.toLocaleString()} DA</span>
        </div>
        <p className="caption-sm text-aura-text-muted mb-3 line-clamp-2" dir="auto">{pack.positioning}</p>
        <div className="space-y-1 border-t border-aura-border pt-3">
          {items.map((it, i) => (
            <div key={i} className="caption-sm flex justify-between text-aura-text-muted">
              <span dir="auto">{productsMap[it.product]?.name || it.product}</span>
              <span>×{it.qty} {it.free && "· free"}</span>
            </div>
          ))}
          {items.length === 0 && <div className="caption-sm text-aura-text-faint italic">No items</div>}
        </div>
      </div>
    </div>
  );
}

interface FormState {
  id: string;
  name: string;
  price: number;
  positioning: string;
  media_url: string | null;
  media_type: "image" | "video";
  items: PackItem[];
}

function PackDrawer({ pack, products, onClose }: { pack: Pack | null; products: Product[]; onClose: () => void }) {
  const qc = useQueryClient();
  const isNew = !pack;

  const [form, setForm] = useState<FormState>({
    id: pack?.id || "",
    name: pack?.name || "",
    price: pack?.price || 0,
    positioning: pack?.positioning || "",
    media_url: pack?.media_url || null,
    media_type: (pack?.media_type as "image" | "video") || "image",
    items: ((pack?.items as unknown as PackItem[]) || []).map((i) => ({ ...i })),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const addItem = (productId: string) => {
    if (!productId) return;
    setForm({ ...form, items: [...form.items, { product: productId, qty: 1, free: false }] });
  };

  const updateItem = (idx: number, patch: Partial<PackItem>) => {
    const next = [...form.items];
    next[idx] = { ...next[idx], ...patch };
    setForm({ ...form, items: next });
  };

  const removeItem = (idx: number) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const next = [...form.items];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setForm({ ...form, items: next });
  };

  const save = async () => {
    if (!form.id.trim() || !form.name.trim() || form.price <= 0) {
      toast.error("ID, name and price are required");
      return;
    }
    if (form.items.length === 0) {
      toast.error("Add at least one product");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("packs").upsert({
        id: form.id.trim(),
        name: form.name.trim(),
        price: form.price,
        positioning: form.positioning,
        media_url: form.media_url,
        media_type: form.media_type,
        items: form.items as unknown as never,
      });
      if (error) throw error;
      toast.success(isNew ? "Pack created" : "Pack updated");
      qc.invalidateQueries({ queryKey: ["admin-packs"] });
      qc.invalidateQueries({ queryKey: ["packs"] });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-aura-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-aura-surface w-full max-w-2xl h-full overflow-y-auto flex flex-col border-l border-aura-border">
        <header className="sticky top-0 bg-aura-surface border-b border-aura-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="heading-md text-aura-text">{isNew ? "New Pack" : "Edit Pack"}</h2>
            <p className="caption-sm text-aura-text-muted">{isNew ? "Bundle products together" : pack?.name}</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-aura-surface-2 text-aura-text flex items-center justify-center transition-all duration-base"><X size={20} /></button>
        </header>

        <div className="p-6 space-y-8 flex-1">
          <section className="space-y-4">
            <h3 className="caption-sm uppercase tracking-widest text-aura-text-muted">Pack details</h3>
            <Field label="Pack ID" hint={isNew ? "lowercase, dashes only" : "ID cannot be changed"}>
              <input
                value={form.id}
                disabled={!isNew}
                onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                className="w-full h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none disabled:bg-aura-surface-2 disabled:text-aura-text-faint transition-all duration-base"
                placeholder="regular"
              />
            </Field>
            <Field label="Display name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
                placeholder='PACK " REGULAR "'
              />
            </Field>
            <Field label="Price (DA)">
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value || "0", 10) })}
                className="w-full h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text focus:border-aura-violet focus:outline-none transition-all duration-base"
                min={0}
              />
            </Field>
            <Field label="Positioning / tagline (Arabic)">
              <textarea
                value={form.positioning}
                onChange={(e) => setForm({ ...form, positioning: e.target.value })}
                rows={3}
                dir="auto"
                className="w-full rounded-md border border-aura-border p-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base resize-y"
                placeholder="ستايل بسيط + مناسب للجامعة والخروج"
              />
            </Field>
          </section>

          <section className="space-y-4">
            <h3 className="caption-sm uppercase tracking-widest text-aura-text-muted">Cover media</h3>
            <div className="flex items-center gap-3">
              <select
                value={form.media_type}
                onChange={(e) => setForm({ ...form, media_type: e.target.value as "image" | "video" })}
                className="h-10 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text transition-all duration-base"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <MediaUploader
                value={form.media_url}
                onChange={(url) => setForm({ ...form, media_url: url })}
                prefix={`packs/${form.id || "new"}`}
                accept={form.media_type === "video" ? "video/*" : "image/*"}
                preview={form.media_type}
                label="Upload cover"
              />
            </div>
            <div className="caption-sm text-aura-text-muted">
              Or paste a URL:
              <input
                value={form.media_url || ""}
                onChange={(e) => setForm({ ...form, media_url: e.target.value || null })}
                className="block mt-1 w-full h-10 rounded-md border border-aura-border px-3 caption-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
                placeholder="https://..."
              />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="caption-sm uppercase tracking-widest text-aura-text-muted">Pack items</h3>
                <p className="caption-sm text-aura-text-muted mt-1">{form.items.length} products in this pack</p>
              </div>
            </div>

            <div className="space-y-2">
              {form.items.map((it, idx) => {
                const product = products.find((p) => p.id === it.product);
                return (
                  <div key={idx} className="flex items-center gap-2 p-3 border border-aura-border rounded-lg bg-aura-surface-2">
                    <div className="flex flex-col">
                      <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-aura-text-muted hover:text-aura-text disabled:opacity-20 caption-sm">▲</button>
                      <button onClick={() => moveItem(idx, 1)} disabled={idx === form.items.length - 1} className="text-aura-text-muted hover:text-aura-text disabled:opacity-20 caption-sm">▼</button>
                    </div>
                    <GripVertical size={14} className="text-aura-text-muted" />
                    <select
                      value={it.product}
                      onChange={(e) => updateItem(idx, { product: e.target.value })}
                      className="flex-1 h-10 rounded-md border border-aura-border px-3 body-md bg-aura-surface text-aura-text transition-all duration-base"
                      dir="auto"
                    >
                      {!product && <option value={it.product}>{it.product} (missing)</option>}
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {p.id}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) => updateItem(idx, { qty: Math.max(1, parseInt(e.target.value || "1", 10)) })}
                      className="w-16 h-10 rounded-md border border-aura-border px-2 body-md text-aura-text text-center bg-aura-surface transition-all duration-base"
                    />
                    <label className="flex items-center gap-1.5 caption-sm cursor-pointer text-aura-text-muted">
                      <input
                        type="checkbox"
                        checked={!!it.free}
                        onChange={(e) => updateItem(idx, { free: e.target.checked })}
                      />
                      Free
                    </label>
                    <button onClick={() => removeItem(idx)} className="h-9 w-9 rounded-full border border-aura-border text-aura-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 flex items-center justify-center transition-all duration-base" aria-label="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
              {form.items.length === 0 && (
                <div className="text-center py-8 caption-md text-aura-text-muted border border-dashed border-aura-border rounded-lg">
                  No items yet. Add a product below.
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <select
                onChange={(e) => { addItem(e.target.value); e.target.value = ""; }}
                value=""
                className="flex-1 h-10 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text transition-all duration-base"
                dir="auto"
              >
                <option value="">+ Add product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {p.id}</option>
                ))}
              </select>
            </div>
          </section>
        </div>

        <footer className="sticky bottom-0 bg-aura-surface border-t border-aura-border px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="h-11 px-5 rounded-full border border-aura-border body-strong text-aura-text hover:bg-aura-surface-2 transition-all duration-base">Cancel</button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-aura-violet px-6 text-white body-strong hover:bg-aura-violet-dim disabled:opacity-50 transition-all duration-base"
          >
            <Save size={16} />
            {saving ? "Saving..." : isNew ? "Create" : "Save changes"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <div className="caption-md text-aura-text">{label}</div>
      {children}
      {hint && <div className="caption-sm text-aura-text-muted">{hint}</div>}
    </label>
  );
}
