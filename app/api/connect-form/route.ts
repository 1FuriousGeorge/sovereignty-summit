import { NextResponse } from "next/server";

import {
  buildConnectFormMessage,
  CONNECT_FORM_TYPE,
  isValidRequestType,
} from "@/lib/connect-form";
import { createSupabaseServerAnonClient } from "@/lib/supabase/server-anon";
import { verifyTurnstileToken } from "@/lib/turnstile";

const MAX_MESSAGE = 10_000;
const MAX_NAME = 200;
const MAX_EMAIL = 320;

type Body = {
  turnstileToken?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  requestType?: string;
  location?: string;
  messageBody?: string;
  mailingList?: boolean;
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
  const location = String(json.location ?? "").trim().slice(0, 500);
  const messageBody = String(json.messageBody ?? "").trim().slice(0, MAX_MESSAGE);
  const mailingList = Boolean(json.mailingList);

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

  const message = buildConnectFormMessage(messageBody, location, mailingList);

  const { error: insertError } = await supabase.from("connect_form").insert({
    first_name: firstName || null,
    last_name: lastName || null,
    email,
    message,
    form_type: CONNECT_FORM_TYPE,
    request_type: requestType,
  });

  if (insertError) {
    return NextResponse.json(
      { error: insertError.message || "Could not save your message." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
