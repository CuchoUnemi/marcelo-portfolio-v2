// ============================================
// API ADMIN: /api/admin/social-links
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { z } from "zod";

const SocialLinkSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "El texto es requerido"),
  url: z.string().nullable().optional(),
  iconUrl: z.string().nullable().optional(),
  order: z.number().default(0),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const links = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const parsed = SocialLinkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const profile = await prisma.profile.findFirst();
  if (!profile) {
    return NextResponse.json({ error: "No hay un perfil creado" }, { status: 400 });
  }

  const created = await prisma.socialLink.create({
    data: {
      ...parsed.data,
      profileId: profile.id,
    },
  });

  revalidateTag("social-links", "max");
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const body = await request.json();
  const parsed = SocialLinkSchema.safeParse(body);

  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json(
      { error: "Datos inválidos o falta el ID", details: !parsed.success ? parsed.error.flatten().fieldErrors : {} },
      { status: 400 }
    );
  }

  const updated = await prisma.socialLink.update({
    where: { id: parsed.data.id },
    data: {
      label: parsed.data.label,
      url: parsed.data.url,
      iconUrl: parsed.data.iconUrl,
      order: parsed.data.order,
    },
  });

  revalidateTag("social-links", "max");
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta el ID" }, { status: 400 });
  }

  await prisma.socialLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
