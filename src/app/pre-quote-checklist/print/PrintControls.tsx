"use client";

import Link from "next/link";

export function PrintControls() {
  return (
    <p className="checklist-print__screen-only">
      <button type="button" onClick={() => window.print()}>
        Print or save as PDF
      </button>{" "}
      · <Link href="/pre-quote-checklist">Back to download page</Link>
    </p>
  );
}
