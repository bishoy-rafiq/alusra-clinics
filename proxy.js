import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // The /admin control panel is not localized. Guard it with Supabase auth.
  if (pathname.startsWith("/admin")) {
    const { supabaseResponse, user } = await updateSession(request);

    const isLoginPage = pathname.startsWith("/admin/login");

    if (!user && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return supabaseResponse;
  }

  // Everything else is public, localized site content.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Match all public paths except static assets, API/webhook routes, etc.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
