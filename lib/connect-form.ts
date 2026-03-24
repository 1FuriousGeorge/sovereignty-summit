/** Stored in `connect_form.form_type` to identify this page’s submissions. */
export const CONNECT_FORM_TYPE = "food_sovereignty_farm";

/** Event / food sovereignty portal updates. */
export const CONNECT_FORM_EVENT_MAILING_LIST_ID =
  "26b99ddd-24a7-4bb2-88bd-1bad59f07060";

/** Broader MurphsLife list (optional second opt-in). */
export const CONNECT_FORM_GENERAL_MAILING_LIST_ID =
  "ee628d34-ca6f-4053-bdbf-fea91a9df89d";

/** JSON stored in `connect_form.metadata` for this portal. */
export function buildConnectFormMetadata(
  location: string,
  eventMailingList: boolean,
  generalMailingList: boolean,
): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    email_updates_mailing_list: eventMailingList,
    general_mailing_list_opt_in: generalMailingList,
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
