import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  buildConnectFormMetadata,
  CONNECT_FORM_EVENT_MAILING_LIST_ID,
  CONNECT_FORM_GENERAL_MAILING_LIST_ID,
  CONNECT_FORM_TYPE,
  isValidRequestType,
} from "@/lib/connect-form";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server-anon";
import { verifyTurnstileToken } from "@/lib/turnstile";

const MAX_MESSAGE = 10_000;
const MAX_NAME = 200;
const MAX_EMAIL = 320;
const MAX_SHORT = 500;
const MAX_LONG = 2_000;

type Body = {
  turnstileToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  requestType?: string;
  location?: string;
  phone?: string;
  socialHandle?: string;
  messageBody?: string;
  anythingElse?: string;
  /** Event / portal-specific mailing list (default on in UI). */
  mailingListEvent?: boolean;
  /** Broader MurphsLife mailing list (opt-in). */
  mailingListGeneral?: boolean;
  /** Legacy alias for mailingListEvent. */
  mailingList?: boolean;
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
};

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim();
  }
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: Request) {
  let json: Body;
  try {
    json = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const turnstileToken = String(json.turnstileToken ?? "").trim();
  if (!turnstileToken) {
    return NextResponse.json(
      { error: "Please complete the human verification step." },
      { status: 400 },
    );
  }

  const verify = await verifyTurnstileToken(turnstileToken, clientIp(request));
  if (!verify.ok) {
    return NextResponse.json({ error: verify.error }, { status: 400 });
  }

  const firstName = String(json.firstName ?? "").trim().slice(0, MAX_NAME);
  const lastName = String(json.lastName ?? "").trim().slice(0, MAX_NAME);
  const email = String(json.email ?? "").trim().slice(0, MAX_EMAIL);
  const requestType = String(json.requestType ?? "").trim();
  const location = String(json.location ?? "").trim().slice(0, MAX_SHORT);
  const phone = String(json.phone ?? "").trim().slice(0, 50);
  const socialHandle = String(json.socialHandle ?? "").trim().slice(0, 100);
  const messageBody = String(json.messageBody ?? "").trim().slice(0, MAX_MESSAGE);
  const anythingElse = String(json.anythingElse ?? "").trim().slice(0, MAX_LONG);
  const mailingListEvent = Boolean(json.mailingListEvent ?? json.mailingList);
  const mailingListGeneral = Boolean(json.mailingListGeneral);

  // Role-specific fields
  const speakerTopics = String(json.speakerTopics ?? "").trim().slice(0, MAX_SHORT);
  const speakerExperience = String(json.speakerExperience ?? "").trim().slice(0, MAX_LONG);
  const sponsorCompany = String(json.sponsorCompany ?? "").trim().slice(0, MAX_SHORT);
  const sponsorWebsite = String(json.sponsorWebsite ?? "").trim().slice(0, MAX_SHORT);
  const sponsorBudget = String(json.sponsorBudget ?? "").trim().slice(0, 50);
  const creatorPlatform = String(json.creatorPlatform ?? "").trim().slice(0, MAX_SHORT);
  const creatorAudience = String(json.creatorAudience ?? "").trim().slice(0, 50);

  // UTM / source tracking
  const utmSource = String(json.utmSource ?? "").trim().slice(0, 200);
  const utmMedium = String(json.utmMedium ?? "").trim().slice(0, 200);
  const utmCampaign = String(json.utmCampaign ?? "").trim().slice(0, 200);
  const referralSource = String(json.referralSource ?? "").trim().slice(0, 200);

  if (!firstName) {
    return NextResponse.json(
      { error: "First name is required." },
      { status: 400 },
    );
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }
  if (!messageBody) {
    return NextResponse.json(
      { error: "Message cannot be empty." },
      { status: 400 },
    );
  }
  if (!isValidRequestType(requestType)) {
    return NextResponse.json(
      { error: "Please choose how you would like to connect." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerAnonClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Server configuration error." },
      { status: 500 },
    );
  }

  const metadata = buildConnectFormMetadata({
    location,
    phone,
    socialHandle,
    anythingElse,
    eventMailingList: mailingListEvent,
    generalMailingList: mailingListGeneral,
    speakerTopics,
    speakerExperience,
    sponsorCompany,
    sponsorWebsite,
    sponsorBudget,
    creatorPlatform,
    creatorAudience,
    utmSource,
    utmMedium,
    utmCampaign,
    referralSource,
  });

  const { error: insertError } = await supabase.from("connect_form").insert({
    first_name: firstName || null,
    last_name: lastName || null,
    email,
    message: messageBody,
    metadata,
    form_type: CONNECT_FORM_TYPE,
    request_type: requestType,
  });

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message || "Could not save your message." },
      { status: 500 },
    );
  }

  if (mailingListEvent) {
    const syncEvent = await syncMailingListSubscription(supabase, {
      mailingListId: CONNECT_FORM_EVENT_MAILING_LIST_ID,
      email,
      firstName,
      lastName,
    });
    if (syncEvent.error) {
      return NextResponse.json(
        {
          error:
            syncEvent.error ||
            "Could not add you to the event updates mailing list.",
        },
        { status: 500 },
      );
    }
  }

  if (mailingListGeneral) {
    const syncGeneral = await syncMailingListSubscription(supabase, {
      mailingListId: CONNECT_FORM_GENERAL_MAILING_LIST_ID,
      email,
      firstName,
      lastName,
    });
    if (syncGeneral.error) {
      return NextResponse.json(
        {
          error:
            syncGeneral.error ||
            "Could not add you to the general MurphsLife mailing list.",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}

async function syncMailingListSubscription(
  supabase: SupabaseClient,
  args: {
    mailingListId: string;
    email: string;
    firstName: string;
    lastName: string;
  },
): Promise<{ error: string | null }> {
  const { mailingListId, email, firstName, lastName } = args;

  const { data: existing } = await supabase
    .from("mailing_list_subscriptions")
    .select("id")
    .eq("email", email)
    .eq("mailing_list_id", mailingListId)
    .maybeSingle();

  const now = new Date().toISOString();

  if (existing) {
    const { error: updateError } = await supabase
      .from("mailing_list_subscriptions")
      .update({
        status: "subscribed",
        subscribed_at: now,
        unsubscribed_at: null,
        first_name: firstName || null,
        last_name: lastName || null,
      })
      .eq("id", existing.id);

    return { error: updateError?.message ?? null };
  }

  const { error: insertErr } = await supabase
    .from("mailing_list_subscriptions")
    .insert({
      email,
      mailing_list_id: mailingListId,
      first_name: firstName || null,
      last_name: lastName || null,
      people_id: null,
      status: "subscribed",
      subscribed_at: now,
    });

  return { error: insertErr?.message ?? null };
}
