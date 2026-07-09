interface EmailPreviewFrameProps {
  html: string;
}

export function EmailPreviewFrame({ html }: EmailPreviewFrameProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <iframe
        title="Email preview"
        srcDoc={html}
        className="h-[640px] w-full border-0"
      />
    </div>
  );
}
