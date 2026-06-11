// ============================================
// API ADMIN: /api/admin/certifications
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { CertificationSchema } from "@/lib/validations";
import { del } from "@vercel/blob";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const items = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;
  const body = await request.json();
  const parsed = CertificationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  const item = await prisma.certification.create({
    data: { ...parsed.data, date: new Date(parsed.data.date) },
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
  const parsed = CertificationSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  const updated = await prisma.certification.update({
    where: { id },
    data: { ...parsed.data, date: new Date(parsed.data.date) },
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

  // Buscar si tiene un archivo para borrarlo del Storage (Vercel Blob)
  const cert = await prisma.certification.findUnique({ where: { id } });
  if (cert?.fileUrl) {
    try {
      await del(cert.fileUrl);
    } catch (e) {
      console.error("Error al borrar el archivo del Blob:", e);
    }
  }

  await prisma.certification.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ message: "Eliminado" });
}
