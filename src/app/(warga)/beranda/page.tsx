"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { Card, CategoryIcon, StatusBadge } from "@/components/ui";
import { categories, getService, services } from "@/lib/data";
import { formatDate, useStore } from "@/lib/store";

export default function BerandaPage() {
  const { user, verifiedAt, myApplications } = useStore();
  const [q, setQ] = useState("");
  const router = useRouter();
  const popular = services.filter((s) => s.popular);
  const active = myApplications.filter((a) => a.status !== "Selesai" && a.status !== "Ditolak");

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 p-6 text-white sm:p-8">
        <div className="text-sm text-blue-100">Selamat datang,</div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{user!.name}</h1>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
          <ShieldCheck className="h-3.5 w-3.5" /> Identitas terverifikasi {verifiedAt ? formatDate(verifiedAt, true) : ""}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/layanan?q=${encodeURIComponent(q)}`);
          }}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-lg"
        >
          <Search className="ml-2 h-5 w-5 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari layanan, mis. KTP, KJP, puskesmas…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Cari</button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Kategori Layanan</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.id} href={`/layanan?kategori=${c.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className={`grid h-11 w-11 place-items-center rounded-xl text-white ${c.color}`}>
                <CategoryIcon id={c.id} className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold leading-snug">{c.name}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">{services.filter((s) => s.category === c.id).length} layanan</div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Layanan Populer</h2>
            <Link href="/layanan" className="text-sm font-semibold text-blue-700">Lihat semua</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {popular.map((s) => <ServiceCard key={s.id} s={s} />)}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Permohonan Aktif</h2>
            <Link href="/permohonan" className="text-sm font-semibold text-blue-700">Semua</Link>
          </div>
          <Card className="divide-y divide-slate-100">
            {active.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-500">
                Belum ada permohonan aktif.
                <br />
                Pilih layanan untuk mulai mengajukan.
              </div>
            )}
            {active.slice(0, 5).map((a) => (
              <Link key={a.id} href={`/permohonan/${a.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{getService(a.serviceId)?.name}</div>
                  <div className="text-xs text-slate-500">{a.id} · {formatDate(a.createdAt)}</div>
                </div>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </Card>

          <Card className="mt-4 p-5">
            <div className="text-sm font-bold">Once-Only Administration</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Data identitas Anda (NIK, KK, alamat, kontak) diisi otomatis pada setiap formulir layanan. Anda cukup melengkapi
              informasi khusus layanan.
            </p>
            <Link href="/profil" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
              Lihat data profil <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </section>
      </div>
    </div>
  );
}
