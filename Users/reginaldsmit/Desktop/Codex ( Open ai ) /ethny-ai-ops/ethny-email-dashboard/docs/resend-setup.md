# Resend setup

1. Create a free Resend account at https://resend.com.
2. Create an API key from the Resend dashboard.
3. Add the key to your Vercel environment variables as RESEND_API_KEY.
4. Set RESEND_FROM_EMAIL to a verified sender address, for example `Ethny <onboarding@resend.dev>`.
5. Set RESEND_TEST_EMAIL to the address that should receive test sends.

The dashboard will use these values at runtime and never embed secrets directly in the source code.
