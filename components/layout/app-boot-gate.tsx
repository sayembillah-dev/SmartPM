"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/layout/loading-screen";

const SEEN_KEY = "smartpm:boot:seen-v1";

type GateState = "checking" | "splash" | "ready";

export function AppBootGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("checking");

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(SEEN_KEY);
      setState(seen === "1" ? "ready" : "splash");
    } catch {
      // localStorage unavailable (e.g. SSR / private mode) — skip splash.
      setState("ready");
    }
  }, []);

  if (state === "checking") {
    // Prevent a flash of unstyled app shell during the localStorage probe.
    return <div className="fixed inset-0 bg-background" aria-hidden />;
  }

  if (state === "splash") {
    return (
      <LoadingScreen
        onComplete={() => {
          try {
            window.localStorage.setItem(SEEN_KEY, "1");
          } catch {
            // ignore — fall through and show the app anyway
          }
          setState("ready");
        }}
      />
    );
  }

  return <>{children}</>;
}
