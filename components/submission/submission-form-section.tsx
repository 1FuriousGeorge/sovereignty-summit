"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  Backpack,
  Beef,
  Building2,
  Camera,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FlaskConical,
  Globe,
  Hand,
  Handshake,
  Home,
  Leaf,
  Loader2,
  Mic,
  Package,
  Smartphone,
  Sprout,
  Tag,
  Wrench,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

const HERO_BACKGROUND =
  "https://assets.murphslifefoundation.com/hero.jpg";

const SUBMISSION_BACKGROUND =
  "https://assets.murphslifefoundation.com/blue-bg.jpg";

/** MurphsLife logo — kept per product request (reference HTML used Casa Conejo mark). */
const MURPHS_LOGO_WHITE =
  "https://assets.murphslifefoundation.com/logo-variations/white-logo.png";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const requestTypeOptions = [
  { value: "", label: "Select your role" },
  {
    value: "attendee",
    label: "Attendee — I want to come and learn",
  },
  {
    value: "event_speaker",
    label: "Speaker / Teacher — I have knowledge to share",
  },
  {
    value: "sponsor",
    label: "Sponsor / Brand / Partner — I want to support or collaborate",
  },
] as const;

const pillarCards: readonly {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Sprout,
    title: "Food Sovereignty",
    body: "Growing, preserving, and building independence from fragile supply chains.",
  },
  {
    icon: Home,
    title: "Regenerative Living",
    body: "Land stewardship, livestock systems, and circular inputs that build rather than deplete.",
  },
  {
    icon: Wrench,
    title: "Practical Self-Reliance",
    body: "Skills you can actually use — preservation, products, systems, and tools.",
  },
  {
    icon: Handshake,
    title: "Aligned Community",
    body: "People building real things, not just talking about them.",
  },
];

const whyCards: readonly {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Wrench,
    title: "Learn skills you can actually use",
    body: "Not theory. Hands-on, practical knowledge around food, land, and resilient systems — taught by people who live it.",
  },
  {
    icon: Globe,
    title: "Connect with aligned people and companies",
    body: "A curated room of builders, operators, educators, brands, and community members who care about the same things you do.",
  },
  {
    icon: Leaf,
    title: "Experience it on a real regenerative farm",
    body: "Casa Conejo is a working campus in El Salvador — 46 acres of real land, real systems, and real community being built right now.",
  },
  {
    icon: Hand,
    title: "Get in early and help shape it",
    body: "We're building the program, the speaker lineup, and the partner roster now. The people who engage first will have the most direct influence on what this becomes.",
  },
];

const topicCards: readonly {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Leaf,
    title: "Growing Food",
    body: "Soil health, garden systems, high-yield crops, and practical cultivation",
  },
  {
    icon: Package,
    title: "Preserving Food",
    body: "Fermentation, canning, dehydration, and long-term storage systems",
  },
  {
    icon: FlaskConical,
    title: "Making Products",
    body: "Value-added goods, herbal medicine, household products, and cottage industry",
  },
  {
    icon: Beef,
    title: "Regenerative Livestock & Land",
    body: "Rotational grazing, animal integration, and land restoration systems",
  },
  {
    icon: Zap,
    title: "Building Resilient Systems",
    body: "Water, energy, waste, and infrastructure for long-term self-sufficiency",
  },
  {
    icon: Smartphone,
    title: "Modern Tools & Community",
    body: "Business systems, digital tools, and community models that support sovereignty",
  },
];

const whoCards: readonly {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: Backpack,
    title: "Aspiring Attendees",
    body: "You want to learn, connect, and leave with skills and relationships that last.",
  },
  {
    icon: Mic,
    title: "Teachers & Speakers",
    body: "You have knowledge worth sharing and want to teach it in a real-world setting.",
  },
  {
    icon: Tag,
    title: "Sponsors & Brands",
    body: "You want to reach a highly aligned audience and support something mission-driven.",
  },
  {
    icon: Building2,
    title: "Partner Companies",
    body: "You have tools, products, or services that belong in this ecosystem.",
  },
  {
    icon: Camera,
    title: "Creators & Media",
    body: "You want to document, share, and amplify something worth covering.",
  },
  {
    icon: Globe,
    title: "Volunteers & Local Support",
    body: "You're in El Salvador or nearby and want to be part of building this on the ground.",
  },
];

