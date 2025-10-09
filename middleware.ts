import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next()
  }
  const token = req.cookies.get("admin_token")?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = `?redirect=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
