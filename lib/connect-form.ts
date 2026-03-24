/** Stored in `connect_form.form_type` to identify this page’s submissions. */
export const CONNECT_FORM_TYPE = "food_sovereignty_farm";

export function buildConnectFormMessage(
  body: string,
  location: string,
  mailingList: boolean,
): string {
  const parts = [body.trim()];
  if (location.trim()) {
    parts.push(`Location: ${location.trim()}`);
  }
  parts.push(`Email updates (mailing list): ${mailingList ? "yes" : "no"}`);
  return parts.join("\n\n");
}

export function isValidRequestType(
  v: string,
): v is "attendee" | "event_speaker" | "sponsor" {
  return v === "attendee" || v === "event_speaker" || v === "sponsor";
}
