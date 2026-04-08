import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

type SessionRole = "ADMIN" | "STAFF" | "PARENT";

const DASHBOARD_ROLE_ACCESS: Record<"admin" | "staff" | "parent", SessionRole[]> = {
  admin: ["ADMIN"],
  staff: ["ADMIN", "STAFF"],
  parent: ["ADMIN", "PARENT"],
};

function pickArea(pathname: string): "admin" | "staff" | "parent" | "dashboard" | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/staff")) return "staff";
  if (pathname.startsWith("/parent")) return "parent";
  if (pathname === "/dashboard") return "dashboard";
  return null;
}

export async function middleware(req: NextRequest) {
  const area = pickArea(req.nextUrl.pathname);
  if (!area) return NextResponse.next();

  if (area === "dashboard") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", "/dashboard");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  const role = (token as any).role as SessionRole | undefined;
  if (!role || !DASHBOARD_ROLE_ACCESS[area].includes(role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/parent/:path*", "/dashboard"],
};

