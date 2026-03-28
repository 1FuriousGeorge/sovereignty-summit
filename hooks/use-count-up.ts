"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` when the element enters the viewport.
 * Returns the current display value as a string (preserving suffix like "M+").
 *
 * @param target  - The numeric end value (e.g. 46, 11)
 * @param suffix  - Optional suffix appended after the number (e.g. "M+", "+")
 * @param duration - Animation duration in ms (default 1400)
 */
export function useCountUp(
  target: number,
  suffix = "",
  duration = 1400
): { ref: React.RefObject<HTMLElement | null>; display: string } {
  const ref = useRef<HTMLElement | null>(null);
  const [display, setDisplay] = useState("0" + suffix);
  const hasRun = useRef(false);

  useEffect(() => {
    // Respect reduced-motion preference — show final value immediately
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(target + suffix);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun.current) {
          hasRun.current = true;
          observer.disconnect();

          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setDisplay(current + suffix);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration]);

  return { ref, display };
}
