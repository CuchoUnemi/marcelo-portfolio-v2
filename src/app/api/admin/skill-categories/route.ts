// ============================================
// API ADMIN: /api/admin/skill-categories
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const categories = await prisma.skillCategory.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const category = await prisma.skillCategory.create({
    data: {
      name: body.name,
      order: Number(body.order) || 0,
    },
  });

  revalidatePath("/");
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const { id, name, order } = body;

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const updated = await prisma.skillCategory.update({
    where: { id },
    data: {
      name,
      order: Number(order) || 0,
    },
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

  await prisma.skillCategory.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ message: "Eliminado" });
}
