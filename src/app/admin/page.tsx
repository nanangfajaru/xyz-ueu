"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CircleCheck, Clock, ClipboardList, RefreshCw, Star, TrendingUp } from "lucide-react";
import { Card, CategoryIcon, Logo, StatusBadge } from "@/components/ui";
import { CategoryId, Status, categories, getService, services, statusFlow } from "@/lib/data";
import { formatDate, useStore } from "@/lib/store";

const allStatus: Status[] = [...statusFlow, "Ditolak"];

// Warna status hanya untuk status (selalu disertai label teks).
const statusBar: Record<Status, string> = {
  Diajukan: "bg-slate-400",
  Diverifikasi: "bg-blue-500",
  Diproses: "bg-amber-500",
  Selesai: "bg-emerald-500",
  Ditolak: "bg-rose-500",
};

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof ClipboardList; label: string; value: string; sub: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </Card>
  );
}

/** Bar horizontal satu warna untuk perbandingan besaran; nilai ditulis dengan tinta teks. */
function HBars({ rows }: { rows: { label: string; value: number; icon?: React.ReactNode }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="group" title={`${r.label}: ${r.value} permohonan`}>
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5 truncate text-slate-700">{r.icon}{r.label}</span>
            <span className="font-semibold tabular-nums text-slate-900">{r.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600 transition-all group-hover:bg-blue-700" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { applications, ready, updateStatus, resetDemo } = useStore();
  const [cat, setCat] = useState<CategoryId | "semua">("semua");
  const [status, setStatus] = useState<Status | "semua">("semua");
  const [hoverDay, setHoverDay] = useState<number | null>(null);

  const scoped = useMemo(
    () => applications.filter((a) => cat === "semua" || getService(a.serviceId)?.category === cat),
    [applications, cat],
  );

  const stats = useMemo(() => {
    const done = scoped.filter((a) => a.status === "Selesai");
    const onTime = done.filter((a) => {
      const s = getService(a.serviceId)!;
      const end = a.history.find((h) => h.status === "Selesai");
      return end && new Date(end.at).getTime() - new Date(a.createdAt).getTime() <= s.slaDays * 86400000;
    });
    const rated = scoped.filter((a) => a.rating);
    const avg = rated.reduce((n, a) => n + a.rating!, 0) / (rated.length || 1);

    const byStatus = allStatus.map((st) => ({ status: st, value: scoped.filter((a) => a.status === st).length }));
    const byCategory = categories.map((c) => ({
      label: c.name,
      value: applications.filter((a) => getService(a.serviceId)?.category === c.id).length,
      icon: <CategoryIcon id={c.id} className="h-3.5 w-3.5 text-slate-400" />,
    }));
    const byService = services
      .map((s) => ({ label: s.name, value: scoped.filter((a) => a.serviceId === s.id).length }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    const agencies = new Map<string, number>();
    scoped.forEach((a) => {
      const ag = getService(a.serviceId)!.agency;
      agencies.set(ag, (agencies.get(ag) ?? 0) + 1);
    });
    const byAgency = [...agencies.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today.getTime() - (13 - i) * 86400000);
      const next = d.getTime() + 86400000;
      return { date: d, value: scoped.filter((a) => { const t = new Date(a.createdAt).getTime(); return t >= d.getTime() && t < next; }).length };
    });

    return { done, onTime, rated, avg, byStatus, byCategory, byService, byAgency, days };
  }, [scoped, applications]);

  const table = scoped.filter((a) => status === "semua" || a.status === status).slice(0, 25);
  const maxDay = Math.max(1, ...stats.days.map((d) => d.value));

  if (!ready) return <div className="grid min-h-screen place-items-center text-sm text-slate-400">Memuat…</div>;

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Logo light />
          <div className="flex items-center gap-2">
            <button onClick={() => confirm("Atur ulang seluruh data demo?") && resetDemo()} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">
              <RefreshCw className="h-3.5 w-3.5" /> Reset Data Demo
            </button>
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold hover:bg-white/20">
              <ArrowLeft className="h-3.5 w-3.5" /> Portal Warga
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Dashboard Admin Layanan Publik</h1>
            <p className="text-sm text-slate-500">Data-driven governance · ringkasan 30 hari terakhir (data dummy)</p>
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value as CategoryId | "semua")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium">
            <option value="semua">Semua kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi icon={ClipboardList} label="Total Permohonan" value={String(scoped.length)} sub={`${scoped.filter((a) => a.status !== "Selesai" && a.status !== "Ditolak").length} sedang berjalan`} />
          <Kpi icon={CircleCheck} label="Selesai" value={String(stats.done.length)} sub={`${Math.round((stats.done.length / (scoped.length || 1)) * 100)}% dari total`} />
          <Kpi icon={Clock} label="Tepat Waktu (SLA)" value={`${Math.round((stats.onTime.length / (stats.done.length || 1)) * 100)}%`} sub={`${stats.onTime.length} dari ${stats.done.length} selesai`} />
          <Kpi icon={Star} label="Kepuasan Warga" value={stats.avg ? stats.avg.toFixed(1) : "–"} sub={`dari 5 · ${stats.rated.length} penilaian`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold"><TrendingUp className="h-5 w-5 text-blue-700" /> Permohonan Harian (14 hari)</h2>
              <span className="text-xs text-slate-500">
                {hoverDay !== null
                  ? `${formatDate(stats.days[hoverDay].date.toISOString())}: ${stats.days[hoverDay].value} permohonan`
                  : `Total ${stats.days.reduce((n, d) => n + d.value, 0)}`}
              </span>
            </div>
            <div className="mt-5 flex h-44 items-end gap-[2px] border-b border-slate-200" onMouseLeave={() => setHoverDay(null)}>
              {stats.days.map((d, i) => (
                <div key={i} className="flex h-full flex-1 cursor-default items-end px-[1px]" onMouseEnter={() => setHoverDay(i)}>
                  <div
                    className={`w-full rounded-t ${hoverDay === i ? "bg-blue-800" : "bg-blue-600"}`}
                    style={{ height: `${Math.max(2, (d.value / maxDay) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
              <span>{formatDate(stats.days[0].date.toISOString())}</span>
              <span>Hari ini</span>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold">Distribusi Status</h2>
            <div className="mt-4 flex h-4 gap-[2px] overflow-hidden rounded-full">
              {stats.byStatus.filter((s) => s.value).map((s) => (
                <div key={s.status} title={`${s.status}: ${s.value}`} className={statusBar[s.status]} style={{ flexGrow: s.value }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {stats.byStatus.map((s) => (
                <li key={s.status} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${statusBar[s.status]}`} />{s.status}</span>
                  <span className="font-semibold tabular-nums">
                    {s.value} <span className="font-normal text-slate-400">({Math.round((s.value / (scoped.length || 1)) * 100)}%)</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5">
            <h2 className="mb-4 font-bold">Penggunaan per Kategori</h2>
            <HBars rows={stats.byCategory} />
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 font-bold">Layanan Terbanyak</h2>
            <HBars rows={stats.byService} />
          </Card>
          <Card className="p-5">
            <h2 className="mb-4 font-bold">Beban per Perangkat Daerah</h2>
            <HBars rows={stats.byAgency} />
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">Permohonan Terbaru</h2>
              <p className="text-xs text-slate-500">Perbarui status untuk mensimulasikan proses lintas instansi — warga melihat perubahan secara langsung.</p>
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value as Status | "semua")} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="semua">Semua status</option>
              {allStatus.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Tiket</th>
                  <th className="px-5 py-3">Layanan</th>
                  <th className="px-5 py-3">Pemohon</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.map((a) => {
                  const s = getService(a.serviceId)!;
                  const idx = statusFlow.indexOf(a.status);
                  const next = a.status !== "Ditolak" && idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs">{a.id}</td>
                      <td className="px-5 py-3">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.agency}</div>
                      </td>
                      <td className="px-5 py-3">{a.citizenName}</td>
                      <td className="px-5 py-3 text-xs text-slate-500">{formatDate(a.createdAt, true)}</td>
                      <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-5 py-3">
                        {next ? (
                          <div className="flex gap-1.5">
                            <button onClick={() => updateStatus(a.id, next, next === "Selesai" ? "Layanan selesai, dokumen dapat diunduh" : `Status diperbarui menjadi ${next} oleh ${s.agency}`)} className="rounded-lg bg-blue-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800">
                              → {next}
                            </button>
                            {a.status === "Diajukan" && (
                              <button onClick={() => updateStatus(a.id, "Ditolak", "Dokumen pendukung tidak memenuhi syarat")} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                                Tolak
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
