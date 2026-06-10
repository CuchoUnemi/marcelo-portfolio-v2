// ============================================
// API ADMIN: /api/admin/profile
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { ProfileSchema } from "@/lib/validations";

// GET - Obtener perfil
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

// PUT - Actualizar perfil
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const parsed = ProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Normalizar: string vacío → null para campos opcionales
  const data = {
    ...parsed.data,
    aboutMe: parsed.data.aboutMe === "" ? null : (parsed.data.aboutMe ?? null),
    location: parsed.data.location || null,
    avatarUrl: parsed.data.avatarUrl || null,
  };

  try {
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      const created = await prisma.profile.create({ data });
      return NextResponse.json(created, { status: 201 });
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[API /admin/profile PUT] Error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
