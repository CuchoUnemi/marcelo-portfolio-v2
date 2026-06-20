// ============================================
// API ADMIN: /api/admin/soft-skills
// ============================================

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { SoftSkillSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const softSkills = await prisma.softSkill.findMany({ 
    orderBy: [
      { order: "asc" }
    ]
  });
  return NextResponse.json(softSkills);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const parsed = SoftSkillSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const softSkill = await prisma.softSkill.create({ data: parsed.data });
  return NextResponse.json(softSkill, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const parsed = SoftSkillSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await prisma.softSkill.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  await prisma.softSkill.delete({ where: { id } });
  return NextResponse.json({ message: "Eliminado" });
}