const statCards = [
  {
    stat: "46",
    label: "Acres of owned regenerative land at Casa Conejo",
  },
  {
    stat: "11M+",
    label: "Social media followers across MurphsLife distribution",
  },
  {
    stat: "SV",
    label: "Government-aligned regenerative development partnership",
  },
  {
    stat: "501(c)(3)",
    label: "Registered nonprofit · EIN 85-3332093",
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -10px 0px" as const },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

function scrollToForm() {
  document
    .getElementById("form-section")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const fieldClass =
  "w-full rounded-md border border-gold/25 bg-creme/60 px-4 py-3 text-sm text-foliage outline-none transition-[border-color,background-color] placeholder:text-foliage/35 focus:border-foliage focus:bg-creme";

const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-wide text-foliage/70 uppercase";

export default function SubmissionFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.style.background = "rgba(15,15,15,0.92)";
        nav.style.backdropFilter = "blur(12px)";
      } else {
        nav.style.background = "transparent";
        nav.style.backdropFilter = "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!TURNSTILE_SITE_KEY) {
      setError(
        "Human verification is not configured. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY.",
      );
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the security check below before sending.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("first_name") ?? "").trim();
    const lastName = String(fd.get("last_name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const requestType = String(fd.get("request_type") ?? "").trim();
    const location = String(fd.get("location") ?? "").trim();
    const messageBody = String(fd.get("message") ?? "").trim();
    const mailingListEvent = fd.get("mailing_list_event") === "on";
    const mailingListGeneral = fd.get("mailing_list_general") === "on";

    if (!messageBody) {
      setError(
        "Please add a short note so we understand what you’re curious about.",
      );
      return;
    }

    if (
      requestType !== "attendee" &&
      requestType !== "event_speaker" &&
      requestType !== "sponsor"
    ) {
      setError("Please choose how you’d like to connect with the summit.");
      return;
    }

    setPending(true);

    const res = await fetch("/api/connect-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turnstileToken,
        firstName,
        lastName: lastName || undefined,
        email,
        requestType,
        location,
        messageBody,
        mailingListEvent,
        mailingListGeneral,
      }),
    });

    const data = (await res.json()) as { error?: string };

    setPending(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      return;
    }

    setSubmitted(true);
    form.reset();
    turnstileRef.current?.reset();
    setTurnstileToken(null);
  }

  return (
    <>
      <nav
        id="main-nav"
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-[background,backdrop-filter] duration-300"
      >
        <a
          href="https://murphslifefoundation.org"
          className="shrink-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={MURPHS_LOGO_WHITE}
            alt="MurphsLife Foundation"
            width={180}
            height={48}
            className="h-8 w-auto object-contain opacity-90"
            priority
          />
        </a>
        <button
          type="button"
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 rounded-full bg-foliage px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-creme transition-transform duration-200 hover:-translate-y-0.5"
        >
          <ArrowDown className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
          Join the Interest List
        </button>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden text-center">
        <div
          className="animate-hero-kenburns pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${HERO_BACKGROUND}")`, willChange: "transform", transform: "translateZ(0)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(15,15,15,0.45)] via-foliage/55 to-[rgba(15,15,15,0.82)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-28">
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0 }} style={{ willChange: "opacity, transform" }}>
            <span className="font-sans mb-6 inline-block rounded-full border border-gold/35 bg-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Casa Conejo · El Salvador · Coming 2026
            </span>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="font-display mb-5 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-white"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          >
            The Regenerative Homestead
            <br />
            <em className="text-summit-mint italic">Sovereignty Summit</em>
            <br />
            at Casa Conejo.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="mx-auto mb-8 max-w-xl font-sans text-[clamp(1rem,2.5vw,1.15rem)] leading-relaxed text-white/85"
          >
            A hands-on gathering at our regenerative farm in El Salvador —
            focused on food sovereignty, practical skills, resilient systems, and
            aligned community. Dates and full details coming soon.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.22 }}
            className="mb-5 flex flex-wrap justify-center gap-3"
          >
            <button
              type="button"
              onClick={scrollToForm}
              className="flex items-center gap-2 rounded-full bg-foliage px-8 py-4 text-sm font-bold tracking-wide text-creme shadow-[0_4px_20px_rgba(44,52,45,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <ArrowDown className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
              Join the Interest List
            </button>
            <button
              type="button"
              onClick={scrollToForm}
              className="flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 py-4 text-sm font-semibold tracking-wide text-white backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
            >
              <ClipboardList className="size-4 shrink-0 stroke-[2]" aria-hidden />
              Tell Us How You Want to Be Involved
            </button>
          </motion.div>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.28 }}
            className="text-xs tracking-wide text-white/45"
          >
            Attendees · Speakers · Sponsors · Partners · Creators · Aligned
            Companies
          </motion.p>
        </div>

        <div
          className="animate-scroll-hint absolute bottom-8 left-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-white/35"
          aria-hidden
        >
          <ChevronDown className="size-5 stroke-[1.5]" />
          Scroll
        </div>
      </section>

      {/* What This Is */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
            What This Is
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-12 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
          >
            Not a conference. A real farm. A real community.
          </motion.h2>
          <div className="grid items-start gap-12 md:grid-cols-2">
            <motion.div {...fadeUp} className="space-y-4 text-sm leading-relaxed text-foliage/65">
              <p>
                <strong className="text-foliage">
                  The Regenerative Homestead Sovereignty Summit
                </strong>{" "}
                is happening at Casa Conejo — MurphsLife Foundation&apos;s
                46-acre regenerative campus in El Salvador. Partnerships are
                being finalized and dates will be announced soon.
              </p>
              <p>
                This page is your early access. We&apos;re building the attendee
                list, speaker roster, and partner lineup now — and the people who
                raise their hand first will have the most influence on what this
                becomes.
              </p>
              <p>
                Real land. Real teachers. Real skills. Real people. Not a
                ballroom. Not a panel circuit. A working farm and a chance to
                learn things that actually matter.
              </p>
            </motion.div>
            <div className="space-y-3">
              {pillarCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                    className="flex items-start gap-4 rounded-xl border-l-4 border-foliage bg-creme p-5"
                  >
                    <span className="mt-0.5 flex shrink-0 text-foliage">
                      <Icon className="size-7 stroke-[1.5]" aria-hidden />
                    </span>
                    <div>
                      <p className="font-sans text-sm font-semibold text-foliage">
                        {card.title}
                      </p>
                      <p className="mt-1 font-sans text-xs leading-relaxed text-foliage/60">
                        {card.body}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-creme px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
            Why People Are Interested
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
          >
            Four reasons this matters right now.
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mb-12 max-w-xl text-sm leading-relaxed text-foliage/60"
          >
            Whether you&apos;re a builder, a learner, a brand, or a creator —
            here&apos;s why this summit is worth showing up for.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  className="cursor-default rounded-2xl border border-gold/15 bg-white p-8 shadow-[0_2px_8px_rgba(44,52,45,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(44,52,45,0.12)]"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-foliage/10 text-foliage">
                    <Icon className="size-7 stroke-[1.5]" aria-hidden />
                  </div>
                  <h3 className="font-display mb-2 text-lg font-bold text-foliage">
                    {card.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-foliage/60">
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="bg-foliage px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
            Topics & Themes
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-white"
          >
            What we&apos;re covering.
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mb-12 max-w-xl text-sm leading-relaxed text-white/55"
          >
            The full program is being built now. These are the core areas —
            practical, hands-on, and grounded in what actually works.
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topicCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  className="cursor-default rounded-xl border border-white/10 bg-white/10 p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.12]"
                >
                  <span className="mb-3 flex justify-center text-white">
                    <Icon className="size-9 stroke-[1.35]" aria-hidden />
                  </span>
                  <p className="font-sans text-sm font-semibold text-white">
                    {card.title}
                  </p>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-white/50">
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
            Who This Is For
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
          >
            There&apos;s a seat at the table for you.
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mb-12 max-w-xl text-sm leading-relaxed text-foliage/60"
          >
            We&apos;re building something that needs multiple kinds of
            people. Here&apos;s who we&apos;re looking for.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  className="cursor-default rounded-xl border border-gold/15 bg-creme p-6 text-center transition-colors duration-200 hover:border-gold"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-foliage/10 text-foliage">
                    <Icon className="size-7 stroke-[1.5]" aria-hidden />
                  </div>
                  <h3 className="mb-2 font-sans text-sm font-bold text-foliage">
                    {card.title}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed text-foliage/55">
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form-section" className="bg-creme px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-16 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
                Interest Form
              </p>
              <h2 className="font-display mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage">
                Tell us who you are and how you want to be involved.
              </h2>
              <p className="font-sans text-sm leading-relaxed text-foliage/60">
                The summit is happening. Dates and full details are coming soon.
                Get your name in now — attendees, speakers, sponsors, partners,
                and creators who register early will hear first.
              </p>
            </motion.div>

            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                  role="status"
                >
                  <div
                    className="mb-4 flex justify-center text-gold"
                    aria-hidden
                  >
                    <Sprout className="size-14 stroke-[1.25]" />
                  </div>
                  <h3 className="font-display mb-3 text-2xl font-bold text-foliage">
                    You&apos;re on the list.
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-foliage/65">
                    You&apos;re on the early list. We&apos;ll reach out with
                    dates, details, and next steps as they&apos;re confirmed.
                    Thank you for being part of this from the start.
                  </p>
                </motion.div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className={labelClass}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder="First name"
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="last_name" className={labelClass}>
                        Last Name{" "}
                        <span className="font-normal normal-case tracking-normal text-foliage/40">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Last name"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="request_type" className={labelClass}>
                      I&apos;m interested as a…{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="request_type"
                      name="request_type"
                      required
                      defaultValue=""
                      className={`${fieldClass} appearance-none bg-[rgba(242,235,217,0.6)]`}
                    >
                      {requestTypeOptions.map((opt) => (
                        <option
                          key={opt.value || "placeholder"}
                          value={opt.value}
                          disabled={opt.value === ""}
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      Location{" "}
                      <span className="font-normal normal-case tracking-normal text-foliage/40">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      autoComplete="address-level1"
                      placeholder="City, country"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Why are you interested?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us a bit about yourself and what draws you to this..."
                      className={`${fieldClass} resize-y`}
                    />
                  </div>

                  <div
                    className="rounded-xl border border-foliage/15 p-5"
                    style={{ background: "rgba(44,52,45,0.06)" }}
                  >
                    <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wide text-foliage/55">
                      Email preferences
                    </p>
                    <label className="flex cursor-pointer gap-3 text-sm leading-snug text-foliage/80">
                      <input
                        name="mailing_list_event"
                        type="checkbox"
                        defaultChecked
                        className="border-gold/40 text-foliage mt-0.5 h-4 w-4 shrink-0 rounded focus:ring-foliage"
                      />
                      <span>
                        Email me about{" "}
                        <strong className="font-semibold text-foliage">
                          this summit
                        </strong>{" "}
                        as plans evolve. Unsubscribe anytime.
                      </span>
                    </label>
                    <label className="mt-3 flex cursor-pointer gap-3 text-sm leading-snug text-foliage/80">
                      <input
                        name="mailing_list_general"
                        type="checkbox"
                        className="border-gold/40 text-foliage mt-0.5 h-4 w-4 shrink-0 rounded focus:ring-foliage"
                      />
                      <span>
                        Also include me in broader MurphsLife updates{" "}
                        <span className="text-foliage/50">
                          (separate mailing list)
                        </span>
                        .
                      </span>
                    </label>
                  </div>

                  {TURNSTILE_SITE_KEY ? (
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={handleTurnstileSuccess}
                        onExpire={handleTurnstileExpire}
                        onError={handleTurnstileError}
                        options={{ theme: "light", size: "flexible" }}
                      />
                      <p className="text-center text-xs text-foliage/45">
                        Quick security check · Cloudflare Turnstile
                      </p>
                    </div>
                  ) : (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-sm text-amber-900">
                      Add{" "}
                      <code className="rounded bg-amber-100/80 px-1">
                        NEXT_PUBLIC_TURNSTILE_SITE_KEY
                      </code>{" "}
                      to your environment to enable the security check.
                    </p>
                  )}

                  {error ? (
                    <p
                      className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800"
                      role="alert"
                    >
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={
                      pending || !TURNSTILE_SITE_KEY || !turnstileToken
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foliage py-4 text-sm font-bold uppercase tracking-widest text-creme shadow-[0_4px_20px_rgba(44,52,45,0.3)] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {pending ? (
                      <>
                        <Loader2
                          className="size-4 shrink-0 animate-spin stroke-[2.5]"
                          aria-hidden
                        />
                        Sending…
                      </>
                    ) : (
                      <>
                        Raise My Hand
                        <ArrowRight className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
                      </>
                    )}
                  </button>
                  <p className="text-center font-sans text-xs text-foliage/40">
                    We&apos;ll reach out with dates and details as
                    they&apos;re confirmed.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
            About MurphsLife & Casa Conejo
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-12 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
          >
            We&apos;re not planning this from a conference room.
          </motion.h2>
          <div className="grid items-start gap-12 md:grid-cols-2">
            <motion.div {...fadeUp} className="space-y-4 text-sm leading-relaxed text-foliage/65">
              <p>
                <strong className="text-foliage">MurphsLife Foundation</strong>{" "}
                is a 501(c)(3) nonprofit building regenerative communities,
                humanitarian programs, and mission-aligned social enterprises
                across Latin America.
              </p>
              <p>
                <strong className="text-foliage">Casa Conejo</strong> is our
                flagship campus in El Salvador — a 46-acre regenerative property
                being developed as an eco-resort, working farm, training center,
                and community hub. It&apos;s part of a broader national
                regenerative development portfolio in partnership with the
                Salvadoran government.
              </p>
              <p>
                We&apos;re not theorizing. We&apos;re building. The summit will
                happen on land we&apos;re actively stewarding — which means the
                context is real, the teachers will be real, and the outcomes
                will be measurable.
              </p>
              <div className="pt-2">
                <a
                  href="https://casaconejo.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-foliage/50 transition-colors hover:text-foliage"
                >
                  Explore the Casa Conejo Ecosystem
                  <ExternalLink className="size-3.5 shrink-0 stroke-[2]" aria-hidden />
                </a>
              </div>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {statCards.map((s, i) => (
                <motion.div
                  key={s.label}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  className="rounded-xl border-l-4 border-gold bg-creme p-5"
                >
                  <p className="font-display text-3xl font-bold leading-none text-foliage">
                    {s.stat}
                  </p>
                  <p className="mt-1 font-sans text-xs leading-snug text-foliage/55">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-foliage px-6 py-24 text-center">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.08]"
          style={{
            backgroundImage: `url("${SUBMISSION_BACKGROUND}")`,
            backgroundPosition: "center 60%",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <motion.p
            {...fadeUp}
            className="font-sans mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gold"
          >
            The Regenerative Homestead Sovereignty Summit · Casa Conejo · El
            Salvador
          </motion.p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white"
          >
            Raise your hand early.
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-white/70"
          >
            The summit is coming. Dates and full details will be announced
            soon. If you want to attend, speak, sponsor, partner, or create —
            add your info now and be among the first to know.
          </motion.p>
          <motion.div {...fadeUp}>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 rounded-full bg-creme px-10 py-4 text-sm font-bold uppercase tracking-widest text-foliage shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Raise Your Hand
              <ArrowRight className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
            </button>
            <p className="mt-5 font-sans text-xs text-white/30">
              Dates and details coming soon. We&apos;ll reach out to everyone
              on the list first.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#0f0f0f] px-6 py-8 text-center">
        <Image
          src={MURPHS_LOGO_WHITE}
          alt="MurphsLife Foundation"
          width={160}
          height={40}
          className="mx-auto mb-4 h-7 w-auto object-contain opacity-60"
        />
        <p className="font-sans text-xs text-white/35">
          MurphsLife Foundation · 501(c)(3) Nonprofit · EIN 85-3332093
        </p>
        <p className="mt-2 font-sans text-xs text-white/25">
          El Salvador & United States
        </p>
        <p className="mx-auto mt-4 max-w-md font-sans text-xs leading-relaxed text-white/20">
          The Regenerative Homestead Sovereignty Summit at Casa Conejo. Dates
          and complete program details coming soon. Partnerships and the speaker
          lineup are currently being finalized.
        </p>
      </footer>
    </>
  );
}
