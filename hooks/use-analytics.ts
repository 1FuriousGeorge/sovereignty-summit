"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";

/**
 * useScrollDepthTracking
 * Fires Vercel Analytics events at 25%, 50%, 75%, and 100% scroll depth.
 * Attach once at the page level.
 */
export function useScrollDepthTracking() {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (pct >= t && !fired.current.has(t)) {
          fired.current.add(t);
          track("scroll_depth", { percent: t });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/**
 * trackFormStart
 * Call when the user first interacts with any form field.
 */
export function trackFormStart() {
  track("form_start", { form: "interest_form" });
}

/**
 * trackFormSubmit
 * Call on successful form submission.
 */
export function trackFormSubmit(role: string) {
  track("form_submit", { form: "interest_form", role });
}

/**
 * trackFormError
 * Call when form submission fails.
 */
export function trackFormError(reason: string) {
  track("form_error", { form: "interest_form", reason });
}

/**
 * trackCTAClick
 * Call when a primary CTA button is clicked.
 */
export function trackCTAClick(label: string) {
  track("cta_click", { label });
}
