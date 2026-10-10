"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipboardList, House, LayoutGrid, LogOut, UserRound } from "lucide-react";
import { Logo } from "@/components/ui";
import { useStore } from "@/lib/store";

const nav = [
  { href: "/beranda", label: "Beranda", icon: House },
  { href: "/layanan", label: "Layanan", icon: LayoutGrid },
  { href: "/permohonan", label: "Permohonan", icon: ClipboardList },
  { href: "/profil", label: "Profil", icon: UserRound },
];

export default function WargaLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useStore();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace("/");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-400">Memuat…</div>;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/beranda"><Logo /></Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className={`rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <div className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white ${user.avatarColor}`}>
              {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </div>
            <button
              onClick={() => {
                logout();
                router.replace("/");
              }}
              title="Keluar"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white md:hidden">
        {nav.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${active ? "text-blue-700" : "text-slate-500"}`}>
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
