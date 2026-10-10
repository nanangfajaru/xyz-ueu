"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CircleCheck, Lock, Network, Upload } from "lucide-react";
import { Card } from "@/components/ui";
import { Application, getService, profileFieldLabels } from "@/lib/data";
import { useStore } from "@/lib/store";

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

export default function AjukanPage() {
  const { id } = useParams<{ id: string }>();
  const s = getService(id);
  const { user, submit } = useStore();
  const [values, setValues] = useState<Record<string, string>>({});
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Application | null>(null);
  if (!s) notFound();

  const missing = s.extraFields.filter((f) => f.required && !values[f.key]?.trim());
  const canSubmit = missing.length === 0 && agree && !sending;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    const data: Record<string, string> = {};
    s!.profileFields.forEach((f) => (data[profileFieldLabels[f]] = user![f]));
    s!.extraFields.forEach((f) => values[f.key] && (data[f.label] = values[f.key]));
    setTimeout(() => {
      setDone(submit(s!.id, data, Object.values(docs)));
      setSending(false);
    }, 900);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg py-8 text-center">
        <CircleCheck className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold">Permohonan Terkirim</h1>
        <p className="mt-2 text-sm text-slate-600">
          Permohonan <b>{s.name}</b> telah diterima dan diteruskan ke {s.agency}
          {s.integratedAgencies.length > 0 && <> serta {s.integratedAgencies.join(", ")}</>}.
        </p>
        <Card className="mt-6 p-5">
          <div className="text-xs font-medium text-slate-500">Nomor Tiket</div>
          <div className="mt-1 font-mono text-2xl font-bold tracking-wider text-blue-700">{done.id}</div>
          <div className="mt-2 text-xs text-slate-500">Estimasi selesai dalam {s.slaDays} hari kerja</div>
        </Card>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link href="/beranda" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50">Ke Beranda</Link>
          <Link href={`/permohonan/${done.id}`} className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">Lacak Status</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-5">
      <Link href={`/layanan/${s.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Detail layanan
      </Link>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Formulir Digital</div>
        <h1 className="text-2xl font-extrabold">{s.name}</h1>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold">1. Data Pemohon</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <Lock className="h-3 w-3" /> Terisi otomatis dari profil terverifikasi
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {s.profileFields.map((f) => (
            <div key={f} className={f === "address" ? "sm:col-span-2" : ""}>
              <label className="mb-1 block text-xs font-medium text-slate-500">{profileFieldLabels[f]}</label>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">{user![f]}</div>
            </div>
          ))}
        </div>
      </Card>

      {s.extraFields.length > 0 && (
        <Card className="p-5">
          <h2 className="font-bold">2. Informasi Layanan</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {s.extraFields.map((f) => {
              const common = {
                id: f.key,
                value: values[f.key] ?? "",
                placeholder: f.placeholder,
                className: inputCls,
                onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value })),
              };
              return (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label htmlFor={f.key} className="mb-1 block text-xs font-semibold text-slate-700">
                    {f.label} {f.required && <span className="text-rose-600">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea rows={3} {...common} />
                  ) : f.type === "select" ? (
                    <select {...common}>
                      <option value="">Pilih…</option>
                      {f.options!.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} min={f.type === "number" ? 1 : undefined} {...common} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {s.documents.length > 0 && (
        <Card className="p-5">
          <h2 className="font-bold">3. Dokumen Pendukung</h2>
          <p className="mt-1 text-xs text-slate-500">Simulasi unggah — hanya nama berkas yang dicatat, isi berkas tidak dikirim.</p>
          <div className="mt-4 space-y-3">
            {s.documents.map((d) => (
              <label key={d} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 p-4 hover:bg-slate-50">
                <div>
                  <div className="text-sm font-semibold">{d}</div>
                  <div className="text-xs text-slate-500">{docs[d] ?? "PDF/JPG maks. 2 MB (opsional dalam prototipe)"}</div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">
                  <Upload className="h-4 w-4" /> {docs[d] ? "Ganti" : "Pilih"}
                </span>
                <input type="file" hidden onChange={(e) => e.target.files?.[0] && setDocs((x) => ({ ...x, [d]: e.target.files![0].name }))} />
              </label>
            ))}
          </div>
        </Card>
      )}

      <Card className="flex items-start gap-3 border-violet-200 bg-violet-50/60 p-4">
        <Network className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        <p className="text-xs leading-relaxed text-violet-900">
          Setelah dikirim, permohonan otomatis diteruskan ke <b>{s.agency}</b>
          {s.integratedAgencies.length > 0 && <> dan divalidasi lintas instansi: {s.integratedAgencies.join(", ")}</>} (simulasi integrasi).
        </p>
      </Card>

      <label className="flex items-start gap-2.5 text-sm text-slate-700">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />
        Saya menyatakan data yang diajukan benar dan menyetujui penggunaannya untuk keperluan layanan ini.
      </label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {missing.length > 0 && <p className="self-center text-xs text-slate-500 sm:mr-auto">Lengkapi: {missing.map((m) => m.label).join(", ")}</p>}
        <button disabled={!canSubmit} className="rounded-xl bg-blue-700 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
          {sending ? "Mengirim…" : "Kirim Permohonan"}
        </button>
      </div>
    </form>
  );
}
