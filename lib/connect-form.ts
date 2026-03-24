/** Stored in `connect_form.form_type` to identify this page’s submissions. */
export const CONNECT_FORM_TYPE = "food_sovereignty_farm";

/** MurphsLife food sovereignty portal → `mailing_list_subscriptions.mailing_list_id`. */
export const CONNECT_FORM_MAILING_LIST_ID =
  "26b99ddd-24a7-4bb2-88bd-1bad59f07060";

/** JSON stored in `connect_form.metadata` for this portal. */
export function buildConnectFormMetadata(
  location: string,
  mailingList: boolean,
): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    email_updates_mailing_list: mailingList,
  };
  const loc = location.trim();
  if (loc) {
    meta.location = loc;
  }
  return meta;
}

export function isValidRequestType(
  v: string,
): v is "attendee" | "event_speaker" | "sponsor" {
  return v === "attendee" || v === "event_speaker" || v === "sponsor";
}
