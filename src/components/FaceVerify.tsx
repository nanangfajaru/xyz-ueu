"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CircleCheck, Lock, RefreshCw, ScanFace, Upload, UserRound } from "lucide-react";
import { Citizen, citizens } from "@/lib/data";

type Phase = "idle" | "camera" | "scanning" | "matched" | "error";

const scanSteps = [
  "Mendeteksi wajah…",
  "Memeriksa liveness (simulasi)…",
  "Mengekstrak fitur wajah secara lokal…",
  "Mencocokkan dengan data Dukcapil (simulasi)…",
];

/**
 * Simulasi verifikasi identitas berbasis foto wajah.
 * Gambar hanya diproses di memori browser untuk pratinjau, tidak disimpan dan tidak dikirim ke server.
 * Pencocokan dilakukan terhadap profil dummy yang dipilih pengguna.
 */
export default function FaceVerify({ onVerified }: { onVerified: (c: Citizen) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [photo, setPhoto] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(citizens[0].id);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  async function startCamera() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
      streamRef.current = stream;
      setPhase("camera");
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setError("Kamera tidak dapat diakses. Gunakan unggah foto atau mode demo.");
      setPhase("error");
    }
  }

  function capture() {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.8));
    stopCamera();
    runScan();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      runScan();
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  }

  function demo() {
    setPhoto(null);
    runScan();
  }

  function runScan() {
    setPhase("scanning");
    setStep(0);
    scanSteps.forEach((_, i) => setTimeout(() => setStep(i), i * 650));
    setTimeout(() => setPhase("matched"), scanSteps.length * 650 + 300);
  }

  function reset() {
    stopCamera();
    setPhoto(null);
    setPhase("idle");
  }

  const match = citizens.find((c) => c.id === selected)!;

  return (
    <div className="space-y-5">
      {/* Pilihan profil dummy yang akan "dicocokkan" */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Profil warga dummy untuk simulasi</label>
        <div className="grid grid-cols-3 gap-2">
          {citizens.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={phase === "scanning"}
              onClick={() => setSelected(c.id)}
              className={`rounded-xl border p-2.5 text-left transition ${
                selected === c.id ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className={`mb-1.5 grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white ${c.avatarColor}`}>
                {c.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </div>
              <div className="truncate text-xs font-semibold">{c.name}</div>
              <div className="truncate text-[10px] text-slate-500">{c.kota}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Area kamera / pratinjau */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900">
        {phase === "camera" && <video ref={videoRef} playsInline muted className="h-full w-full -scale-x-100 object-cover" />}
        {phase !== "camera" && photo && <img src={photo} alt="Pratinjau wajah" className="h-full w-full object-cover" />}
        {phase !== "camera" && !photo && (
          <div className="grid h-full w-full place-items-center text-slate-500">
            <UserRound className="h-24 w-24" strokeWidth={1} />
          </div>
        )}

        {/* Bingkai oval panduan wajah */}
        {(phase === "camera" || phase === "scanning") && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-[72%] w-[46%] rounded-[50%] border-4 border-dashed border-white/70 shadow-[0_0_0_9999px_rgba(15,23,42,0.45)]" />
          </div>
        )}
        {phase === "scanning" && (
          <>
            <div className="scanline absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_4px_rgba(34,211,238,0.6)]" />
            <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-3 text-center text-sm font-medium text-cyan-200">
              {scanSteps[step]}
            </div>
          </>
        )}
        {phase === "matched" && (
          <div className="absolute inset-0 grid place-items-center bg-emerald-950/60 backdrop-blur-[1px]">
            <div className="text-center text-white">
              <CircleCheck className="mx-auto h-14 w-14 text-emerald-300" />
              <div className="mt-2 text-lg font-bold">Identitas Terverifikasi</div>
              <div className="text-sm text-emerald-100">Skor kecocokan 98,7% (simulasi)</div>
            </div>
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white">
          <Lock className="h-3 w-3" /> Diproses lokal di perangkat
        </div>
      </div>

      {error && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {(phase === "idle" || phase === "error") && (
        <>
          <label className="flex items-start gap-2.5 text-xs text-slate-600">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-blue-600" />
            <span>
              Saya menyetujui penggunaan foto wajah hanya untuk simulasi verifikasi identitas. Foto tidak disimpan dan tidak dikirim ke server mana pun.
            </span>
          </label>
          <div className="grid gap-2 sm:grid-cols-3">
            <button disabled={!consent} onClick={startCamera} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40">
              <Camera className="h-4 w-4" /> Buka Kamera
            </button>
            <button disabled={!consent} onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              <Upload className="h-4 w-4" /> Unggah Foto
            </button>
            <button disabled={!consent} onClick={demo} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ScanFace className="h-4 w-4" /> Mode Demo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="user" hidden onChange={onFile} />
        </>
      )}

      {phase === "camera" && (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={reset} className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50">Batal</button>
          <button onClick={capture} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800">
            <ScanFace className="h-4 w-4" /> Ambil & Verifikasi
          </button>
        </div>
      )}

      {phase === "matched" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
            <div className="font-semibold text-emerald-900">{match.name}</div>
            <div className="text-emerald-800">NIK {match.nik.slice(0, 6)}••••••{match.nik.slice(-4)} · {match.kelurahan}, {match.kota}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" /> Ulangi
            </button>
            <button
              onClick={() => {
                setPhoto(null); // buang foto dari memori
                onVerified(match);
              }}
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Masuk ke Layanan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
