function getAdminToken() {
  return (
    process.env.EMAIL_DASHBOARD_ADMIN_TOKEN?.trim() ||
    process.env.EMAIL_DASHBOARD_SEND_TOKEN?.trim() ||
    ""
  );
}

export function isAdminRequestAuthorized(request: Request) {
  const expectedToken = getAdminToken();

  if (!expectedToken) {
    return false;
  }

  const authorization = request.headers.get("authorization")?.trim();
  const headerToken = request.headers.get("x-admin-token")?.trim();

  if (headerToken && headerToken === expectedToken) {
    return true;
  }

  if (!authorization) {
    return false;
  }

  const [scheme, token] = authorization.split(/\s+/, 2);
  return scheme === "Bearer" && token === expectedToken;
}
