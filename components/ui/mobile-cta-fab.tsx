"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Persistent mobile-only "Raise My Hand" floating action bar.
 * Appears after the hero section (scrollY > 80% of viewport height)
 * and disappears when the user reaches the form section.
 * Hidden on md+ screens (desktop has the nav button).
 * Respects prefers-reduced-motion.
 */
export function MobileCtaFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      // Show after scrolling past ~80% of the first viewport (past the hero)
      const pastHero = scrollY > viewportH * 0.8;

      // Hide when the form section is in view
      const formEl = document.getElementById("form-section");
      let nearForm = false;
      if (formEl) {
        const rect = formEl.getBoundingClientRect();
        // Hide when the top of the form is within 120px of the bottom of the viewport
        nearForm = rect.top < viewportH + 120;
      }

      setVisible(pastHero && !nearForm);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToForm() {
    document
      .getElementById("form-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      aria-hidden={!visible}
      className={[
        // Only show on mobile (hidden on md+)
        "fixed bottom-5 left-1/2 z-[9998] -translate-x-1/2 md:hidden",
        "transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={scrollToForm}
        className="inline-flex items-center gap-2.5 rounded-full bg-foliage px-7 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-creme shadow-[0_8px_32px_rgba(44,52,45,0.55)] transition-all duration-200 active:scale-95"
        aria-label="Scroll to interest form"
      >
        <ArrowDown className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
        Raise My Hand
      </button>
    </div>
  );
}
