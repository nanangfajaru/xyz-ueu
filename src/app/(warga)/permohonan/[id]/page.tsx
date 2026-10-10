"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Download, Star } from "lucide-react";
import Timeline from "@/components/Timeline";
import { Card, StatusBadge } from "@/components/ui";
import { getService } from "@/lib/data";
import { formatDate, useStore } from "@/lib/store";

export default function DetailPermohonanPage() {
  const { id } = useParams<{ id: string }>();
  const { applications, user, rate } = useStore();
  const app = applications.find((a) => a.id === decodeURIComponent(id));
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!app) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Permohonan tidak ditemukan.</p>
        <Link href="/permohonan" className="mt-3 inline-block text-sm font-semibold text-blue-700">Kembali</Link>
      </div>
    );
  }
  const s = getService(app.serviceId)!;
  const mine = app.citizenId === user?.id;
  const due = new Date(new Date(app.createdAt).getTime() + s.slaDays * 86400000);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link href="/permohonan" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Daftar permohonan
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-mono text-sm font-semibold text-blue-700">{app.id}</div>
          <h1 className="text-2xl font-extrabold">{s.name}</h1>
          <div className="text-sm text-slate-500">{s.agency} · Diajukan {formatDate(app.createdAt, true)}</div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-5">
          <h2 className="mb-4 font-bold">Riwayat Status</h2>
          <Timeline app={app} />
        </Card>

        <div className="space-y-5">
          <Card className="p-5 text-sm">
            <h2 className="font-bold">Ringkasan</h2>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Pemohon</dt><dd className="text-right font-medium">{app.citizenName}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Target SLA</dt><dd className="text-right font-medium">{formatDate(due.toISOString())}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Instansi terkait</dt><dd className="text-right font-medium">{s.integratedAgencies.join(", ")}</dd></div>
            </dl>
            {app.status === "Selesai" && (
              <button onClick={() => alert("Simulasi: dokumen hasil layanan diunduh (TTE).")} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700">
                <Download className="h-4 w-4" /> Unduh Dokumen Hasil
              </button>
            )}
          </Card>

          {mine && Object.keys(app.data).length > 0 && (
            <Card className="p-5 text-sm">
              <h2 className="font-bold">Data Permohonan</h2>
              <dl className="mt-3 space-y-2">
                {Object.entries(app.data).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
                {app.documents.map((d) => (
                  <div key={d} className="flex justify-between gap-3"><dt className="text-slate-500">Dokumen</dt><dd className="text-right font-medium">{d}</dd></div>
                ))}
              </dl>
            </Card>
          )}

          {mine && app.status === "Selesai" && (
            <Card className="p-5">
              <h2 className="font-bold">Penilaian Layanan</h2>
              {app.rating ? (
                <div className="mt-2">
                  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className={`h-5 w-5 ${n <= app.rating! ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />)}</div>
                  {app.feedback && <p className="mt-2 text-sm text-slate-600">“{app.feedback}”</p>}
                  <p className="mt-2 text-xs text-slate-500">Terima kasih atas partisipasi Anda.</p>
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setStars(n)}>
                        <Star className={`h-7 w-7 ${n <= stars ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} placeholder="Saran untuk perbaikan layanan (opsional)" className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600" />
                  <button disabled={!stars} onClick={() => rate(app.id, stars, feedback)} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Kirim Penilaian</button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
