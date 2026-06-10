// ============================================
// API: /api/auth/login
// ============================================
// Autenticación del admin con rate limiting
// y validación Zod.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, setSessionCookie } from "@/lib/auth";
import { AdminLoginSchema } from "@/lib/validations";
import { isRateLimited, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting por IP
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = isRateLimited(`login:${ip}`, RATE_LIMITS.login);

  if (rateCheck.limited) {
    return NextResponse.json(
      {
        error: "Demasiados intentos de login",
        retryAfter: Math.ceil(rateCheck.resetIn / 1000),
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rateCheck.resetIn / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();

    // Validación con Zod
    const parsed = AdminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Buscar usuario admin
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      // Mensaje genérico para no revelar si el email existe
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar contraseña hasheada
    const validPassword = await compare(password, admin.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Crear token JWT y guardarlo en cookie
    const token = await createToken({
      userId: admin.id,
      email: admin.email,
    });
    await setSessionCookie(token);

    // NUNCA devolver la contraseña ni datos sensibles
    return NextResponse.json({
      message: "Login exitoso",
      user: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
