# Resend setup

1. Create a Resend account at <https://resend.com>.
2. Create an API key and save it as `RESEND_API_KEY`.
3. Configure a verified sender domain and set `RESEND_FROM_EMAIL`.
4. Set `RESEND_TEST_EMAIL` for test sends.
5. Optional: set `RESEND_REPLY_TO`.
6. Optional: set `RESEND_ALLOWED_TEST_EMAILS` (comma-separated list) to authorize extra test addresses.
7. Optional: set `EMAIL_DASHBOARD_ADMIN_TOKEN` to protect `/api/email/send-html-test`.

For real campaign sends:

- Set `EMAIL_DASHBOARD_ENABLE_REAL_SENDS=true`.
- Set `EMAIL_DASHBOARD_SEND_TOKEN` and share it only with authorized operators.
- `RESEND_FROM_EMAIL` should use a verified custom domain (not `resend.dev`).
- If `EMAIL_DASHBOARD_ADMIN_TOKEN` is unset, the HTML test route falls back to `EMAIL_DASHBOARD_SEND_TOKEN`.

If variables are added/changed in Vercel, redeploy to apply them.
