import { WILAYAS } from "@/lib/aura-data";

interface CustomerState {
  name: string;
  phone: string;
  wilaya: string;
  address: string;
  note: string;
}

interface Step3Props {
  customer: CustomerState;
  onChange: (patch: Partial<CustomerState>) => void;
}

export function StepShipping({ customer, onChange }: Step3Props) {
  const inputCls = "w-full h-14 rounded-full border border-aura-border px-6 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base";

  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-10 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <Field label="الاسم الكامل">
        <input
          className={inputCls}
          value={customer.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="أدخل اسمك الكامل هنا"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <Field label="رقم الهاتف">
          <input
            className={inputCls}
            inputMode="tel"
            value={customer.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="0XXXXX XX XX"
          />
        </Field>
        <Field label="الولاية">
          <select
            className={inputCls}
            value={customer.wilaya}
            onChange={(e) => onChange({ wilaya: e.target.value })}
          >
            <option value="">اختر الولاية</option>
            {WILAYAS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="العنوان الكامل">
        <textarea
          className="w-full h-32 rounded-3xl border border-aura-border p-6 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base resize-none"
          value={customer.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="الحي، رقم الشارع، رقم الشقة..."
        />
      </Field>

      <Field label="ملاحظة (اختياري)">
        <textarea
          className="w-full h-24 rounded-3xl border border-aura-border p-6 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base resize-none"
          value={customer.note}
          onChange={(e) => onChange({ note: e.target.value })}
          placeholder="أي تعليمات إضافية للتوصيل..."
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block group">
      <span className="caption-sm text-aura-text-muted mb-3 block uppercase tracking-widest group-focus-within:text-aura-violet-text transition-colors duration-base">{label}</span>
      {children}
    </label>
  );
}
