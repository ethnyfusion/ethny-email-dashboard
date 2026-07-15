"use client";

import { useState } from "react";

interface EmailPreviewFrameProps {
  html: string;
}

export function EmailPreviewFrame({ html }: EmailPreviewFrameProps) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">Aperçu e-mail</p>
          <p className="text-xs text-[color:var(--foreground-muted)]">Desktop et mobile</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("desktop")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              mode === "desktop"
                ? "bg-[color:var(--brand)] text-[color:var(--surface)]"
                : "bg-[color:var(--surface)] text-[color:var(--foreground-muted)]"
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setMode("mobile")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              mode === "mobile"
                ? "bg-[color:var(--brand)] text-[color:var(--surface)]"
                : "bg-[color:var(--surface)] text-[color:var(--foreground-muted)]"
            }`}
          >
            Mobile
          </button>
        </div>
      </div>
      <div className="overflow-auto rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3">
        <iframe
          title="Email preview"
          srcDoc={html}
          className={`border-0 ${
            mode === "mobile" ? "mx-auto h-[640px] w-[380px] max-w-full" : "h-[640px] w-full"
          }`}
        />
      </div>
    </div>
  );
}
