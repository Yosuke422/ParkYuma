"use server";
 
import { NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from "next/server";
import { checkAuth } from "./utils/sessions";
 
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Protection des routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protection des routes utilisateur
  if (request.nextUrl.pathname.startsWith('/mon-compte')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/mon-compte/:path*']
}