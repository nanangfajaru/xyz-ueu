"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, ShieldCheck } from "lucide-react";
import FaceVerify from "@/components/FaceVerify";
import { CategoryIcon, Logo } from "@/components/ui";
import { categories, smartGovPriorities } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function MasukPage() {
  const { user, ready, login } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/beranda");
  }, [ready, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo light />
        <Link href="/admin" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20">
          <LayoutDashboard className="h-4 w-4" /> Dashboard Admin
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-4 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:pt-10">
        <section className="text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> One Access Public Service
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Satu akses untuk semua layanan publik Jakarta.
          </h1>
          <p className="mt-4 max-w-xl text-blue-100">
            Verifikasi identitas sekali dengan foto wajah, lalu ajukan layanan kependudukan, kesehatan, pendidikan, bantuan sosial,
            transportasi, dan lainnya — tanpa mengisi data diri berulang kali.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {categories.map((c) => (
              <div key={c.id} className="rounded-xl bg-white/10 p-3 text-center">
                <CategoryIcon id={c.id} className="mx-auto h-6 w-6" />
                <div className="mt-1.5 text-[10px] font-medium leading-tight text-blue-100">{c.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 hidden space-y-3 lg:block">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-200">Lima Prioritas Smart Governance Jakarta</div>
            {smartGovPriorities.map((p, i) => (
              <div key={p.title} className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-orange-500 text-xs font-bold">{i + 1}</div>
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-blue-100">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
          <h2 className="text-xl font-bold">Identifikasi Pengguna Layanan</h2>
          <p className="mt-1 text-sm text-slate-500">
            Simulasi verifikasi identitas berbasis foto wajah. Pilih profil dummy, lalu gunakan kamera, unggah foto, atau mode demo.
          </p>
          <div className="mt-5">
            <FaceVerify
              onVerified={(c) => {
                login(c.id);
                router.push("/beranda");
              }}
            />
          </div>
          <p className="mt-5 border-t border-slate-100 pt-4 text-[11px] leading-relaxed text-slate-400">
            Prototipe untuk demonstrasi konsep. Seluruh data bersifat fiktif dan tidak terhubung ke sistem Pemerintah Provinsi DKI Jakarta.
          </p>
        </section>
      </main>
    </div>
  );
}
