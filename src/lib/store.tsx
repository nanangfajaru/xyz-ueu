"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Application,
  Citizen,
  Status,
  citizens,
  makeTicket,
  seedApplications,
} from "./data";

// State aplikasi disimpan di localStorage browser (prototipe tanpa backend).
const KEY = "sps-jakarta-v1";

interface Persisted {
  citizenId: string | null;
  verifiedAt: string | null;
  applications: Application[];
  seq: number;
}

interface Store {
  ready: boolean;
  user: Citizen | null;
  verifiedAt: string | null;
  applications: Application[];
  myApplications: Application[];
  login: (citizenId: string) => void;
  logout: () => void;
  submit: (serviceId: string, data: Record<string, string>, documents: string[]) => Application;
  updateStatus: (id: string, status: Status, note: string) => void;
  rate: (id: string, rating: number, feedback: string) => void;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

function initial(): Persisted {
  return { citizenId: null, verifiedAt: null, applications: seedApplications(), seq: 1 };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(() => ({ citizenId: null, verifiedAt: null, applications: [], seq: 1 }));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded: Persisted | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = JSON.parse(raw);
    } catch {}
    setState(loaded ?? initial());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const login = useCallback((citizenId: string) => {
    setState((s) => ({ ...s, citizenId, verifiedAt: new Date().toISOString() }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, citizenId: null, verifiedAt: null }));
  }, []);

  const submit = useCallback(
    (serviceId: string, data: Record<string, string>, documents: string[]) => {
      const user = citizens.find((c) => c.id === state.citizenId)!;
      const now = new Date().toISOString();
      const app: Application = {
        id: makeTicket(serviceId, state.seq),
        serviceId,
        citizenId: user.id,
        citizenName: user.name,
        createdAt: now,
        status: "Diajukan",
        data,
        documents,
        history: [{ status: "Diajukan", at: now, note: "Permohonan diterima sistem dan diteruskan ke perangkat daerah terkait", by: "Sistem Otomatis" }],
      };
      setState((s) => ({ ...s, seq: s.seq + 1, applications: [app, ...s.applications] }));
      return app;
    },
    [state.citizenId, state.seq],
  );

  const updateStatus = useCallback((id: string, status: Status, note: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.id === id
          ? { ...a, status, history: [...a.history, { status, at: new Date().toISOString(), note, by: "Admin Pemprov DKI" }] }
          : a,
      ),
    }));
  }, []);

  const rate = useCallback((id: string, rating: number, feedback: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) => (a.id === id ? { ...a, rating, feedback } : a)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(initial());
  }, []);

  const value = useMemo<Store>(() => {
    const user = citizens.find((c) => c.id === state.citizenId) ?? null;
    return {
      ready,
      user,
      verifiedAt: state.verifiedAt,
      applications: state.applications,
      myApplications: user ? state.applications.filter((a) => a.citizenId === user.id) : [],
      login,
      logout,
      submit,
      updateStatus,
      rate,
      resetDemo,
    };
  }, [state, ready, login, logout, submit, updateStatus, rate, resetDemo]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}

export function formatDate(iso: string, withTime = false) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
