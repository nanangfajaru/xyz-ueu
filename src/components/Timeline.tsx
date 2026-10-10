import { CircleCheck, CircleX } from "lucide-react";
import { Application, statusFlow } from "@/lib/data";
import { formatDate } from "@/lib/store";

export default function Timeline({ app }: { app: Application }) {
  const rejected = app.status === "Ditolak";
  const reached = rejected ? 0 : statusFlow.indexOf(app.status);
  return (
    <div>
      {/* Progres ringkas */}
      <div className="mb-6 grid grid-cols-4 gap-1">
        {statusFlow.map((st, i) => (
          <div key={st}>
            <div className={`h-1.5 rounded-full ${rejected ? "bg-rose-300" : i <= reached ? "bg-blue-600" : "bg-slate-200"}`} />
            <div className={`mt-1.5 text-[11px] font-semibold ${i <= reached && !rejected ? "text-blue-700" : "text-slate-400"}`}>{st}</div>
          </div>
        ))}
      </div>
      <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
        {[...app.history].reverse().map((h, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[33px] top-0 grid h-6 w-6 place-items-center rounded-full bg-white">
              {h.status === "Ditolak" ? (
                <CircleX className="h-5 w-5 text-rose-600" />
              ) : (
                <CircleCheck className={`h-5 w-5 ${i === 0 ? "text-blue-600" : "text-emerald-500"}`} />
              )}
            </span>
            <div className="text-sm font-semibold">{h.status}</div>
            <div className="text-sm text-slate-600">{h.note}</div>
            <div className="mt-0.5 text-xs text-slate-400">{formatDate(h.at, true)} · {h.by}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
