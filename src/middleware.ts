import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret })
  const url = req.nextUrl.clone()

  if (!token && url.pathname.startsWith("/admin")) {
    url.pathname = "/api/auth/signin"
    return NextResponse.redirect(url)
  }

  if (token && !token.admin && url.pathname.startsWith("/admin")) {
    url.pathname = "/unauthorized"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}
