"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Bebas_Neue } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import { FormEvent, useCallback, useRef, useState } from "react";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const SUBMISSION_BACKGROUND =
  "https://assets.murphslifefoundation.com/blue-bg.jpg";

const MURPHS_LOGO_WHITE =
  "https://assets.murphslifefoundation.com/logo-variations/white-logo.png";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Bebas + letter-spacing used for tagline, headings, and primary actions. */
const bebasTracked = `${bebasNeue.className} font-normal tracking-[0.2em]`;

/** Dark panel Bebas style on the light form card (brand blue). */
const bebasEmphasis = `${bebasTracked} text-murphs-blue`;

/** Light-on-dark headings for the hero column. */
const bebasOnImage = `${bebasTracked} text-white`;

const requestTypeOptions = [
  { value: "", label: "How would you like to plug into the conference?" },
  {
    value: "attendee",
    label:
      "Attendee: I want field schools, pasture walks, and regenerative farming intensives",
  },
  {
    value: "event_speaker",
    label:
      "Speaker or facilitator: I teach soil health, grazing, agroforestry, water, or whole-farm design",
  },
  {
    value: "sponsor",
    label:
      "Sponsor or partner: I want to back a regenerative agriculture convening with real field time",
  },
] as const;

const audiencePaths = [
  {
    title: "Conference guests",
    body: "Come walk pastures, dig soil pits, and swap notes with people who steward land for the long haul. This is a farm conference built around regenerative practice in real fields, not only slide decks.",
  },
  {
    title: "Faculty & demonstrators",
    body: "We’re recruiting mentors for living classrooms: holistic grazing, cover cropping, compost and biology, integrated livestock, silvopasture, and low-input ways to grow nutrient-dense food.",
  },
  {
    title: "Sponsors & allies",
    body: "Help us fund scholarships, field gear, and translation so regenerative farming education travels further. Ideal partners love soil health, farmer networks, and food systems that regenerate rather than extract.",
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export default function SubmissionFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

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
      setError("Please add a short note so we understand what you’re curious about.");
      return;
    }

    if (
      requestType !== "attendee" &&
      requestType !== "event_speaker" &&
      requestType !== "sponsor"
    ) {
      setError("Please choose how you’d like to plug into the conference.");
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
    <section
      id="join"
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: `url("${SUBMISSION_BACKGROUND}")` }}
        aria-hidden
      />
      {/* Readable overlay + vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-murphs-blue/88 via-murphs-blue/72 to-slate-950/75"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,transparent_0%,rgba(15,40,71,0.45)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 md:px-6 md:py-24 lg:py-28">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Narrative column */}
          <motion.div
            className="flex flex-col justify-center lg:col-span-5"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mb-5 flex justify-center md:mb-6 md:justify-start">
              <Image
                src={MURPHS_LOGO_WHITE}
                alt="MurphsLife Foundation"
                width={240}
                height={240}
                className="h-auto w-36 object-contain sm:w-40 md:w-44"
                priority
              />
            </div>
            <p
              className={`${bebasOnImage} text-center text-xs text-white/90 sm:text-left md:text-sm`}
            >
              MurphsLife · Regenerative farming · Food sovereignty
            </p>
            <h1
              className={`${bebasOnImage} mt-3 text-center text-3xl leading-[1.08] sm:text-4xl md:text-left md:text-5xl`}
            >
              A regenerative farming conference on the land
            </h1>
            <p className="mt-4 text-center text-sm leading-relaxed text-white/85 sm:text-base md:text-left md:text-[0.95rem]">
              This convening is anchored in{" "}
              <strong className="font-semibold text-white">
                regenerative agriculture
              </strong>
              : building living soil, cycling nutrients with animals and plants,
              catching rainfall in the landscape, and farming in ways that leave
              land more resilient season after season. Picture sunrise pasture moves,
              soil pits beside cover-crop cocktails, maker studios for pantry goods,
              tasting alleys, and late-night debate about how communities feed
              themselves from healthy ground. Organic systems, small-batch
              products, beekeeping, and regenerative ranching still have a home
              here, but the throughline is stewardship that regenerates.{" "}
              <strong className="font-semibold text-white">
                We’re in a listening season:
              </strong>{" "}
              learning who would travel, who would teach field sessions, and who
              would champion the gathering so the program can grow out of real
              appetite for this work.
            </p>
            <p className="mt-3 text-center text-sm leading-relaxed text-white/80 sm:text-base md:text-left md:text-[0.95rem]">
              If this regenerative farming conference takes shape, we want a sincere
              read on attendance, faculty, and sponsorship before logistics firm
              up.{" "}
              <strong className="font-semibold text-white/95">
                As shareable details emerge, we’ll pass them along thoughtfully.
              </strong>
            </p>

            <div className="mt-8 space-y-3 sm:mt-10">
              {audiencePaths.map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.08 }}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 shadow-lg shadow-black/10 backdrop-blur-md sm:px-5 sm:py-4"
                >
                  <p
                    className={`${bebasNeue.className} text-sm font-normal tracking-[0.14em] text-white`}
                  >
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/85 sm:text-sm">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-center text-xs leading-relaxed text-white/65 md:text-left">
              Tell us the regenerative topics, species, or landscapes you want to
              learn beside. We’ll only use your details to follow up with news that
              matches your note, and you can opt into the mailing lists below.
            </p>
          </motion.div>

          {/* Form panel */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-white/97 shadow-2xl shadow-black/25 ring-1 ring-black/5 backdrop-blur-md sm:rounded-[1.75rem]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-murphs-blue via-sky-600/90 to-murphs-blue" />
              <div className="p-6 sm:p-8 md:p-10">
                <p
                  className={`${bebasEmphasis} text-center text-xs md:text-sm`}
                >
                  Regenerative farming conference
                </p>
                <h2
                  className={`${bebasEmphasis} mt-2 text-center text-xl leading-snug sm:text-2xl md:text-3xl`}
                >
                  Map yourself onto this convening
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-zinc-600">
                  Help us line up curious farmers, graziers, researchers, and allies
                  who want conference craft with muddy boots. Tell us if you learn
                  best beside cattle, compost, nursery rows, or watershed work. We
                  read every note and reach out when there’s news that lines up
                  with what you shared.
                </p>

                {submitted ? (
                  <div
                    className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-murphs-blue/15 bg-murphs-blue/[0.06] px-5 py-10 text-center"
                    role="status"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-murphs-blue text-xl text-white shadow-md"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <p className="max-w-md text-sm leading-relaxed text-zinc-700">
                      Thank you for raising your hand for this regenerative farming
                      conference idea. We’ve got your message, and we’re grateful you
                      took the time. If it makes sense, we may follow up by email
                      with updates that match what you shared. No spam, just what
                      feels useful for your role in the convening.
                    </p>
                  </div>
                ) : (
                  <form
                    className="mt-8 flex flex-col gap-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="first_name"
                          className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                        >
                          First name
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          type="text"
                          required
                          autoComplete="given-name"
                          className="w-full rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none ring-murphs-blue/25 transition-shadow placeholder:text-zinc-400 focus:border-murphs-blue/35 focus:ring-2"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="last_name"
                          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                        >
                          Last name{" "}
                          <span className="font-normal normal-case text-zinc-400">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          type="text"
                          autoComplete="family-name"
                          className="w-full rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none ring-murphs-blue/25 transition-shadow placeholder:text-zinc-400 focus:border-murphs-blue/35 focus:ring-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none ring-murphs-blue/25 transition-shadow placeholder:text-zinc-400 focus:border-murphs-blue/35 focus:ring-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="request_type"
                        className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                      >
                        Your conference role (best fit today)
                      </label>
                      <select
                        id="request_type"
                        name="request_type"
                        required
                        defaultValue=""
                        className="w-full cursor-pointer rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none ring-murphs-blue/25 transition-shadow focus:border-murphs-blue/35 focus:ring-2"
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

                    <div className="space-y-1.5">
                      <label
                        htmlFor="location"
                        className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                      >
                        Location{" "}
                        <span className="font-normal normal-case text-zinc-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        autoComplete="address-level1"
                        placeholder="City, country"
                        className="w-full rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none ring-murphs-blue/25 transition-shadow placeholder:text-zinc-400 focus:border-murphs-blue/35 focus:ring-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="block text-xs font-medium uppercase tracking-wider text-zinc-500"
                      >
                        What should we know for the regenerative conference?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="w-full resize-y rounded-xl border border-zinc-200/90 bg-white px-4 py-3 text-zinc-900 shadow-sm outline-none ring-murphs-blue/25 transition-shadow focus:border-murphs-blue/35 focus:ring-2"
                        placeholder="e.g. grazing topics you live for, soil health labs you’d teach, agroforestry ideas, water in the landscape, livestock class you’d host, sponsor gear, travel radius, or access needs in the field."
                      />
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-4 py-4 sm:px-5">
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Email preferences
                      </p>
                      <label className="flex cursor-pointer gap-3 text-sm leading-snug text-zinc-700">
                        <input
                          name="mailing_list_event"
                          type="checkbox"
                          defaultChecked
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-murphs-blue focus:ring-murphs-blue"
                        />
                        <span>
                          Email me about{" "}
                          <strong className="font-semibold text-zinc-900">
                            this regenerative farming conference
                          </strong>{" "}
                          as plans evolve (field schools, grazing tracks, tickets,
                          hospitality, sponsor briefs). Unsubscribe anytime.
                        </span>
                      </label>
                      <label className="mt-3 flex cursor-pointer gap-3 text-sm leading-snug text-zinc-700">
                        <input
                          name="mailing_list_general"
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-murphs-blue focus:ring-murphs-blue"
                        />
                        <span>
                          Also include me in broader MurphsLife updates and
                          program news{" "}
                          <span className="text-zinc-500">
                            (separate mailing list)
                          </span>
                          .
                        </span>
                      </label>
                    </div>

                    {TURNSTILE_SITE_KEY ? (
                      <div className="flex flex-col items-center gap-2 pt-1">
                        <Turnstile
                          ref={turnstileRef}
                          siteKey={TURNSTILE_SITE_KEY}
                          onSuccess={handleTurnstileSuccess}
                          onExpire={handleTurnstileExpire}
                          onError={handleTurnstileError}
                          options={{ theme: "light", size: "flexible" }}
                        />
                        <p className="text-center text-xs text-zinc-500">
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
                      className={`${bebasTracked} h-14 w-full rounded-full bg-murphs-blue text-base uppercase text-white shadow-lg shadow-murphs-blue/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-murphs-blue/20 disabled:cursor-not-allowed disabled:opacity-55`}
                    >
                      {pending ? "Sending…" : "Share my regenerative ag interest"}
                    </button>
                    <p className="text-center text-xs text-zinc-500">
                      We keep your details private and use them only to respond
                      or send the lists you choose.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
