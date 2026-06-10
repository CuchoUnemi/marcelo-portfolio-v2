// ============================================
// API ROUTE: /api/contact
// ============================================
// Recibe mensajes del formulario de contacto,
// los valida con Zod, aplica Rate Limiting
// y los guarda en la BD.
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactMessageSchema } from "@/lib/validations";
import { isRateLimited, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limiting por IP (anti spam)
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rateCheck = isRateLimited(`contact:${ip}`, RATE_LIMITS.contact);

  if (rateCheck.limited) {
    return NextResponse.json(
      {
        error: "Has enviado demasiados mensajes. Intenta de nuevo más tarde.",
        retryAfter: Math.ceil(rateCheck.resetIn / 1000),
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Validación estricta con Zod
    const parsed = ContactMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Guardar en la base de datos
    await prisma.contactMessage.create({
      data: parsed.data,
    });

    return NextResponse.json({ message: "Mensaje enviado correctamente" }, { status: 201 });
  } catch (error) {
    console.error("Error en /api/contact:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
