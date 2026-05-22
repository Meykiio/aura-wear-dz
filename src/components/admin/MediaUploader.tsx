import { useRef, useState } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { storeService } from "@/lib/store-service";

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  prefix: string;
  accept?: string;
  label?: string;
  className?: string;
  preview?: "image" | "video" | "auto";
}

export function MediaUploader({
  value,
  onChange,
  prefix,
  accept = "image/*",
  label = "Upload",
  className = "",
  preview = "image",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const url = await storeService.uploadMedia(file, prefix);
      onChange(url);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const isVideo = preview === "video" || (preview === "auto" && value?.match(/\.(mp4|webm|mov)$/i));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {value ? (
        <div className="relative h-20 w-20 rounded-md overflow-hidden border border-aura-border shrink-0 bg-aura-surface-2">
          {isVideo ? (
            <video src={value} muted className="w-full h-full object-cover" />
          ) : (
            <img src={value} alt="" className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-aura-error/80 text-white flex items-center justify-center hover:bg-aura-error transition-all duration-base"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-aura-border px-4 caption-md text-aura-text hover:bg-aura-surface-2 disabled:opacity-50 transition-all duration-base"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {value ? "Replace" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
