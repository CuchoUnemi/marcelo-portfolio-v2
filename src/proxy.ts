// ============================================
// MIDDLEWARE - ZERO TRUST
// ============================================
// Este middleware intercepta TODAS las peticiones
// a rutas protegidas (/admin/*) ANTES de que
// lleguen al servidor. Si no hay sesión válida,
// redirige al login automáticamente.
//
// Zero Trust = nunca confiar, siempre verificar.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger todas las rutas /admin excepto /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecuta este middleware
export const config = {
  matcher: ["/admin/:path*"],
};
