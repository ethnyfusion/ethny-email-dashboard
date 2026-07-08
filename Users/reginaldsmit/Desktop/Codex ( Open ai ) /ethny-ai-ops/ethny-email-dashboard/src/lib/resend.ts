import { Resend } from "resend";

let resendClient: Resend | null = null;

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
  return {
    from: process.env.RESEND_FROM_EMAIL ?? "Ethny <onboarding@resend.dev>",
    testEmail: process.env.RESEND_TEST_EMAIL ?? "hello@ethny.com",
  };
}
