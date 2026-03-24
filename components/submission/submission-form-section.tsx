"use client";

import { Bebas_Neue, Dela_Gothic_One } from "next/font/google";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

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

const interestOptions = [
  { value: "", label: "How do you want to take part?" },
  { value: "attend", label: "I want to attend a future workshop or conference" },
  {
    value: "volunteer",
    label: "I'd like to volunteer or help organize",
  },
  {
    value: "farmer-artisan",
    label: "I'm a local farmer, maker, or teacher",
  },
  { value: "sponsor", label: "I'm interested in sponsoring or partnering" },
  { value: "media", label: "Press or media" },
  { value: "share", label: "Just sharing / spreading the word" },
  { value: "other", label: "Something else" },
];

export default function SubmissionFormSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
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
            Homestead skills on our farm
          </h2>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
            What if we hosted a conference at our botanical farm that teaches{" "}
            <strong>you</strong> how to run <strong>your own</strong> homestead?
            Hands-on learning on a real farm—growing organic food, preserving
            and canning, and small-batch crafts like soaps, shampoo, candles,
            kombucha, sourdough, jerky, essential oils, beekeeping, and more.
            We would also teach regenerative cattle ranching, on the ground,
            where it actually happens.
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
            Instead of a typical high ticket price, we are exploring something
            closer to <strong>$50</strong> so more people can take part and
            <strong> support local farmers</strong>—not hundreds of dollars for
            the same depth of training.
          </p>
          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-700 sm:text-base">
            Most people do not feel the urgency of <strong>food sovereignty</strong>{" "}
            until it is late. This is still an idea—we want to see whether there
            is interest in <strong>El Salvador</strong> and beyond for this kind
            of gathering.
          </p>
          <p
            className={`${bebasNeue.className} mt-6 text-center text-lg font-normal tracking-[0.12em] text-murphs-blue md:text-xl`}
          >
            Join the interest list
          </p>
          <p className="mt-2 text-center text-xs text-zinc-500 sm:text-sm">
            Add your email and we will keep you posted if we move forward.
            Share with friends who care about resilient food and local skills.
          </p>

          {submitted ? (
            <p
              className="mt-8 rounded-xl bg-murphs-blue/10 px-4 py-6 text-center text-sm leading-relaxed text-murphs-blue"
              role="status"
            >
              You are on the list. Thank you for raising your hand—when there is
              news about workshops, timing, or how to take part in El Salvador,
              we will reach out by email.
            </p>
          ) : (
            <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                />
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
                  htmlFor="location"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Location <span className="font-normal normal-case">(optional)</span>
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
                  htmlFor="interest"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Your connection to this idea
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                >
                  {interestOptions.map((opt) => (
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
                  htmlFor="comments"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Comments{" "}
                  <span className="font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={4}
                  className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                  placeholder="Skills you’d like to learn, ideas, or how you’d like to help."
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
                  I agree to receive email updates from MurphsLife Foundation
                  about this homestead / food sovereignty initiative and related
                  programs. You can unsubscribe anytime.
                </span>
              </label>
              <button
                type="submit"
                className={`${delaGothic.className} mt-2 h-14 w-full rounded-full bg-murphs-blue text-base uppercase tracking-wide text-white transition-opacity hover:opacity-90`}
              >
                Join the list
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
