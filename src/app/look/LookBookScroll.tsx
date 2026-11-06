"use client";

import { useLayoutEffect } from "react";

/** Ensures /look#book lands on the intake form after client-side navigation. */
export function LookBookScroll() {
  useLayoutEffect(() => {
    if (window.location.hash !== "#book") return;

    const target = document.getElementById("book");
    if (!target) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: reduced ? "instant" : "smooth",
      block: "start",
    });
  }, []);

  return null;
}
