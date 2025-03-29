import { NextResponse } from "next/server"

// This middleware ensures Socket.IO connections work properly with Next.js
export function middleware(request) {
  // For Socket.IO connections
  if (request.nextUrl.pathname.startsWith("/api/socket")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

