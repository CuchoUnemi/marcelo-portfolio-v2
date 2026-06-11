// ============================================
// API ADMIN: /api/admin/skills
// ============================================

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { SkillSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const skills = await prisma.skill.findMany({ 
    include: { category: true },
    orderBy: [
      { category: { order: "asc" } },
      { order: "asc" }
    ]
  });
  return NextResponse.json(skills);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const parsed = SkillSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const skill = await prisma.skill.create({ data: parsed.data });
  return NextResponse.json(skill, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const { id, ...data } = body;

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const parsed = SkillSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await prisma.skill.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ message: "Eliminado" });
}
