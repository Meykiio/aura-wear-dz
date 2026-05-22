import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, X, Save, Palette } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { storeService, type Product, type ProductColor } from "@/lib/store-service";
import { MediaUploader } from "./MediaUploader";

const CATEGORIES = ["tshirt", "polo", "short", "jogging", "accessory", "other"];
const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "14 ans"];

export function ProductManager() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: storeService.getProducts,
    staleTime: 1000 * 60 * 2,
  });

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="p-12 text-center text-aura-text-muted">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="heading-lg text-aura-text">Products</h2>
          <p className="caption-sm text-aura-text-muted mt-1">Manage products, sizes and color variants.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-aura-violet px-6 text-white body-strong hover:bg-aura-violet-dim transition-all duration-base"
        >
          <Plus size={18} /> New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={() => setEditing(p)}
            onDelete={() => {
              if (confirm(`Delete "${p.name}"? This will also delete its colors.`)) {
                deleteMutation.mutate(p.id);
              }
            }}
          />
        ))}
      </div>

      {(editing || creating) && (
        <ProductDrawer
          product={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete }: { product: Product; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-aura-surface p-6 border border-aura-border group relative rounded-[12px]">
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="body-strong text-aura-text truncate">{product.name}</h3>
          <span className="caption-sm text-aura-text-muted uppercase tracking-widest">{product.category}</span>
          <div className="caption-sm text-aura-text-faint mt-0.5 truncate">id: {product.id}</div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} className="h-9 w-9 flex items-center justify-center rounded-full border border-aura-border text-aura-text-muted hover:bg-aura-surface-2 hover:text-aura-text transition-all duration-base" aria-label="Edit"><Edit2 size={14} /></button>
          <button onClick={onDelete} className="h-9 w-9 flex items-center justify-center rounded-full border border-aura-border text-aura-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-base" aria-label="Delete"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="space-y-3">
        {product.has_size && product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-aura-surface-2 text-aura-text caption-sm rounded-md">{s}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Palette size={14} className="text-aura-text-muted" />
          <span className="caption-sm text-aura-text-muted">{product.colors.length} colors</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.colors.slice(0, 12).map((c) => (
            <div
              key={c.id}
              className="h-6 w-6 rounded-full border border-aura-border overflow-hidden relative"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
                    {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />}
            </div>
          ))}
          {product.colors.length > 12 && (
            <span className="h-6 px-2 rounded-full bg-aura-surface-2 caption-sm flex items-center text-aura-text-muted">+{product.colors.length - 12}</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface FormState {
  id: string;
  name: string;
  category: string;
  has_size: boolean;
  sizes: string[];
}

type DraftColor = Partial<ProductColor> & { _tempId?: string; _dirty?: boolean; _new?: boolean; _delete?: boolean };

function ProductDrawer({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const qc = useQueryClient();
  const isNew = !product;

  const [form, setForm] = useState<FormState>({
    id: product?.id || "",
    name: product?.name || "",
    category: product?.category || "tshirt",
    has_size: product?.has_size ?? true,
    sizes: product?.sizes || ["S", "M", "L", "XL", "XXL"],
  });

  const [colors, setColors] = useState<DraftColor[]>(
    product?.colors.map((c) => ({ ...c })) || []
  );
  const [saving, setSaving] = useState(false);
  const [sizeInput, setSizeInput] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const addSize = (s: string) => {
    const v = s.trim();
    if (!v || form.sizes.includes(v)) return;
    setForm(prev => ({ ...prev, sizes: [...prev.sizes, v] }));
    setSizeInput("");
  };

  const removeSize = (s: string) => setForm(prev => ({ ...prev, sizes: prev.sizes.filter((x) => x !== s) }));

  const addColor = () =>
    setColors(prev => [
      ...prev,
      { _tempId: crypto.randomUUID(), _new: true, _dirty: true, name: "", hex: "#000000", image_url: null },
    ]);

  const updateColor = (key: string, patch: Partial<DraftColor>) =>
    setColors(prev => prev.map((c) => ((c.id || c._tempId) === key ? { ...c, ...patch, _dirty: true } : c)));

  const removeColor = (key: string) =>
    setColors(prev =>
      prev
        .map((c) => ((c.id || c._tempId) === key ? { ...c, _delete: true } : c))
        .filter((c) => !(c._new && c._delete))
    );

  const save = async () => {
    if (!form.id.trim() || !form.name.trim()) {
      toast.error("ID and name are required");
      return;
    }
    if (colors.filter((c) => !c._delete).some((c) => !c.name?.trim() || !c.hex?.trim())) {
      toast.error("Each color needs a name and hex");
      return;
    }
    setSaving(true);
    try {
      const { error: upErr } = await supabase.from("products").upsert({
        id: form.id.trim(),
        name: form.name.trim(),
        category: form.category,
        has_size: form.has_size,
        sizes: form.has_size ? form.sizes : [],
      });
      if (upErr) throw upErr;

      const toDelete = colors.filter((c) => c._delete && c.id).map((c) => c.id as string);
      if (toDelete.length) {
        const { error } = await supabase.from("product_colors").delete().in("id", toDelete);
        if (error) throw error;
      }

      const toUpsert = colors
        .filter((c) => !c._delete && c._dirty)
        .map((c) => ({
          id: c.id,
          product_id: form.id.trim(),
          name: c.name!.trim(),
          hex: c.hex!.trim(),
          image_url: c.image_url || null,
        }));
      if (toUpsert.length) {
        const inserts = toUpsert.filter((c) => !c.id).map(({ id: _id, ...rest }) => rest);
        const updates = toUpsert.filter((c) => c.id);
        if (inserts.length) {
          const { error } = await supabase.from("product_colors").insert(inserts);
          if (error) throw error;
        }
        for (const u of updates) {
          const { error } = await supabase.from("product_colors").update(u).eq("id", u.id!);
          if (error) throw error;
        }
      }

      toast.success(isNew ? "Product created" : "Product updated");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const visibleColors = colors.filter((c) => !c._delete);

  return (
    <div className="fixed inset-0 z-40 bg-aura-black/60 backdrop-blur-sm flex justify-end">
      <div className="bg-aura-surface w-full max-w-2xl h-full overflow-y-auto flex flex-col border-l border-aura-border">
        <header className="sticky top-0 bg-aura-surface border-b border-aura-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="heading-md text-aura-text">{isNew ? "New Product" : "Edit Product"}</h2>
            <p className="caption-sm text-aura-text-muted">{isNew ? "Create a new sellable item" : product?.name}</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-aura-surface-2 text-aura-text flex items-center justify-center transition-all duration-base"><X size={20} /></button>
        </header>

        <div className="p-6 space-y-8 flex-1">
          <section className="space-y-4">
            <h3 className="caption-sm uppercase tracking-widest text-aura-text-muted">Basics</h3>
            <Field label="Product ID (slug)" hint={isNew ? "lowercase, dashes only — used as a stable key" : "ID cannot be changed"}>
              <input
                value={form.id}
                disabled={!isNew}
                onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                className="w-full h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none disabled:bg-aura-surface-2 disabled:text-aura-text-faint transition-all duration-base"
                placeholder="tshirt-regular"
              />
            </Field>
            <Field label="Display name (Arabic)">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
                placeholder="تيشيرت ريغولار"
                dir="auto"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text focus:border-aura-violet focus:outline-none transition-all duration-base"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="caption-sm uppercase tracking-widest text-aura-text-muted">Sizing</h3>
              <label className="flex items-center gap-2 cursor-pointer text-aura-text">
                <input
                  type="checkbox"
                  checked={form.has_size}
                  onChange={(e) => setForm({ ...form, has_size: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="caption-md">Has sizes</span>
              </label>
            </div>
            {form.has_size && (
              <>
                <div className="flex flex-wrap gap-2">
                  {form.sizes.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-aura-border body-md bg-aura-surface-2 text-aura-text">
                      {s}
                      <button onClick={() => removeSize(s)} className="text-aura-text-muted hover:text-aura-text transition-colors"><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSize(sizeInput); } }}
                    placeholder="Add size and press Enter"
                    className="flex-1 h-10 rounded-md border border-aura-border px-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
                  />
                  <button onClick={() => addSize(sizeInput)} type="button" className="h-10 px-4 rounded-md bg-aura-violet text-white caption-md hover:bg-aura-violet-dim transition-all duration-base">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="caption-sm text-aura-text-muted self-center mr-2">Quick add:</span>
                  {COMMON_SIZES.filter((s) => !form.sizes.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => addSize(s)} className="h-7 px-2 caption-sm rounded-full border border-aura-border text-aura-text-muted hover:border-aura-violet hover:text-aura-violet-text transition-all duration-base">+ {s}</button>
                  ))}
                </div>
              </>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="caption-sm uppercase tracking-widest text-aura-text-muted">Colors</h3>
                <p className="caption-sm text-aura-text-muted mt-1">{visibleColors.length} variants</p>
              </div>
              <button onClick={addColor} type="button" className="inline-flex h-10 items-center gap-2 rounded-full border border-aura-border px-4 caption-md text-aura-text hover:bg-aura-surface-2 transition-all duration-base">
                <Plus size={14} /> Add color
              </button>
            </div>

            <div className="space-y-3">
              {visibleColors.map((c) => {
                const key = (c.id || c._tempId)!;
                return (
                  <div key={key} className="border border-aura-border rounded-lg p-4 space-y-3 bg-aura-surface-2">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <input
                          type="color"
                          value={c.hex || "#000000"}
                          onChange={(e) => updateColor(key, { hex: e.target.value })}
                          className="h-14 w-14 rounded-md border border-aura-border cursor-pointer"
                          aria-label="Hex color"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          value={c.name || ""}
                          onChange={(e) => updateColor(key, { name: e.target.value })}
                          placeholder="Color name (Arabic)"
                          dir="auto"
                          className="h-11 rounded-md border border-aura-border px-3 body-md bg-aura-surface text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
                        />
                        <input
                          value={c.hex || ""}
                          onChange={(e) => updateColor(key, { hex: e.target.value })}
                          placeholder="#000000"
                          className="h-11 rounded-md border border-aura-border px-3 font-mono caption-md bg-aura-surface text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
                        />
                      </div>
                      <button onClick={() => removeColor(key)} className="h-10 w-10 rounded-full border border-aura-border text-aura-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 flex items-center justify-center shrink-0 transition-all duration-base" aria-label="Remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="caption-sm text-aura-text-muted">Variant image (optional)</span>
                      <MediaUploader
                        value={c.image_url || null}
                        onChange={(url) => updateColor(key, { image_url: url })}
                        prefix={`products/${form.id || "new"}`}
                        label="Upload"
                      />
                    </div>
                  </div>
                );
              })}
              {visibleColors.length === 0 && (
                <div className="text-center py-8 caption-md text-aura-text-muted border border-dashed border-aura-border rounded-lg">
                  No colors yet. Add at least one variant.
                </div>
              )}
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
