"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Bebas_Neue, Dela_Gothic_One } from "next/font/google";
import { motion } from "framer-motion";
import { FormEvent, useCallback, useRef, useState } from "react";

const delaGothic = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const SUBMISSION_BACKGROUND =
  "https://assets.murphslifefoundation.com/blue-bg.jpg";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const requestTypeOptions = [
  { value: "", label: "How would you like to connect?" },
  {
    value: "attendee",
    label: "Attendee — hear more, join updates, or take part in programs",
  },
  {
    value: "event_speaker",
    label: "Speaker or teacher — teach or demonstrate at a future event",
  },
  {
    value: "sponsor",
    label: "Sponsor or partner — support this work",
  },
] as const;

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
      setError("Please complete the verification below before sending.");
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
    const consent = fd.get("consent") === "on";

    if (!messageBody) {
      setError("Please add a short message so we know how we can help.");
      return;
    }

    if (
      requestType !== "attendee" &&
      requestType !== "event_speaker" &&
      requestType !== "sponsor"
    ) {
      setError("Please choose how you would like to connect.");
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
        mailingList: consent,
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
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16 md:py-24"
      style={{
        backgroundImage: `url("${SUBMISSION_BACKGROUND}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-10"
        >
          <p
            className={`${bebasNeue.className} text-center text-sm font-normal tracking-[0.2em] text-murphs-blue md:text-base`}
          >
            MurphsLife · Food sovereignty
          </p>
          <h2
            className={`${delaGothic.className} mt-3 text-center text-xl font-normal uppercase leading-snug tracking-wide text-murphs-blue sm:text-2xl md:text-3xl`}
          >
            Homestead & farm skills
          </h2>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
            MurphsLife is developing hands-on programming at our botanical farm:
            organic growing, preserving and canning, small-batch products like
            soaps, shampoo, candles, kombucha, sourdough, jerky, essential oils,
            beekeeping, and regenerative cattle ranching—taught on a working
            farm, not from a slide deck.
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
            We are building accessible pricing so more people can participate
            while <strong>supporting local farmers</strong>, with the goal of
            strengthening <strong>food sovereignty</strong> in{" "}
            <strong>El Salvador</strong> and wherever partners show up.
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
            Use this form to <strong>contact our team</strong>, join the mailing
            list for updates, and tell us <strong>how you want to get involved</strong>
            —whether you hope to attend, teach, sponsor, or explore something
            else we should know about.
          </p>
          <p
            className={`${bebasNeue.className} mt-6 text-center text-lg font-normal tracking-[0.12em] text-murphs-blue md:text-xl`}
          >
            Connect with us
          </p>
          <p className="mt-2 text-center text-xs text-zinc-500 sm:text-sm">
            Share your details and a short message. We read every submission and
            will follow up by email when there is news about this project.
          </p>

          {submitted ? (
            <p
              className="mt-8 rounded-xl bg-murphs-blue/10 px-4 py-6 text-center text-sm leading-relaxed text-murphs-blue"
              role="status"
            >
              Thank you. Your message is in our inbox—we will reach out when we
              have updates about programs, timing, or next steps for your
              request.
            </p>
          ) : (
            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="first_name"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    First name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    autoComplete="given-name"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    Last name{" "}
                    <span className="font-normal normal-case">(optional)</span>
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="request_type"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Your connection
                </label>
                <select
                  id="request_type"
                  name="request_type"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
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
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Location{" "}
                  <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level1"
                  placeholder="City, country"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow placeholder:text-zinc-400 focus:ring-2"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                  placeholder="What you want to learn, how you’d like to help, or questions for our team."
                />
              </div>
              <label className="flex cursor-pointer gap-3 text-sm leading-snug text-zinc-700">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-murphs-blue focus:ring-murphs-blue"
                />
                <span>
                  Add me to the mailing list for updates on this project and
                  related MurphsLife programs. You can unsubscribe anytime.
                </span>
              </label>

              {TURNSTILE_SITE_KEY ? (
                <div className="flex flex-col items-center gap-2">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={handleTurnstileSuccess}
                    onExpire={handleTurnstileExpire}
                    onError={handleTurnstileError}
                    options={{ theme: "light", size: "flexible" }}
                  />
                  <p className="text-center text-xs text-zinc-500">
                    Protected by Cloudflare Turnstile
                  </p>
                </div>
              ) : (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-sm text-amber-900">
                  Add{" "}
                  <code className="rounded bg-amber-100/80 px-1">
                    NEXT_PUBLIC_TURNSTILE_SITE_KEY
                  </code>{" "}
                  to your environment to enable verification.
                </p>
              )}

              {error ? (
                <p
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800"
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
                className={`${delaGothic.className} mt-1 h-14 w-full rounded-full bg-murphs-blue text-base uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {pending ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
