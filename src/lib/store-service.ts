import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProductColor = Database["public"]["Tables"]["product_colors"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"] & {
  colors: ProductColor[];
};
export type Pack = Database["public"]["Tables"]["packs"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

export interface PackItem {
  product: string; // product id
  qty: number;
  free?: boolean;
}

export const MEDIA_BUCKET = "product-media";

export const storeService = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, colors:product_colors(*)")
      .order("name");
    if (error) throw error;
    return (data || []) as Product[];
  },

  async getPacks() {
    const { data, error } = await supabase
      .from("packs")
      .select("*")
      .order("price");
    if (error) throw error;
    return (data || []) as Pack[];
  },

  async getApprovedReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Review[];
  },

  async uploadMedia(file: File, prefix: string) {
    const ext = file.name.split(".").pop() || "bin";
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },
};

export function productsToMap(products: Product[]): Record<string, Product> {
  return Object.fromEntries(products.map((p) => [p.id, p]));
}

export interface PackUnit {
  id: string;
  product: string; // product id
  label: string;
}

export function unitsForPack(
  pack: Pack,
  productsMap: Record<string, Product>
): PackUnit[] {
  const items = (pack.items as unknown as PackItem[]) || [];
  const units: PackUnit[] = [];
  for (const item of items) {
    const def = productsMap[item.product];
    const name = def?.name || item.product;
    for (let i = 1; i <= item.qty; i++) {
      const suffix = item.qty > 1 ? ` #${i}` : "";
      units.push({
        id: `${item.product}-${i}`,
        product: item.product,
        label: `${name}${suffix}`,
      });
    }
  }
  return units;
}
