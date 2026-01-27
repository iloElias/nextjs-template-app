import {createI18nMiddleware} from "next-international/middleware";
import {NextRequest, NextResponse} from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "./service/i18n";

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
export const AUTHENTICATED_KEY =
  `${process.env.NEXT_PUBLIC_SERVICE_ID}_authenticated`;
export const AUTH_BROWSER_AGENT_KEY =
  `${process.env.NEXT_PUBLIC_SERVICE_ID}_auth_browser_agent`;

const publicMatcher = ["/img/", "/favicon.ico", "/api", "/static", "/robots.txt"];

const metaMatcher = [
  "/_next/static",
  "/_next/image",
  "/api",
  "/sitemap.xml",
  "/sitemap-index.xml",
];

const I18nMiddleware = createI18nMiddleware({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  urlMappingStrategy: "rewriteDefault",
});

const log = (request: NextRequest) => {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown IP";
  const method = request.method;
  const path = request.nextUrl.pathname;
  const agent = request.headers.get("user-agent") ?? "unknown agent";
  console.log(`${ip} [${method}] ${path} - ${agent}`);
};

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (
    metaMatcher.some((path) => pathname.startsWith(path)) ||
    publicMatcher.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  log(request);

  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
