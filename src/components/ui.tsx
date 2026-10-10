import {
  Bus,
  GraduationCap,
  HandHeart,
  HeartPulse,
  IdCard,
  Landmark,
  LucideProps,
} from "lucide-react";
import { CategoryId, Status, statusStyle } from "@/lib/data";

const icons: Record<CategoryId, React.ComponentType<LucideProps>> = {
  kependudukan: IdCard,
  kesehatan: HeartPulse,
  pendidikan: GraduationCap,
  bansos: HandHeart,
  transportasi: Bus,
  lainnya: Landmark,
};

export function CategoryIcon({ id, ...props }: { id: CategoryId } & LucideProps) {
  const Icon = icons[id];
  return <Icon {...props} />;
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyle[status]}`}>
      {status}
    </span>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm">
        <Landmark className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className={`text-sm font-extrabold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>Smart Public Service</div>
        <div className={`text-[11px] font-medium ${light ? "text-blue-100" : "text-slate-500"}`}>Pemprov DKI Jakarta · Prototipe</div>
      </div>
    </div>
  );
}

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
