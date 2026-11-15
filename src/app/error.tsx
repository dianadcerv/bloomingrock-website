"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="marketing-page" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "0.75rem" }}>
        Something went wrong
      </h1>
      <p style={{ marginBottom: "1.5rem", maxWidth: "28rem", marginInline: "auto" }}>
        Please refresh the page and try again.
      </p>
      <button type="button" className="cta-primary" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}