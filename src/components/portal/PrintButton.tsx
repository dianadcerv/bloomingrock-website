"use client";

export function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      className="btn btn--quiet portal-btn-quiet"
      type="button"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}
