import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a simplified example. In a real application,
  // you would check for a valid session/token
  const isAuthenticated = true // Replace with actual auth check

  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/dashboard/:path*",
}
