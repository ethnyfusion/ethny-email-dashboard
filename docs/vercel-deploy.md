# Vercel deployment

1. Push the repository and import it in Vercel.
2. Add environment variables:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `RESEND_TEST_EMAIL`
   - `RESEND_REPLY_TO` (optional)
   - `RESEND_ALLOWED_TEST_EMAILS` (optional)
   - `EMAIL_DASHBOARD_ENABLE_REAL_SENDS` (optional, defaults to disabled)
   - `EMAIL_DASHBOARD_SEND_TOKEN` (recommended for production sends)
   - `EMAIL_DASHBOARD_ADMIN_TOKEN` (optional, recommended for `/api/email/send-html-test`)
3. Deploy.

Important:

- Real sends remain blocked until `EMAIL_DASHBOARD_ENABLE_REAL_SENDS=true`.
- In production, set `EMAIL_DASHBOARD_SEND_TOKEN` to protect the send endpoint.
- Set `EMAIL_DASHBOARD_ADMIN_TOKEN` if you want a dedicated token for the HTML test endpoint.
- Every environment variable change requires a new deployment.
