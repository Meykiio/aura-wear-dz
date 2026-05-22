// AURA WEAR product + pack data. Customer-facing strings are in Arabic.

export type ProductKey =
  | "polo-demi-manche-regular"
  | "tshirt-regular"
  | "jogging-demi-saison-regular"
  | "tshirt-oversized"
  | "wide-short-oversized"
  | "sacoche-regular"
  | "short-regular";

export interface ProductDef {
  key: ProductKey;
  name: string; // Arabic display name
  hasSize: boolean;
  colors: { name: string; hex: string }[];
  sizes?: string[];
}

export const PRODUCTS: Record<ProductKey, ProductDef> = {
  "polo-demi-manche-regular": {
    key: "polo-demi-manche-regular",
    name: "بولو ريغولار",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "باذنجاني", hex: "#4b284f" },
      { name: "بيج", hex: "#f5f5dc" },
      { name: "أبيض", hex: "#ffffff" },
      { name: "أزرق أكوا", hex: "#40e0d0" },
      { name: "أزرق سماوي", hex: "#87ceeb" },
      { name: "أزرق فاتح", hex: "#0066cc" },
      { name: "أزرق ليلي", hex: "#0066cc" },
      { name: "أزرق ملكي غامق", hex: "#0066cc" },
      { name: "أزرق مخضر", hex: "#0066cc" },
      { name: "رمادي", hex: "#808080" },
      { name: "أصفر فاتح", hex: "#ffff00" },
      { name: "أصفر تقني", hex: "#ffff00" },
      { name: "ليلكي", hex: "#808080" },
      { name: "بني كراميل", hex: "#8b4513" },
      { name: "أسود", hex: "#000000" },
      { name: "برتقالي", hex: "#ff8c00" },
      { name: "وردي فاتح", hex: "#ff69b4" },
      { name: "وردي فوشيا", hex: "#ff69b4" },
      { name: "أحمر", hex: "#ff0000" },
      { name: "أحمر آجري", hex: "#ff0000" },
      { name: "سالمون", hex: "#808080" },
      { name: "أخضر صباري", hex: "#228b22" },
      { name: "أخضر زيتوني", hex: "#228b22" },
      { name: "أخضر باسبور", hex: "#228b22" },
      { name: "بنفسجي", hex: "#7f00ff" },
    ],
  },
  "tshirt-regular": {
    key: "tshirt-regular",
    name: "تيشيرت ريغولار",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "باذنجاني", hex: "#4b284f" },
      { name: "بيج فاتح", hex: "#f5f5dc" },
      { name: "بيج غامق", hex: "#f5f5dc" },
      { name: "أبيض", hex: "#ffffff" },
      { name: "أزرق", hex: "#0066cc" },
      { name: "أزرق أكوا", hex: "#40e0d0" },
      { name: "أزرق سماوي", hex: "#87ceeb" },
      { name: "أزرق ليلي", hex: "#0066cc" },
      { name: "أزرق ملكي غامق", hex: "#0066cc" },
      { name: "أزرق فيروزي", hex: "#40e0d0" },
      { name: "أزرق مخضر", hex: "#0066cc" },
      { name: "بوردو", hex: "#722f37" },
      { name: "رمادي", hex: "#808080" },
      { name: "رمادي فاتح", hex: "#a8a8a8" },
      { name: "رمادي غامق", hex: "#505050" },
      { name: "أصفر خردلي", hex: "#ffff00" },
      { name: "بني", hex: "#8b4513" },
      { name: "أسود", hex: "#000000" },
      { name: "برتقالي", hex: "#ff8c00" },
      { name: "وردي فاتح", hex: "#ff69b4" },
      { name: "وردي فوشيا", hex: "#ff69b4" },
      { name: "أحمر", hex: "#ff0000" },
      { name: "سالمون", hex: "#808080" },
      { name: "أخضر", hex: "#228b22" },
      { name: "أخضر زجاجي", hex: "#228b22" },
      { name: "أخضر صباري", hex: "#228b22" },
      { name: "أخضر فاتح", hex: "#228b22" },
      { name: "أخضر كاكي", hex: "#556b2f" },
      { name: "أخضر باسبور", hex: "#228b22" },
      { name: "بنفسجي", hex: "#7f00ff" },
    ],
  },
  "jogging-demi-saison-regular": {
    key: "jogging-demi-saison-regular",
    name: "جوغينغ نص موسم",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: [
      { name: "بيج", hex: "#f5f5dc" },
      { name: "أبيض", hex: "#ffffff" },
      { name: "أزرق ليلي", hex: "#0066cc" },
      { name: "أزرق ملكي غامق", hex: "#0066cc" },
      { name: "بوردو", hex: "#722f37" },
      { name: "رمادي بنفسجي", hex: "#808080" },
      { name: "بني", hex: "#8b4513" },
      { name: "أسود", hex: "#000000" },
      { name: "وردي", hex: "#ff69b4" },
      { name: "أحمر", hex: "#ff0000" },
      { name: "سالمون", hex: "#808080" },
    ],
  },
  "tshirt-oversized": {
    key: "tshirt-oversized",
    name: "تيشيرت أوفرسايز",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "بيج", hex: "#f5f5dc" },
      { name: "أبيض", hex: "#ffffff" },
      { name: "رمادي", hex: "#808080" },
      { name: "أسود", hex: "#000000" },
      { name: "أخضر", hex: "#228b22" },
    ],
  },
  "wide-short-oversized": {
    key: "wide-short-oversized",
    name: "شورت واسع",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "بيج", hex: "#f5f5dc" },
      { name: "أبيض", hex: "#ffffff" },
      { name: "أزرق ليلي", hex: "#0066cc" },
      { name: "أزرق مخضر", hex: "#0066cc" },
      { name: "رمادي", hex: "#808080" },
      { name: "بني", hex: "#8b4513" },
      { name: "أسود", hex: "#000000" },
      { name: "أخضر", hex: "#228b22" },
    ],
  },
  "sacoche-regular": {
    key: "sacoche-regular",
    name: "ساكوش",
    hasSize: true,
    sizes: ["M", "L", "XL", "14 ans"],
    colors: [
      { name: "أسود", hex: "#000000" },
    ],
  },
  "short-regular": {
    key: "short-regular",
    name: "شورت ريغولار",
    hasSize: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "بيج", hex: "#f5f5dc" },
      { name: "أبيض", hex: "#ffffff" },
      { name: "أزرق ليلي", hex: "#0066cc" },
      { name: "أزرق مخضر", hex: "#0066cc" },
      { name: "رمادي", hex: "#808080" },
      { name: "بني", hex: "#8b4513" },
      { name: "أسود", hex: "#000000" },
      { name: "أخضر", hex: "#228b22" },
    ],
  },
};

