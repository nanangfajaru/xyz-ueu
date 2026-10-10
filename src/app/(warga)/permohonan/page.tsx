"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Card, CategoryIcon, StatusBadge } from "@/components/ui";
import { Status, getCategory, getService } from "@/lib/data";
import { formatDate, useStore } from "@/lib/store";

const filters: (Status | "Semua")[] = ["Semua", "Diajukan", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];

export default function PermohonanPage() {
  const { myApplications, applications } = useStore();
  const router = useRouter();
  const [filter, setFilter] = useState<Status | "Semua">("Semua");
  const [ticket, setTicket] = useState("");
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const list = myApplications.filter((a) => filter === "Semua" || a.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Status Permohonan</h1>
        <p className="text-sm text-slate-500">Pantau seluruh permohonan Anda secara transparan.</p>
      </div>

      <Card className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = ticket.trim().toUpperCase();
            const found = applications.find((a) => a.id === t);
            if (found) router.push(`/permohonan/${found.id}`);
            else setNotFoundMsg("Nomor tiket tidak ditemukan.");
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-300 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={ticket}
              onChange={(e) => {
                setTicket(e.target.value);
                setNotFoundMsg("");
              }}
              placeholder="Lacak dengan nomor tiket, mis. JKT-KTP-00001"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none"
            />
          </div>
          <button className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Lacak</button>
        </form>
        {notFoundMsg && <p className="mt-2 text-xs text-rose-600">{notFoundMsg}</p>}
      </Card>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${filter === f ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <Card className="divide-y divide-slate-100">
        {list.length === 0 && (
          <div className="p-10 text-center text-sm text-slate-500">
            Belum ada permohonan.{" "}
            <Link href="/layanan" className="font-semibold text-blue-700">Ajukan layanan</Link>
          </div>
        )}
        {list.map((a) => {
          const s = getService(a.serviceId)!;
          return (
            <Link key={a.id} href={`/permohonan/${a.id}`} className="flex items-center gap-3 p-4 hover:bg-slate-50">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white ${getCategory(s.category).color}`}>
                <CategoryIcon id={s.category} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500">
                  <span className="font-mono">{a.id}</span> · {formatDate(a.createdAt, true)}
                </div>
              </div>
              <StatusBadge status={a.status} />
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
