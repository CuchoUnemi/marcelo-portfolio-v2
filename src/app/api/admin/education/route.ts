// ============================================
// API ADMIN: /api/admin/education
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { EducationSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const items = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const body = await request.json();
  const parsed = EducationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  const item = await prisma.education.create({
    data: { ...parsed.data, startDate: new Date(parsed.data.startDate), endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null },
  });
  revalidatePath("/");
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  const parsed = EducationSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  const updated = await prisma.education.update({
    where: { id },
    data: { ...parsed.data, startDate: new Date(parsed.data.startDate), endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null },
  });
  revalidatePath("/");
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ message: "Eliminado" });
}
