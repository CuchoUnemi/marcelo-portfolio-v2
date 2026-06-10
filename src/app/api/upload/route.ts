// ============================================
// API: /api/upload
// ============================================
// Ruta para subir archivos (PDFs, Imágenes)
// usando Vercel Blob. Requiere autenticación.
// ============================================

import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename || !/\.(pdf|png|jpg|jpeg|webp)$/i.test(filename)) {
    return NextResponse.json({ error: "Archivo no permitido" }, { status: 400 });
  }

  // Verificar si hay cuerpo en el request
  if (!request.body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error uploading to blob:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url");

  if (!urlToDelete) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    await del(urlToDelete);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from blob:", error);
    return NextResponse.json(
      { error: "Error deleting file" },
      { status: 500 }
    );
  }
}
