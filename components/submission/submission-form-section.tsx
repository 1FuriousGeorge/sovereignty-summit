"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  Backpack,
  Beef,
  Building2,
  Camera,
  ChevronDown,
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

// Role options — used for form validation and backend whitelist
const requestTypeOptions = [
  { value: "", label: "Select your role" },
  { value: "attendee", label: "Attendee — I want to come and learn" },
  { value: "event_speaker", label: "Speaker / Teacher — I have knowledge to share" },
  { value: "sponsor", label: "Sponsor / Brand / Partner — I want to support or collaborate" },
  { value: "creator", label: "Creator / Media — I want to document and share this" },
  { value: "volunteer", label: "Volunteer / Local Support — I want to help build this on the ground" },
  { value: "partner", label: "Partner Company — My product or service belongs in this ecosystem" },
] as const;

type RequestTypeValue = (typeof requestTypeOptions)[number]["value"];

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
    title: "Attendees",
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
    label: "Acres of owned land at Casa Conejo",
  },
  {
    stat: "11M+",
    label: "Followers across MurphsLife network",
  },
  {
    stat: "SV",
    label: "Government-aligned development partner",
  },
  {
    stat: "501(c)(3)",
    label: "Registered U.S. nonprofit entity",
  },
] as const;

// Role card options for the visual role selector grid
const roleCardOptions: readonly {
  value: Exclude<RequestTypeValue, "">;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    value: "attendee",
    icon: Backpack,
    title: "Attendee",
    description: "I want to come, learn, and connect",
  },
  {
    value: "event_speaker",
    icon: Mic,
    title: "Speaker / Teacher",
    description: "I have knowledge worth sharing",
  },
  {
    value: "sponsor",
    icon: Tag,
    title: "Sponsor / Brand",
    description: "I want to support or collaborate",
  },
  {
    value: "creator",
    icon: Camera,
    title: "Creator / Media",
    description: "I want to document and amplify this",
  },
  {
    value: "volunteer",
    icon: Globe,
    title: "Volunteer",
    description: "I want to help build this on the ground",
  },
  {
    value: "partner",
    icon: Building2,
    title: "Partner Company",
    description: "My product or service belongs in this ecosystem",
  },
] as const;

