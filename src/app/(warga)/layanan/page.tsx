"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { Search } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { CategoryId, categories, services } from "@/lib/data";

function LayananList() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState<CategoryId | "semua">((params.get("kategori") as CategoryId) ?? "semua");

  const result = useMemo(() => {
    const term = q.trim().toLowerCase();
    return services.filter(
      (s) =>
        (cat === "semua" || s.category === cat) &&
        (!term || [s.name, s.agency, s.description].some((t) => t.toLowerCase().includes(term))),
    );
  }, [q, cat]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold">Katalog Layanan</h1>
        <p className="text-sm text-slate-500">{services.length} layanan dari berbagai perangkat daerah dalam satu platform.</p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama layanan atau instansi…"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {[{ id: "semua" as const, name: "Semua" }, ...categories].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${
              cat === c.id ? "bg-blue-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {result.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          Layanan tidak ditemukan. Coba kata kunci lain.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.map((s) => <ServiceCard key={s.id} s={s} />)}
        </div>
      )}
    </div>
  );
}

export default function LayananPage() {
  return (
    <Suspense>
      <LayananList />
    </Suspense>
  );
}
