import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { Service, getCategory } from "@/lib/data";
import { CategoryIcon } from "./ui";

export default function ServiceCard({ s }: { s: Service }) {
  const cat = getCategory(s.category);
  return (
    <Link href={`/layanan/${s.id}`} className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${cat.color}`}>
        <CategoryIcon id={s.category} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold leading-snug group-hover:text-blue-700">{s.name}</div>
        <div className="mt-0.5 text-xs text-slate-500">{s.agency}</div>
        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <Clock className="h-3.5 w-3.5" /> {s.slaDays} hari kerja · {s.fee}
        </div>
      </div>
      <ChevronRight className="mt-3 h-4 w-4 shrink-0 text-slate-400" />
    </Link>
  );
}
