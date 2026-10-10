"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Building2, CircleCheck, Clock, Database, FileText, Network, Wallet } from "lucide-react";
import { Card, CategoryIcon } from "@/components/ui";
import { getCategory, getService, profileFieldLabels } from "@/lib/data";

export default function DetailLayananPage() {
  const { id } = useParams<{ id: string }>();
  const s = getService(id);
  if (!s) notFound();
  const cat = getCategory(s.category);

  return (
    <div className="space-y-6">
      <Link href="/layanan" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Katalog layanan
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white ${cat.color}`}>
            <CategoryIcon id={s.category} className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{cat.name}</div>
            <h1 className="text-2xl font-extrabold">{s.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">{s.description}</p>
          </div>
        </div>
        <Link href={`/layanan/${s.id}/ajukan`} className="shrink-0 rounded-xl bg-blue-700 px-6 py-3 text-center text-sm font-semibold text-white shadow hover:bg-blue-800">
          Ajukan Permohonan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { icon: Building2, label: "Penyelenggara", value: s.agency },
          { icon: Clock, label: "Estimasi Waktu", value: `${s.slaDays} hari kerja` },
          { icon: Wallet, label: "Biaya", value: s.fee },
        ].map((x) => (
          <Card key={x.label} className="flex items-center gap-3 p-4">
            <x.icon className="h-5 w-5 text-blue-700" />
            <div>
              <div className="text-[11px] font-medium text-slate-500">{x.label}</div>
              <div className="text-sm font-semibold">{x.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-bold"><FileText className="h-5 w-5 text-blue-700" /> Persyaratan</h2>
          <ul className="mt-3 space-y-2">
            {s.requirements.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-slate-700">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {r}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold">Alur Layanan</h2>
          <ol className="mt-3 space-y-3">
            {s.steps.map((st, i) => (
              <li key={st} className="flex items-center gap-3 text-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{i + 1}</span>
                {st}
              </li>
            ))}
          </ol>
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-bold"><Database className="h-5 w-5 text-emerald-600" /> Data Terisi Otomatis (Once-Only)</h2>
          <p className="mt-1 text-xs text-slate-500">Diambil dari profil terverifikasi Anda — tidak perlu diketik ulang.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {s.profileFields.map((f) => (
              <span key={f} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{profileFieldLabels[f]}</span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-bold"><Network className="h-5 w-5 text-violet-600" /> Integrasi Antarperangkat Daerah</h2>
          <p className="mt-1 text-xs text-slate-500">Permohonan diteruskan otomatis ke instansi berikut (simulasi).</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-medium">
            <span className="rounded-full bg-blue-700 px-2.5 py-1 text-white">{s.agency}</span>
            {s.integratedAgencies.map((a) => (
              <span key={a} className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">↔ {a}</span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
