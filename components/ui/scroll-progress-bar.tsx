"use client";

import { useEffect, useState } from "react";

/**
 * Thin gold scroll-progress indicator fixed at the very top of the viewport.
 * Fills left→right as the user scrolls from top to bottom of the page.
 * Respects prefers-reduced-motion (hidden when motion is reduced).
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Respect reduced-motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      setVisible(scrollTop > 60);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full transition-[width] duration-75 ease-out"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #bcb273 0%, #d4c87a 60%, #bcb273 100%)",
          boxShadow: "0 0 6px rgba(188,178,115,0.6)",
        }}
      />
    </div>
  );
}
