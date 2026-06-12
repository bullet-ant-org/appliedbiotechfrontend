import { ReactNode, useRef, useState } from "react";
import { X, Plus, Search, MoreVertical, Upload, ImageIcon, Trash2 } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-card border border-border rounded-2xl shadow-soft ${className}`}>{children}</div>;
}

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-brand max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <div className="p-5 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}

export const inputCls = "w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
export const textareaCls = "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function PrimaryBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`h-10 px-4 rounded-xl gradient-brand text-brand-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-soft hover:scale-[1.02] transition-transform disabled:opacity-50 ${props.className || ""}`}>{children}</button>;
}
export function GhostBtn({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent inline-flex items-center justify-center gap-2 ${props.className || ""}`}>{children}</button>;
}

export function Toolbar({ onSearch, addLabel, onAdd, children }: { onSearch?: (s: string) => void; addLabel?: string; onAdd?: () => void; children?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {onSearch && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input onChange={(e) => onSearch(e.target.value)} placeholder="Search..." className="w-full h-10 pl-9 pr-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      )}
      {children}
      {onAdd && <PrimaryBtn onClick={onAdd}><Plus className="h-4 w-4" /> {addLabel || "Add"}</PrimaryBtn>}
    </div>
  );
}

export function RowMenu({ actions }: { actions: { label: string; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((s) => !s)} className="p-1.5 rounded-md hover:bg-accent" aria-label="Actions"><MoreVertical className="h-4 w-4" /></button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 z-20 rounded-xl bg-popover border border-border shadow-brand p-1">
            {actions.map((a) => (
              <button key={a.label} onClick={() => { a.onClick(); setOpen(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent ${a.danger ? "text-destructive hover:bg-destructive/10" : ""}`}>{a.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export function ImageUpload({ value, onChange, label = "Image", aspect = "aspect-[4/3]" }: {
  value?: string; onChange: (dataUrl: string | undefined, file?: File) => void; label?: string; aspect?: string;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const r = new FileReader();
    r.onload = () => onChange(typeof r.result === "string" ? r.result : undefined, file);
    r.readAsDataURL(file);
  }
  return (
    <div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        className={`mt-1.5 ${aspect} rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-brand cursor-pointer overflow-hidden relative transition-colors group`}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors grid place-items-center gap-2">
              <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                <span className="px-3 py-1.5 rounded-lg bg-white/95 text-foreground text-xs font-semibold inline-flex items-center gap-1.5"><Upload className="h-3.5 w-3.5" />Replace</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); onChange(undefined); }} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold inline-flex items-center gap-1.5"><Trash2 className="h-3.5 w-3.5" />Remove</button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center p-4">
            <div>
              <div className="mx-auto h-10 w-10 rounded-full bg-brand/10 text-brand grid place-items-center mb-2"><ImageIcon className="h-5 w-5" /></div>
              <div className="text-sm font-medium text-foreground">Drop image or click to upload</div>
              <div className="text-xs text-muted-foreground mt-0.5">PNG, JPG up to 5MB</div>
            </div>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.currentTarget.value = ""; }}
        />
      </div>
    </div>
  );
}
