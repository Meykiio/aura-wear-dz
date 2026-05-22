import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Download, Search, MessageCircle, Trash2, CheckSquare, Square, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { PACKS, WILAYAS } from "@/lib/aura-data";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

const PAGE_SIZE = 50;

interface OrderRow {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  address: string;
  note: string | null;
  pack_name: string;
  pack_quantity: number;
  pack_price: number;
  total_price: number;
  customizations: unknown;
  status: string;
}

function sanitizeCSVField(value: string): string {
  const dangerous = /^[=+\-@\t\r]/;
  const sanitized = dangerous.test(value) ? `'${value}` : value;
  return `"${sanitized.replace(/"/g, '""')}"`;
}

function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').substring(0, 15);
}

const STATUS_BADGE_MAP: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  delivered: "bg-green-500/10 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};

export function OrderList() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [packFilter, setPackFilter] = useState("");
  const [wilayaFilter, setWilayaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return (data || []) as OrderRow[];
    },
    staleTime: 1000 * 60 * 2,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (q) {
        const hay = `${o.customer_name} ${o.phone} ${o.wilaya}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (packFilter && o.pack_name !== packFilter) return false;
      if (wilayaFilter && o.wilaya !== wilayaFilter) return false;
      if (statusFilter && o.status !== statusFilter) return false;
      return true;
    });
  }, [orders, search, packFilter, wilayaFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const startIdx = currentPage * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, filtered.length);

  const bulkDelete = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("orders").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      setSelectedIds(new Set());
      toast.success("Orders deleted successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === pageRows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pageRows.map((o) => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} orders?`)) {
      bulkDelete.mutate(Array.from(selectedIds));
    }
  };

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const revenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + (o.total_price || 0), 0);
    return { total, pending, delivered, revenue };
  }, [orders]);

  if (isLoading) return <div className="p-12 text-center body-md text-aura-text-muted">Loading orders...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total orders" value={stats.total.toString()} />
        <StatCard label="Pending" value={stats.pending.toString()} />
        <StatCard label="Delivered" value={stats.delivered.toString()} />
        <StatCard label="Revenue" value={`${stats.revenue.toLocaleString("fr-DZ")} DZD`} />
      </div>

      {/* Filters */}
      <div className="bg-aura-surface p-4 grid grid-cols-1 md:grid-cols-4 gap-3 rounded-[12px] border border-aura-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-aura-text-muted" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full h-11 rounded-full border border-aura-border pl-9 pr-3 body-md bg-aura-surface-2 text-aura-text placeholder:text-aura-text-faint focus:border-aura-violet focus:outline-none transition-all duration-base"
          />
        </div>
        <SelectFilter value={packFilter} onChange={(v) => { setPackFilter(v); setPage(0); }} placeholder="All packs" options={PACKS.map(p => p.name)} />
        <SelectFilter value={wilayaFilter} onChange={(v) => { setWilayaFilter(v); setPage(0); }} placeholder="All wilayas" options={WILAYAS} />
        <SelectFilter value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(0); }} placeholder="All statuses" options={[...STATUSES]} />
      </div>

      {/* Export & Actions */}
      <div className="flex items-center gap-2">
        <ExportButton label="CSV" onClick={() => exportCSV(filtered)} />
        <ExportButton label="Excel" onClick={() => exportXLSX(filtered)} />

        {selectedIds.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 px-4 body-strong hover:bg-red-500/20 transition-all ml-4"
          >
            <Trash2 size={14} /> Delete Selected ({selectedIds.size})
          </button>
        )}

        <span className="ms-auto self-center caption-md text-aura-text-muted">
          Showing {startIdx + 1}–{endIdx} of {filtered.length} orders
        </span>
      </div>

      <div className="bg-aura-surface overflow-x-auto rounded-[12px] border border-aura-border">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-aura-surface-2 text-aura-text-muted uppercase tracking-wide text-xs">
            <tr>
              <th className="p-3 w-10">
                <button onClick={toggleSelectAll} className="text-aura-text-muted hover:text-aura-text transition-colors">
                  {selectedIds.size > 0 && selectedIds.size === pageRows.length ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              <th className="p-3 caption-sm">Date</th>
              <th className="p-3 caption-sm">Customer</th>
              <th className="p-3 caption-sm">Phone</th>
              <th className="p-3 caption-sm">Wilaya</th>
              <th className="p-3 caption-sm">Pack</th>
              <th className="p-3 caption-sm">Total</th>
              <th className="p-3 caption-sm">Status</th>
              <th className="p-3 caption-sm w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                isSelected={selectedIds.has(o.id)}
                onSelect={() => toggleSelect(o.id)}
                expanded={expanded === o.id}
                onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-aura-border px-4 body-strong text-aura-text hover:border-aura-violet disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-base"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="caption-sm text-aura-text-muted">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-aura-border px-4 body-strong text-aura-text hover:border-aura-violet disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-base"
          >
            Next <ChevronRightIcon size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, isSelected, onSelect, expanded, onToggle }: { order: OrderRow; isSelected: boolean; onSelect: () => void; expanded: boolean; onToggle: () => void }) {
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: async (status: Status) => {
      await supabase.from("orders").update({ status }).eq("id", order.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Status updated");
    },
  });

  const deleteOne = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("orders").delete().eq("id", order.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted");
    },
  });

  const sendWhatsApp = () => {
    let msg = "";
    const baseUrl = window.location.origin;
    const phone = sanitizePhone(order.phone);

    switch (order.status) {
      case "pending":
        msg = `السلام عليكم ${order.customer_name}، معكم AURA WEAR. نود تأكيد طلبكم للباك "${order.pack_name}". هل أنتم مستعدون للتوصيل؟`;
        break;
      case "confirmed":
        msg = `مرحباً ${order.customer_name}، تم تأكيد طلبك "${order.pack_name}". نحن نقوم بتحضيره الآن وسيتم شحنه قريباً جداً. شكراً لثقتكم!`;
        break;
      case "shipped":
        msg = `خبر سعيد ${order.customer_name}! طلبك "${order.pack_name}" في الطريق إليك الآن. سيتصل بك عون التوصيل قريباً. يرجى إبقاء الهاتف شغالاً.`;
        break;
      case "delivered":
        msg = `مرحباً ${order.customer_name}، نأمل أن يكون الباك قد نال إعجابك! 😍 نود سماع رأيك. يمكنك ترك تقييم لنا من هنا: ${baseUrl}/review \nشكراً لاختيارك AURA WEAR!`;
        break;
      case "cancelled":
        msg = `السلام عليكم ${order.customer_name}، يؤسفنا إبلاغك أنه تم إلغاء طلبك "${order.pack_name}". إذا كان هناك أي خطأ، يمكنك إعادة الطلب في أي وقت.`;
        break;
      default:
        msg = `السلام عليكم ${order.customer_name}، بخصوص طلبكم ${order.pack_name}.`;
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const statusBadge = STATUS_BADGE_MAP[order.status] || "bg-aura-surface-2 text-aura-text-muted border border-aura-border";

  return (
    <>
      <tr className={`border-t border-aura-border transition-colors ${isSelected ? "bg-aura-surface-2" : "hover:bg-aura-surface-2/50"}`}>
        <td className="p-3">
          <button onClick={onSelect} className="text-aura-text-muted hover:text-aura-text transition-colors">
            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>
        </td>
        <td className="p-3 caption-md text-aura-text-muted" suppressHydrationWarning>{new Date(order.created_at).toLocaleDateString()}</td>
        <td className="p-3 body-strong text-aura-text">{order.customer_name}</td>
        <td className="p-3 caption-md text-aura-text-muted">{order.phone}</td>
        <td className="p-3 caption-md text-aura-text-muted">{order.wilaya}</td>
        <td className="p-3 caption-md text-aura-text-muted">{order.pack_name}</td>
        <td className="p-3 body-strong text-aura-text">{order.total_price.toLocaleString()} دج</td>
        <td className="p-3">
          <select
            value={order.status}
            onChange={(e) => update.mutate(e.target.value as Status)}
            className={`h-8 rounded-full border px-2 caption-sm bg-aura-surface-2 ${statusBadge}`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </td>
        <td className="p-3 flex gap-2">
          <button onClick={sendWhatsApp} title="Send WhatsApp" className="size-9 flex items-center justify-center rounded-full bg-aura-success text-white hover:opacity-80 transition-all duration-base"><MessageCircle size={16} /></button>
          <button onClick={() => { if (confirm("Delete this order?")) deleteOne.mutate(); }} className="size-9 flex items-center justify-center rounded-full border border-aura-border text-aura-text-muted hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-base"><Trash2 size={16} /></button>
          <button onClick={onToggle} className="size-9 flex items-center justify-center rounded-full border border-aura-border text-aura-text-muted hover:bg-aura-surface-2 transition-all duration-base">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-aura-surface-2/30">
          <td colSpan={9} className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="caption-sm text-aura-text-muted mb-2 uppercase tracking-widest">Address</div>
                <p className="body-md text-aura-text">{order.address}</p>
                {order.note && <><div className="caption-sm text-aura-text-muted mt-4 mb-2 uppercase tracking-widest">Note</div><p className="body-md text-aura-text">{order.note}</p></>}
              </div>
              <div>
                <div className="caption-sm text-aura-text-muted mb-2 uppercase tracking-widest">Customizations</div>
                <ul className="space-y-2">
                  {(order.customizations as Array<{ label: string; size?: string; color?: string }>)?.map((c, i) => (
                    <li key={i} className="caption-md flex justify-between border-b border-aura-border/50 pb-1">
                      <span className="text-aura-text">{c.label}</span>
                      <span className="text-aura-text-muted">{c.size ? `${c.size} · ` : ""}{c.color}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <div className="bg-aura-surface p-6 rounded-[12px] border border-aura-border"><div className="caption-sm text-aura-text-muted uppercase tracking-widest">{label}</div><div className="heading-xl text-aura-text mt-2">{value}</div></div>;
}

function SelectFilter({ value, onChange, placeholder, options }: { value: string; onChange: (v: string) => void; placeholder: string; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 rounded-full border border-aura-border px-4 body-md bg-aura-surface-2 text-aura-text focus:border-aura-violet focus:outline-none transition-all duration-base"><option value="">{placeholder}</option>{options.map(o => <option key={o} value={o}>{o}</option>)}</select>;
}

function ExportButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex h-10 items-center gap-2 rounded-full border border-aura-border px-4 body-strong text-aura-text hover:border-aura-violet transition-all duration-base"><Download size={14} /> {label}</button>;
}

function exportCSV(orders: OrderRow[]) {
  const headers = "ID,Date,Customer,Phone,Wilaya,Address,Pack,Total,Status\n";
  const rows = orders.map(o =>
    [
      sanitizeCSVField(o.id),
      sanitizeCSVField(o.created_at),
      sanitizeCSVField(o.customer_name),
      sanitizeCSVField(o.phone),
      sanitizeCSVField(o.wilaya),
      sanitizeCSVField(o.address),
      sanitizeCSVField(o.pack_name),
      sanitizeCSVField(String(o.total_price)),
      sanitizeCSVField(o.status),
    ].join(",")
  ).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
}

function exportXLSX(orders: OrderRow[]) {
  const ws = XLSX.utils.json_to_sheet(orders);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");
  XLSX.writeFile(wb, "orders.xlsx");
}
