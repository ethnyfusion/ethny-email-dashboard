interface EmailPreviewFrameProps {
  html: string;
}

export function EmailPreviewFrame({ html }: EmailPreviewFrameProps) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">Live preview</p>
          <p className="text-xs text-[color:var(--foreground-muted)]">Rendered from the current campaign content</p>
        </div>
        <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--brand)]">
          Responsive
        </span>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)]">
        <iframe title="Email preview" srcDoc={html} className="h-[640px] w-full border-0" />
      </div>
    </div>
  );
}
