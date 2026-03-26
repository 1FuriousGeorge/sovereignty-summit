type SiteverifySuccess = {
  success: true;
  challenge_ts?: string;
  hostname?: string;
};

type SiteverifyFailure = {
  success: false;
  "error-codes"?: string[];
};

/**
 * Verifies a Turnstile token with Cloudflare (must run on the server).
 * @see https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyTurnstileToken(
  token: string,
  remoteip: string | undefined,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Bypass validation when keys are not yet configured (temporary mode — add TURNSTILE_SECRET_KEY to Vercel to re-enable)
  if (!secret?.trim()) {
    return { ok: true };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) {
    body.set("remoteip", remoteip);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const data = (await res.json()) as SiteverifySuccess | SiteverifyFailure;

  if (data.success === true) {
    return { ok: true };
  }

  const codes = "error-codes" in data ? data["error-codes"]?.join(", ") : "";
  return {
    ok: false,
    error: codes || "Human verification failed. Please try again.",
  };
}
