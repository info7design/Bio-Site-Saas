import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "biosite_session";

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has(SESSION_COOKIE);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/painel") && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/entrar" || pathname === "/registrar") && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/painel";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*", "/entrar", "/registrar"],
};
