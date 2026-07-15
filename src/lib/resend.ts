import { Resend } from "resend";

let resendClient: Resend | null = null;

export interface ResendRuntimeConfig {
  from: string;
  testEmail: string;
  replyTo?: string;
  allowedTestEmails: Set<string>;
  liveSendEnabled: boolean;
  sendToken?: string;
}

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function getResendConfig() {
  const from = process.env.RESEND_FROM_EMAIL;
  const testEmail = process.env.RESEND_TEST_EMAIL;

  if (!from) {
    throw new Error("Missing RESEND_FROM_EMAIL.");
  }

  if (!testEmail) {
    throw new Error("Missing RESEND_TEST_EMAIL.");
  }

  const allowList = new Set<string>(
    [testEmail, ...(process.env.RESEND_ALLOWED_TEST_EMAILS ?? "").split(",")]
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  return {
    from,
    testEmail,
    replyTo: process.env.RESEND_REPLY_TO?.trim() || undefined,
    allowedTestEmails: allowList,
    liveSendEnabled: process.env.EMAIL_DASHBOARD_ENABLE_REAL_SENDS === "true",
    sendToken: process.env.EMAIL_DASHBOARD_SEND_TOKEN?.trim() || undefined,
  } satisfies ResendRuntimeConfig;
}

export function getResendFromEmail() {
  return getResendConfig().from;
}

export function getResendReplyToEmail() {
  return getResendConfig().replyTo;
}

export function assertFromEmailSupportsLiveSends(from: string) {
  if (from.toLowerCase().includes("resend.dev")) {
    throw new Error(
      "RESEND_FROM_EMAIL must use a verified custom domain for real campaign sends.",
    );
  }
}