function scrollToForm() {
  document
    .getElementById("form-section")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const fieldClass =
  "w-full rounded-md border border-gold/25 bg-creme/60 px-4 py-3 text-sm text-foliage outline-none ring-0 transition-[border-color,background-color,box-shadow] placeholder:text-foliage/35 focus:border-foliage/60 focus:bg-creme focus:ring-2 focus:ring-gold/30 focus:ring-offset-0";

const labelClass =
  "mb-1.5 block text-xs font-semibold tracking-wide text-foliage/70 uppercase";

export default function SubmissionFormSection() {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "0px 0px -80px 0px" as const },
        transition: { duration: 0.2, ease: "easeOut" as const },
      }
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "0px 0px -80px 0px" as const },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Role-based conditional form state
  const [selectedRole, setSelectedRole] = useState<RequestTypeValue>("");

  // UTM / source tracking — read from URL on mount
  const [utmSource, setUtmSource] = useState<string>("");
  const [utmMedium, setUtmMedium] = useState<string>("");
  const [utmCampaign, setUtmCampaign] = useState<string>("");
  const [referralSource, setReferralSource] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmSource(params.get("utm_source") ?? "");
    setUtmMedium(params.get("utm_medium") ?? "");
    setUtmCampaign(params.get("utm_campaign") ?? "");
    setReferralSource(params.get("ref") ?? params.get("source") ?? "");
  }, []);

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

    // Turnstile is optional — only validate token if the site key is configured
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
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
    const phone = String(fd.get("phone") ?? "").trim();
    const socialHandle = String(fd.get("social_handle") ?? "").trim();
    const messageBody = String(fd.get("message") ?? "").trim();
    const anythingElse = String(fd.get("anything_else") ?? "").trim();
    const mailingListEvent = fd.get("mailing_list_event") === "on";
    const mailingListGeneral = fd.get("mailing_list_general") === "on";

    // Role-specific fields
    const speakerTopics = String(fd.get("speaker_topics") ?? "").trim();
    const speakerExperience = String(fd.get("speaker_experience") ?? "").trim();
    const sponsorCompany = String(fd.get("sponsor_company") ?? "").trim();
    const sponsorWebsite = String(fd.get("sponsor_website") ?? "").trim();
    const sponsorBudget = String(fd.get("sponsor_budget") ?? "").trim();
    const creatorPlatform = String(fd.get("creator_platform") ?? "").trim();
    const creatorAudience = String(fd.get("creator_audience") ?? "").trim();

    if (!messageBody) {
      setError(
        "Please add a short note so we understand what you're curious about.",
      );
      return;
    }

    const validRoles = ["attendee", "event_speaker", "sponsor", "creator", "volunteer", "partner"];
    if (!validRoles.includes(requestType)) {
      setError("Please choose how you'd like to connect with the summit.");
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
        phone: phone || undefined,
        socialHandle: socialHandle || undefined,
        messageBody,
        anythingElse: anythingElse || undefined,
        mailingListEvent,
        mailingListGeneral,
        // Role-specific
        speakerTopics: speakerTopics || undefined,
        speakerExperience: speakerExperience || undefined,
        sponsorCompany: sponsorCompany || undefined,
        sponsorWebsite: sponsorWebsite || undefined,
        sponsorBudget: sponsorBudget || undefined,
        creatorPlatform: creatorPlatform || undefined,
        creatorAudience: creatorAudience || undefined,
        // Partner fields
        partnerOrg: String(fd.get("partner_org") ?? "").trim() || undefined,
        partnerWebsite: String(fd.get("partner_website") ?? "").trim() || undefined,
        partnerType: String(fd.get("partner_type") ?? "").trim() || undefined,
        // Volunteer fields
        volunteerSkills: String(fd.get("volunteer_skills") ?? "").trim() || undefined,
        volunteerLocal: String(fd.get("volunteer_local") ?? "").trim() || undefined,
        // UTM tracking
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        referralSource: referralSource || undefined,
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
    setSelectedRole("");
    turnstileRef.current?.reset();
    setTurnstileToken(null);
  }

  return (
    <>
      {/* Skip to main content — keyboard/screen-reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foliage focus:px-5 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-creme"
      >
        Skip to main content
      </a>

      <nav
        id="main-nav"
        aria-label="Main navigation"
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-[background,backdrop-filter] duration-300"
      >
        <a
          href="https://murphslifefoundation.org"
          className="flex shrink-0 items-center"
          aria-label="MurphsLife Foundation homepage"
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
          <span className="ml-2.5 hidden text-xs font-bold uppercase tracking-[0.18em] text-white/80 sm:inline">
            MurphsLife Foundation
          </span>
        </a>
        <button
          type="button"
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 rounded-full bg-foliage px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-creme shadow-[0_2px_10px_rgba(44,52,45,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(44,52,45,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
        >
          <ArrowDown className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
          Raise My Hand
        </button>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <main id="main-content">
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden text-center"
        aria-label="Summit hero — The Regenerative Homestead Sovereignty Summit at Casa Conejo"
      >
        <div
          className="animate-hero-kenburns pointer-events-none absolute inset-0 bg-cover"
          style={{ backgroundImage: `url("${HERO_BACKGROUND}")`, backgroundPosition: "center 65%", willChange: "transform", transform: "translateZ(0)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(15,15,15,0.35)] via-foliage/40 to-[rgba(15,15,15,0.72)]"
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
            className="font-display mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight text-white"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          >
            The Regenerative Homestead
            <br />
            <em className="text-summit-mint italic">Sovereignty Summit</em>
            <br />
            at Casa Conejo.
          </motion.h1>
          {/* Punch line from the original X post */}
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.13 }}
            className="mx-auto mb-5 max-w-lg font-sans text-[clamp(0.95rem,2vw,1.1rem)] font-semibold leading-relaxed text-white/90 tracking-wide"
          >
            Grow food. Preserve it. Build products. Learn systems. Meet aligned people.
          </motion.p>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.18 }}
            className="mx-auto mb-8 max-w-xl font-sans text-[clamp(0.9rem,2.2vw,1.05rem)] leading-relaxed text-white/70"
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
              className="flex items-center gap-2 rounded-full bg-foliage px-8 py-4 text-sm font-bold tracking-[0.08em] text-creme shadow-[0_4px_20px_rgba(44,52,45,0.5)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(44,52,45,0.6)]"
            >
              <ArrowDown className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
              Raise My Hand
            </button>

          </motion.div>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.28 }}
            className="text-xs tracking-wide text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
          >
            Attendees · Speakers · Sponsors · Partners · Creators · Aligned
            Companies
          </motion.p>
        </div>

        <div
          className="animate-scroll-hint absolute bottom-8 left-1/2 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-white/70 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
          aria-hidden
        >
          <ChevronDown className="size-5 stroke-[1.5]" />
          Scroll
        </div>
      </section>

      {/* ─── Credibility Stat Strip ─────────────────────────────────────── */}
      <section
        className="bg-foliage px-6 py-8"
        aria-label="MurphsLife Foundation key facts"
      >
        <div className="mx-auto max-w-5xl">
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {statCards.map(({ stat, label }) => (
              <div key={stat} className="text-center">
                <dt className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-none text-gold">
                  {stat}
                </dt>
                <dd className="mt-2 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] leading-snug text-white/60">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── What This Is ─────────────────────────────────────────────────── */}
      <section className="bg-creme px-6 py-20" aria-label="What this summit is">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6b6030]">
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
              {/* Standout block — per Grok feedback */}
              <blockquote className="rounded-xl border-l-4 border-foliage bg-foliage px-6 py-5 text-sm leading-relaxed text-white not-italic">
                <strong className="block mb-1 text-gold text-xs font-bold uppercase tracking-widest">The difference</strong>
                Real land. Real teachers. Real skills. Real people. Not a
                ballroom. Not a panel circuit. A working farm and a chance to
                learn things that actually matter.
              </blockquote>
            </motion.div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pillarCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                    className="flex items-start gap-4 rounded-xl border-l-4 border-foliage bg-white p-5"
                  >
                    <span className="mt-0.5 flex shrink-0 text-foliage">
                      <Icon className="size-7 stroke-[1.5]" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-sans text-sm font-semibold text-foliage">
                        {card.title}
                      </h3>
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

      {/* ─── Farm Photo Break 1 — volcano view ───────────────────────────── */}
      <div className="relative h-[420px] overflow-hidden md:h-[520px]" aria-hidden>
        <Image
          src="/farm-volcano.jpg"
          alt="Terraced regenerative farm rows at Casa Conejo with volcano in background, El Salvador"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-foliage/60" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-white/80">
            Casa Conejo · El Salvador
          </p>
          <p className="mt-1 font-sans text-sm text-white/60">
            46 acres of regenerative land, with volcano views
          </p>
        </div>
      </div>

      {/* ─── Why ──────────────────────────────────────────────────────────── */}
      <section className="bg-creme px-6 py-20" aria-label="Why people are interested">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6b6030]">
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
            className="mb-12 max-w-xl text-sm leading-relaxed text-foliage/70"
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
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-foliage">
                    <Icon className="size-7 stroke-[1.5]" aria-hidden />
                  </div>
                  <h3 className="font-display mb-2 text-lg font-bold text-foliage">
                    {card.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-foliage/70">
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Harvesting photo accent below Why cards */}
          <motion.div {...fadeUp} className="mt-14 grid gap-6 md:grid-cols-2 items-center">
            <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg md:h-80">
              <Image
                src="/women-harvesting.jpg"
                alt="Local women harvesting fresh vegetables at Casa Conejo regenerative farm"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-foliage/65">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#6b6030]">
                Real Work. Real People.
              </p>
              <p className="font-display text-xl font-bold text-foliage leading-snug">
                This is what food sovereignty looks like in practice.
              </p>
              <p>
                Casa Conejo employs local community members, grows food year-round,
                and is actively developing the training and hospitality infrastructure
                that will host the summit. When you come, you&apos;re not visiting a
                concept — you&apos;re walking into something already being built.
              </p>
              <button
                type="button"
                onClick={scrollToForm}
                    className="inline-flex items-center gap-2 rounded-full bg-foliage px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-creme shadow-[0_2px_10px_rgba(44,52,45,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(44,52,45,0.42)]"
              >
                Raise My Hand
                <ArrowRight className="size-3.5 shrink-0 stroke-[2.5]" aria-hidden />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Topics ───────────────────────────────────────────────────────── */}
      <section className="bg-foliage px-6 py-20" aria-label="Summit topics and themes">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#a89a5a]">
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
            className="mb-12 max-w-xl text-sm leading-relaxed text-white/70"
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
                  className="rounded-2xl border border-white/10 bg-white/8 p-7 transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-white/12"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-gold">
                    <Icon className="size-6 stroke-[1.5]" aria-hidden />
                  </div>
                  <h3 className="font-display mb-2 text-base font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-white/75">
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Who This Is For ──────────────────────────────────────────────── */}
      <section className="bg-creme px-6 py-20" aria-label="Who this summit is for">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6b6030]">
            Who This Is For
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
          >
            Builders, learners, brands, and creators.
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="mb-12 max-w-xl text-sm leading-relaxed text-foliage/60"
          >
            This isn&apos;t a general-audience event. It&apos;s for people who
            are already building, learning, or investing in this direction.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                  className="cursor-default rounded-2xl border border-foliage/10 bg-creme p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(44,52,45,0.1)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-foliage">
                    <Icon className="size-6 stroke-[1.5]" aria-hidden />
                  </div>
                  <h3 className="font-display mb-2 text-base font-bold text-foliage">
                    {card.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-foliage/70">
                    {card.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Interest Form ────────────────────────────────────────────────── */}
      <section
        id="form-section"
        className="relative overflow-hidden px-6 py-20"
        aria-label="Summit interest form"
        style={{ background: "linear-gradient(160deg, #f2ebd9 0%, #e8dfc8 100%)" }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_480px]">
            {/* Left copy */}
            <div>
              <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6b6030]">
                Join the Interest List
              </p>
              <motion.h2
                {...fadeUp}
                className="font-display mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
              >
                Raise your hand early.
              </motion.h2>
              <motion.p {...fadeUp} className="mb-6 text-sm leading-relaxed text-foliage/65">
                The summit is coming. Dates and full details will be announced
                soon. Tell us who you are and how you want to be involved — and
                we&apos;ll reach out directly when things are confirmed.
              </motion.p>
              <motion.div {...fadeUp} className="space-y-3">
                {[
                  "Attendees get early access to registration",
                  "Speakers get first consideration for the program",
                  "Sponsors get a direct intro to the team",
                  "Creators get media credentials and access",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-foliage/65">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foliage/10 text-foliage">
                      <ArrowRight className="size-3 stroke-[2.5]" aria-hidden />
                    </span>
                    {item}
                  </div>
                ))}
              </motion.div>

              {/* Terraces photo in left column on desktop */}
              <motion.div
                {...fadeUp}
                className="mt-10 hidden overflow-hidden rounded-2xl shadow-md lg:block"
              >
                <Image
                  src="/terraces-volcano.jpg"
                  alt="View from Casa Conejo main building over terraced gardens with volcano and Pacific coast in background"
                  width={560}
                  height={315}
                  className="w-full object-cover"
                />
              </motion.div>
            </div>

            {/* Right form */}
            <div className="rounded-2xl bg-white p-8 shadow-[0_16px_60px_rgba(44,52,45,0.22),0_4px_16px_rgba(44,52,45,0.10)]">
              {submitted ? (
                <motion.div
                  {...fadeUp}
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
                  {/* Hidden UTM fields */}
                  <input type="hidden" name="utm_source" value={utmSource} />
                  <input type="hidden" name="utm_medium" value={utmMedium} />
                  <input type="hidden" name="utm_campaign" value={utmCampaign} />
                  <input type="hidden" name="referral_source" value={referralSource} />

                  {/* Name row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                  {/* Email */}
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

                  {/* Role selector — visual card grid */}
                  <div>
                    <p className={labelClass} id="role-selector-label">
                      I&apos;m interested as a…{" "}
                      <span className="text-red-500">*</span>
                    </p>
                    {/* Hidden input carries the selected value for form submission */}
                    <input
                      type="hidden"
                      name="request_type"
                      value={selectedRole}
                      required
                    />
                    <div
                      role="radiogroup"
                      aria-labelledby="role-selector-label"
                      aria-required="true"
                      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                    >
                      {roleCardOptions.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.value;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setSelectedRole(role.value)}
                            className={[
                              "flex flex-col items-start gap-2 rounded-xl border-2 p-3.5 text-left transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foliage",
                              isSelected
                                ? "border-foliage bg-foliage text-creme shadow-[0_4px_20px_rgba(44,52,45,0.3)] ring-2 ring-foliage/20 ring-offset-1"
                                : "border-foliage/20 bg-creme/60 text-foliage hover:border-foliage/50 hover:bg-creme hover:shadow-[0_2px_12px_rgba(44,52,45,0.1)]",
                            ].join(" ")}
                          >
                            <Icon
                              className={[
                                "size-5 stroke-[1.75] shrink-0",
                                isSelected ? "text-gold" : "text-foliage/60",
                              ].join(" ")}
                              aria-hidden
                            />
                            <span>
                              <span className="block text-xs font-bold uppercase tracking-wide leading-tight">
                                {role.title}
                              </span>
                              <span
                                className={[
                                  "mt-0.5 block text-[0.65rem] leading-snug",
                                  isSelected ? "text-creme/75" : "text-foliage/50",
                                ].join(" ")}
                              >
                                {role.description}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {/* Validation hint — shown when form is submitted without a role */}
                    {!selectedRole && (
                      <p className="mt-1.5 text-[0.7rem] text-foliage/45">
                        Select the role that best describes you
                      </p>
                    )}
                  </div>

                  {/* ── Role-specific conditional fields ── */}

                  {/* SPEAKER fields */}
                  {selectedRole === "event_speaker" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 rounded-xl border border-foliage/15 bg-foliage/5 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-foliage/60">
                        Speaker Details
                      </p>
                      <div>
                        <label htmlFor="speaker_topics" className={labelClass}>
                          Topic(s) you could teach <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="speaker_topics"
                          name="speaker_topics"
                          type="text"
                          required
                          placeholder="e.g. Fermentation, Soil biology, Water systems…"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="speaker_experience" className={labelClass}>
                          Your background / experience{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <textarea
                          id="speaker_experience"
                          name="speaker_experience"
                          rows={3}
                          placeholder="Tell us about your experience teaching or practicing these skills…"
                          className={`${fieldClass} resize-y`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* SPONSOR fields */}
                  {selectedRole === "sponsor" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 rounded-xl border border-foliage/15 bg-foliage/5 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-foliage/60">
                        Sponsor / Partner Details
                      </p>
                      <div>
                        <label htmlFor="sponsor_company" className={labelClass}>
                          Company or brand name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="sponsor_company"
                          name="sponsor_company"
                          type="text"
                          required
                          placeholder="Your company or brand"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor_website" className={labelClass}>
                          Website{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <input
                          id="sponsor_website"
                          name="sponsor_website"
                          type="url"
                          placeholder="https://yourcompany.com"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="sponsor_budget" className={labelClass}>
                          Budget range / interest level{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <select
                          id="sponsor_budget"
                          name="sponsor_budget"
                          className={`${fieldClass} appearance-none bg-[rgba(242,235,217,0.6)]`}
                        >
                          <option value="">Select a range</option>
                          <option value="under_5k">Under $5,000</option>
                          <option value="5k_15k">$5,000 – $15,000</option>
                          <option value="15k_50k">$15,000 – $50,000</option>
                          <option value="50k_plus">$50,000+</option>
                          <option value="in_kind">In-kind / product partnership</option>
                          <option value="exploring">Still exploring</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* CREATOR fields */}
                  {selectedRole === "creator" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 rounded-xl border border-foliage/15 bg-foliage/5 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-foliage/60">
                        Creator / Media Details
                      </p>
                      <div>
                        <label htmlFor="creator_platform" className={labelClass}>
                          Primary platform(s) <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="creator_platform"
                          name="creator_platform"
                          type="text"
                          required
                          placeholder="e.g. YouTube, X, Instagram, Podcast…"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="creator_audience" className={labelClass}>
                          Approximate audience size{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <select
                          id="creator_audience"
                          name="creator_audience"
                          className={`${fieldClass} appearance-none bg-[rgba(242,235,217,0.6)]`}
                        >
                          <option value="">Select a range</option>
                          <option value="under_10k">Under 10K</option>
                          <option value="10k_50k">10K – 50K</option>
                          <option value="50k_250k">50K – 250K</option>
                          <option value="250k_1m">250K – 1M</option>
                          <option value="1m_plus">1M+</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* PARTNER fields */}
                  {selectedRole === "partner" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 rounded-xl border border-foliage/15 bg-foliage/5 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-foliage/60">
                        Partner Company Details
                      </p>
                      <div>
                        <label htmlFor="partner_org" className={labelClass}>
                          Organization name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="partner_org"
                          name="partner_org"
                          type="text"
                          required
                          placeholder="Your company or organization"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="partner_website" className={labelClass}>
                          Website{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <input
                          id="partner_website"
                          name="partner_website"
                          type="url"
                          placeholder="https://yourcompany.com"
                          className={fieldClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="partner_type" className={labelClass}>
                          Type of partnership interest{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <select
                          id="partner_type"
                          name="partner_type"
                          className={`${fieldClass} appearance-none bg-[rgba(242,235,217,0.6)]`}
                        >
                          <option value="">Select a type</option>
                          <option value="product_alignment">Product / service alignment</option>
                          <option value="co_programming">Co-programming or workshops</option>
                          <option value="distribution">Distribution or retail</option>
                          <option value="investment">Investment or equity</option>
                          <option value="other">Other / exploring</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* VOLUNTEER fields */}
                  {selectedRole === "volunteer" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 rounded-xl border border-foliage/15 bg-foliage/5 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-foliage/60">
                        Volunteer Details
                      </p>
                      <div>
                        <label htmlFor="volunteer_skills" className={labelClass}>
                          Skills you&apos;d bring{" "}
                          <span className="font-normal normal-case tracking-normal text-foliage/40">(optional)</span>
                        </label>
                        <textarea
                          id="volunteer_skills"
                          name="volunteer_skills"
                          rows={2}
                          placeholder="e.g. Construction, cooking, logistics, translation, farming…"
                          className={`${fieldClass} resize-y`}
                        />
                      </div>
                      <div>
                        <label htmlFor="volunteer_local" className={labelClass}>
                          Are you local to El Salvador or traveling?
                        </label>
                        <select
                          id="volunteer_local"
                          name="volunteer_local"
                          className={`${fieldClass} appearance-none bg-[rgba(242,235,217,0.6)]`}
                        >
                          <option value="">Select one</option>
                          <option value="local_sv">Local — I&apos;m in El Salvador</option>
                          <option value="nearby">Nearby — Central America / Mexico</option>
                          <option value="traveling">Traveling from the US or elsewhere</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {/* Location + phone row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="location" className={labelClass}>
                        City / Country{" "}
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
                      <label htmlFor="phone" className={labelClass}>
                        Phone / WhatsApp{" "}
                        <span className="font-normal normal-case tracking-normal text-foliage/40">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+1 555 000 0000"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  {/* Social handle */}
                  <div>
                    <label htmlFor="social_handle" className={labelClass}>
                      Instagram or X handle{" "}
                      <span className="font-normal normal-case tracking-normal text-foliage/40">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="social_handle"
                      name="social_handle"
                      type="text"
                      placeholder="@yourhandle"
                      className={fieldClass}
                    />
                  </div>

                  {/* Why interested */}
                  <div>
                    <label htmlFor="message" className={labelClass}>
                      What interests you most?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us what draws you to this and what you're hoping to get out of it…"
                      className={`${fieldClass} resize-y`}
                    />
                  </div>

                  {/* Anything else */}
                  <div>
                    <label htmlFor="anything_else" className={labelClass}>
                      Anything else we should know?{" "}
                      <span className="font-normal normal-case tracking-normal text-foliage/40">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="anything_else"
                      name="anything_else"
                      rows={2}
                      placeholder="Questions, ideas, context, or anything else…"
                      className={`${fieldClass} resize-y`}
                    />
                  </div>

                  {/* Email preferences */}
                  <fieldset
                    className="rounded-xl border border-foliage/15 p-5"
                    style={{ background: "rgba(44,52,45,0.06)" }}
                  >
                    <legend className="mb-3 font-sans text-xs font-semibold uppercase tracking-wide text-foliage/70">
                      Email preferences
                    </legend>
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
                  </fieldset>

                  {/* Turnstile */}
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
                      <p className="text-center text-xs text-foliage/65">
                        Quick security check · Cloudflare Turnstile
                      </p>
                    </div>
                  ) : (
                    // Turnstile not configured — form submits without security check until keys are added to Vercel
                    <span aria-hidden className="sr-only">Security check not configured</span>
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
                      pending || (!!TURNSTILE_SITE_KEY && !turnstileToken)
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foliage py-4 text-sm font-bold uppercase tracking-[0.12em] text-creme shadow-[0_4px_20px_rgba(44,52,45,0.3)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(44,52,45,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foliage disabled:cursor-not-allowed disabled:opacity-55"
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
                  <p className="text-center font-sans text-xs text-foliage/60">
                    We&apos;ll reach out with dates and details as
                    they&apos;re confirmed.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── About ────────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20" aria-label="About MurphsLife Foundation and Casa Conejo">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#6b6030]">
            About MurphsLife & Casa Conejo
          </p>
          <motion.h2
            {...fadeUp}
            className="font-display mb-12 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold text-foliage"
          >
            We&apos;re not planning this from a conference room.
          </motion.h2>
          <div className="grid items-start gap-12 md:grid-cols-2">
            <motion.div {...fadeUp} className="space-y-4 text-sm leading-relaxed text-foliage/70">
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
            <div className="space-y-4">
              {/* Aerial drone photo */}
              <motion.div {...fadeUp} className="overflow-hidden rounded-2xl shadow-md">
                <Image
                  src="/aerial-site.jpg"
                  alt="Aerial drone view of Casa Conejo 46-acre regenerative campus in El Salvador"
                  width={560}
                  height={315}
                  className="w-full object-cover"
                />
              </motion.div>
              {/* Key differentiators — distinct from the stat strip above the fold */}
              <motion.div
                {...fadeUp}
                className="rounded-xl border-l-4 border-gold bg-creme p-5"
              >
                <p className="font-display text-lg font-bold leading-snug text-foliage">
                  Real land. Real systems. Real outcomes.
                </p>
                <p className="mt-2 font-sans text-xs leading-relaxed text-foliage/60">
                  Casa Conejo is a working campus — not a venue rental. The summit happens on land we actively steward, with teachers who live these systems.
                </p>
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.06 }}
                className="rounded-xl border-l-4 border-foliage bg-foliage/5 p-5"
              >
                <p className="font-display text-lg font-bold leading-snug text-foliage">
                  Government-aligned. Nonprofit-backed.
                </p>
                <p className="mt-2 font-sans text-xs leading-relaxed text-foliage/60">
                  MurphsLife Foundation is a registered 501(c)(3) with an active regenerative development partnership with the Salvadoran government. EIN 85-3332093.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-foliage px-6 py-24 text-center" aria-label="Final call to action">
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
            className="font-sans mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#d4c87a]"
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
            className="mx-auto mb-4 max-w-lg text-sm leading-relaxed text-white/85"
          >
            The summit is coming. Dates and full details will be announced
            soon. If you want to attend, speak, sponsor, partner, or create —
            add your info now and be among the first to know.
          </motion.p>
          {/* Emotional hook from Grok feedback */}
          <motion.p
            {...fadeUp}
            className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-white/70 italic"
          >
            Most people won&apos;t think seriously about food sovereignty until it&apos;s too late.
            This is a chance to get ahead of that curve.
          </motion.p>
          <motion.div {...fadeUp}>
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 rounded-full bg-creme px-10 py-4 text-sm font-bold uppercase tracking-[0.12em] text-foliage shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]"
            >
              Raise Your Hand
              <ArrowRight className="size-4 shrink-0 stroke-[2.5]" aria-hidden />
            </button>
            <p className="mt-5 font-sans text-xs text-white/45">
              Dates and details coming soon. We&apos;ll reach out to everyone
              on the list first.
            </p>
          </motion.div>
        </div>
      </section>

      </main>

      <footer className="bg-[#0f0f0f] px-6 py-8 text-center" aria-label="Site footer">
        <Image
          src={MURPHS_LOGO_WHITE}
          alt="MurphsLife Foundation"
          width={160}
          height={40}
          className="mx-auto mb-4 h-7 w-auto object-contain opacity-60"
        />
        <p className="font-sans text-xs text-white/60">
          MurphsLife Foundation · 501(c)(3) Nonprofit · EIN 85-3332093
        </p>
        <p className="mt-2 font-sans text-xs text-white/50">
          El Salvador & United States
        </p>
        <p className="mx-auto mt-4 max-w-md font-sans text-xs leading-relaxed text-white/55">
          The Regenerative Homestead Sovereignty Summit at Casa Conejo. Dates
          and complete program details coming soon. Partnerships and the speaker
          lineup are currently being finalized.
        </p>
        <nav aria-label="Footer links" className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href="https://murphslifefoundation.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-white/55 transition-colors hover:text-white"
          >
            MurphsLife Foundation
          </a>
          <a
            href="https://casaconejo.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-white/55 transition-colors hover:text-white"
          >
            Casa Conejo
          </a>
          <a
            href="/sitemap.xml"
            className="font-sans text-xs text-white/55 transition-colors hover:text-white"
          >
            Sitemap
          </a>
        </nav>
        <p className="mt-6 font-sans text-[0.65rem] text-white/30">
          &copy; {new Date().getFullYear()} MurphsLife Foundation. All rights reserved.
        </p>
      </footer>
    </>
  );
}
