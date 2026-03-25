/** Stored in `connect_form.form_type` to identify this page's submissions. */
export const CONNECT_FORM_TYPE = "food_sovereignty_farm";

/** Event / food sovereignty portal updates. */
export const CONNECT_FORM_EVENT_MAILING_LIST_ID =
  "26b99ddd-24a7-4bb2-88bd-1bad59f07060";

/** Broader MurphsLife list (optional second opt-in). */
export const CONNECT_FORM_GENERAL_MAILING_LIST_ID =
  "ee628d34-ca6f-4053-bdbf-fea91a9df89d";

export type ValidRequestType =
  | "attendee"
  | "event_speaker"
  | "sponsor"
  | "creator"
  | "volunteer";

export function isValidRequestType(v: string): v is ValidRequestType {
  return (
    v === "attendee" ||
    v === "event_speaker" ||
    v === "sponsor" ||
    v === "creator" ||
    v === "volunteer"
  );
}

export interface ConnectFormMetadataInput {
  location?: string;
  phone?: string;
  socialHandle?: string;
  anythingElse?: string;
  eventMailingList: boolean;
  generalMailingList: boolean;
  // Speaker-specific
  speakerTopics?: string;
  speakerExperience?: string;
  // Sponsor-specific
  sponsorCompany?: string;
  sponsorWebsite?: string;
  sponsorBudget?: string;
  // Creator-specific
  creatorPlatform?: string;
  creatorAudience?: string;
  // UTM / source tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralSource?: string;
}

/** JSON stored in `connect_form.metadata` for this portal. */
export function buildConnectFormMetadata(
  input: ConnectFormMetadataInput,
): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    email_updates_mailing_list: input.eventMailingList,
    general_mailing_list_opt_in: input.generalMailingList,
  };

  // Core optional fields
  if (input.location?.trim()) meta.location = input.location.trim();
  if (input.phone?.trim()) meta.phone = input.phone.trim();
  if (input.socialHandle?.trim()) meta.social_handle = input.socialHandle.trim();
  if (input.anythingElse?.trim()) meta.anything_else = input.anythingElse.trim();

  // Speaker fields
  if (input.speakerTopics?.trim()) meta.speaker_topics = input.speakerTopics.trim();
  if (input.speakerExperience?.trim()) meta.speaker_experience = input.speakerExperience.trim();

  // Sponsor fields
  if (input.sponsorCompany?.trim()) meta.sponsor_company = input.sponsorCompany.trim();
  if (input.sponsorWebsite?.trim()) meta.sponsor_website = input.sponsorWebsite.trim();
  if (input.sponsorBudget?.trim()) meta.sponsor_budget = input.sponsorBudget.trim();

  // Creator fields
  if (input.creatorPlatform?.trim()) meta.creator_platform = input.creatorPlatform.trim();
  if (input.creatorAudience?.trim()) meta.creator_audience = input.creatorAudience.trim();

  // UTM / source tracking
  if (input.utmSource?.trim()) meta.utm_source = input.utmSource.trim();
  if (input.utmMedium?.trim()) meta.utm_medium = input.utmMedium.trim();
  if (input.utmCampaign?.trim()) meta.utm_campaign = input.utmCampaign.trim();
  if (input.referralSource?.trim()) meta.referral_source = input.referralSource.trim();

  return meta;
}
