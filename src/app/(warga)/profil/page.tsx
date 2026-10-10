"use client";

import { Database, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui";
import { ProfileField, profileFieldLabels, services } from "@/lib/data";
import { formatDate, useStore } from "@/lib/store";

export default function ProfilPage() {
  const { user, verifiedAt, myApplications } = useStore();
  const u = user!;
  const fields = Object.keys(profileFieldLabels) as ProfileField[];
  // Estimasi jumlah isian yang tidak perlu diketik ulang berkat once-only.
  const saved = myApplications.reduce((n, a) => n + (services.find((s) => s.id === a.serviceId)?.profileFields.length ?? 0), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row">
        <div className={`grid h-20 w-20 place-items-center rounded-full text-2xl font-bold text-white ${u.avatarColor}`}>
          {u.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold">{u.name}</h1>
          <div className="text-sm text-slate-500">{u.kelurahan}, {u.kecamatan}, {u.kota}</div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi wajah {verifiedAt && formatDate(verifiedAt, true)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:ml-auto">
          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <div className="text-2xl font-extrabold text-blue-700">{myApplications.length}</div>
            <div className="text-[11px] text-slate-600">Permohonan</div>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 text-center">
            <div className="text-2xl font-extrabold text-emerald-700">{saved}</div>
            <div className="text-[11px] text-slate-600">Isian otomatis</div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="flex items-center gap-2 font-bold"><Database className="h-5 w-5 text-blue-700" /> Data Identitas Terpadu</h2>
        <p className="mt-1 text-xs text-slate-500">Bersumber dari data kependudukan (simulasi) dan dipakai ulang di seluruh layanan.</p>
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f} className={`border-b border-slate-100 pb-2 ${f === "address" ? "sm:col-span-2" : ""}`}>
              <dt className="text-xs text-slate-500">{profileFieldLabels[f]}</dt>
              <dd className="text-sm font-medium">{u[f]}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <p className="text-center text-xs text-slate-400">Seluruh data pada prototipe ini fiktif. Data disimpan hanya di browser Anda (localStorage).</p>
    </div>
  );
}
