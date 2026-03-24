"use client";

import { Dela_Gothic_One } from "next/font/google";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

const delaGothic = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
});

const SUBMISSION_BACKGROUND =
  "https://assets.murphslifefoundation.com/blue-bg.jpg";

const submissionTypes = [
  { value: "", label: "Select a topic" },
  { value: "media", label: "Media / press" },
  { value: "partnership", label: "Partnership or program" },
  { value: "volunteer", label: "Volunteering" },
  { value: "sponsor", label: "Sponsorship or donation" },
  { value: "other", label: "Other" },
];

export default function SubmissionFormSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="submit"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16 md:py-24"
      style={{
        backgroundImage: `url("${SUBMISSION_BACKGROUND}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur-sm sm:p-10"
        >
          <h2
            className={`${delaGothic.className} text-center text-2xl font-normal uppercase tracking-wide text-murphs-blue sm:text-3xl`}
          >
            Send your submission
          </h2>
          <p className="mt-3 text-center text-sm leading-relaxed text-zinc-600">
            Complete the form below. Our team reviews every message. Connect
            your workflow later via Formspree, Zapier, or your own API.
          </p>

          {submitted ? (
            <p
              className="mt-8 rounded-xl bg-murphs-blue/10 px-4 py-6 text-center text-sm text-murphs-blue"
              role="status"
            >
              Thank you—we have received your submission. Someone from
              MurphsLife Foundation will follow up if your message requires a
              reply.
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
                  htmlFor="topic"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                >
                  Topic
                </label>
                <select
                  id="topic"
                  name="topic"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none ring-murphs-blue/30 transition-shadow focus:ring-2"
                >
                  {submissionTypes.map((opt) => (
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
                  placeholder="Introduce yourself and what you would like us to know."
                />
              </div>
              <button
                type="submit"
                className={`${delaGothic.className} mt-2 h-14 w-full rounded-full bg-murphs-blue text-base uppercase tracking-wide text-white transition-opacity hover:opacity-90`}
              >
                Submit
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