export const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL", "14 ans"] as const;
export type Size = (typeof SIZES)[number];

export interface PackItem {
  product: ProductKey;
  qty: number;
  free?: boolean;
}

export interface Pack {
  id: string;
  name: string;
  price: number;
  positioning: string;
  items: PackItem[];
}

export const PACKS: Pack[] = [
  {
    id: "regular",
    name: 'PACK " REGULAR "',
    price: 5500,
    positioning: "ستايل بسيط + مناسب للجامعة والخروج",
    items: [
      { product: "tshirt-regular", qty: 1 },
      { product: "short-regular", qty: 1 },
      { product: "sacoche-regular", qty: 1, free: true },
    ],
  },
  {
    id: "oversize",
    name: 'PACK " OVERSIZE "',
    price: 5900,
    positioning: "ستايل شبابي عصري + قماش مريح",
    items: [
      { product: "tshirt-oversized", qty: 1 },
      { product: "wide-short-oversized", qty: 1 },
      { product: "sacoche-regular", qty: 1, free: true },
    ],
  },
  {
    id: "chic",
    name: 'PACK " CHIC "',
    price: 5900,
    positioning: "ستايل أنيق + جودة عالية + راحة في اللبس",
    items: [
      { product: "polo-demi-manche-regular", qty: 1 },
      { product: "jogging-demi-saison-regular", qty: 1 },
      { product: "sacoche-regular", qty: 1, free: true },
    ],
  },
  {
    id: "double",
    name: 'PACK " DOUBLE "',
    price: 8900,
    positioning: "باك عائلي قوي + قماش عالي الجودة",
    items: [
      { product: "polo-demi-manche-regular", qty: 2 },
      { product: "tshirt-regular", qty: 2 },
      { product: "jogging-demi-saison-regular", qty: 2 },
    ],
  },
  {
    id: "mix",
    name: 'PACK " MIX "',
    price: 10900,
    positioning: "أقوى عرض كامل + أكثر من لوك في نفس الباك",
    items: [
      { product: "polo-demi-manche-regular", qty: 1 },
      { product: "tshirt-regular", qty: 1 },
      { product: "tshirt-oversized", qty: 1 },
      { product: "short-regular", qty: 1 },
      { product: "wide-short-oversized", qty: 1 },
      { product: "jogging-demi-saison-regular", qty: 1 },
      { product: "sacoche-regular", qty: 1, free: true },
    ],
  },
];

// Flatten pack into individual customizable units (with #N suffix when duplicated)
export interface PackUnit {
  id: string; // "polo-regular-1"
  product: ProductKey;
  label: string; // "بولو ريغولار #1"
}

export function unitsForPack(pack: Pack): PackUnit[] {
  const units: PackUnit[] = [];
  for (const item of pack.items) {
    const def = PRODUCTS[item.product];
    for (let i = 1; i <= item.qty; i++) {
      const suffix = item.qty > 1 ? ` #${i}` : "";
      units.push({
        id: `${item.product}-${i}`,
        product: item.product,
        label: `${def.name}${suffix}`,
      });
    }
  }
  return units;
}

// 58 Algerian wilayas, alphabetical (Arabic).
export const WILAYAS: string[] = [
  "أدرار", "أم البواقي", "إليزي", "البليدة", "البويرة", "البيض", "الجزائر", "الجلفة",
  "الشلف", "الطارف", "العاصمة", "المدية", "المسيلة", "المغير", "المنيعة", "النعامة",
  "الوادي", "أولاد جلال", "باتنة", "بجاية", "بسكرة", "بشار", "بني عباس", "بومرداس",
  "برج باجي مختار", "برج بوعريريج", "تبسة", "تقرت", "تلمسان", "تمنراست", "تندوف",
  "تيارت", "تيبازة", "تيزي وزو", "تيسمسيلت", "تيميمون", "جانت", "جيجل", "خنشلة",
  "سطيف", "سعيدة", "سكيكدة", "سوق أهراس", "سيدي بلعباس", "عنابة", "عين الدفلى",
  "عين تموشنت", "عين صالح", "عين قزام", "غرداية", "غليزان", "قالمة", "قسنطينة",
  "مستغانم", "معسكر", "ميلة", "ورقلة", "وهران",
].sort((a, b) => a.localeCompare(b, "ar"));
