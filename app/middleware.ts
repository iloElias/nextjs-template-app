import { NextRequest, NextResponse } from "next/server";

// Only accessible without token
export const PUBLIC_WEB_PATHS = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/recover-token",
  "/auth/reset-password",
];

// Accessible with token but not accessible with authenticated(AUTHENTICATED_KEY)
export const PUBLIC_WEB_AUTH_PATHS = ["/auth/code", "/auth/with"];

export const AUTH_TOKEN_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_token`;
export const AUTHENTICATED_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_authenticated`;
export const AUTH_BROWSER_AGENT_KEY = `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

const publicMatcher = [
  "/img/",
  "/favicon.ico",
  "/api",
  "/static",
  "/robots.txt",
];

const metaMatcher = [
  "/_next/static",
  "/_next/image",
  "/api",
  "/sitemap.xml",
  "/sitemap-index.xml",
];

const log = (request: NextRequest) => {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown IP";
  const method = request.method;
  const path = request.nextUrl.pathname;
  const agent = request.headers.get("user-agent") ?? "unknown agent";
  console.log(`${ip} [${method}] ${path} - ${agent}`);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    metaMatcher.some((path) => pathname.startsWith(path)) ||
    publicMatcher.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  log(request);
  return NextResponse.next();

  const isWebRoute = pathname.startsWith("/web");

  if (!isWebRoute) {
    return NextResponse.next();
  }

  const hasBrowserAgent = request.cookies.has(AUTH_BROWSER_AGENT_KEY);
  const hasToken = request.cookies.has(AUTH_TOKEN_KEY);
  const isAuthenticated = request.cookies.has(AUTHENTICATED_KEY);

  const isPublicWebPath = PUBLIC_WEB_PATHS.includes(pathname);
  const isPublicAuthPath = PUBLIC_WEB_AUTH_PATHS.includes(pathname);

  if (!hasBrowserAgent || !hasToken) {
    if (!isPublicWebPath) {
      return NextResponse.redirect(new URL(PUBLIC_WEB_PATHS[0], request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (!isPublicAuthPath) {
      return NextResponse.redirect(
        new URL(PUBLIC_WEB_AUTH_PATHS[0], request.url)
      );
    }
    return NextResponse.next();
  }

  if (isPublicWebPath || isPublicAuthPath) {
    return NextResponse.redirect(new URL("/web", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
