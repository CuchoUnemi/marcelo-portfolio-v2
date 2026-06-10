import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const visitors = await prisma.visitorLog.findMany({
      orderBy: { lastVisit: "desc" },
    });
    return NextResponse.json(visitors);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener visitantes" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (id) {
      await prisma.visitorLog.delete({ where: { id } });
    } else {
      // Si no hay id, borrar todos
      await prisma.visitorLog.deleteMany();
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar visitante(s)" }, { status: 500 });
  }
}
