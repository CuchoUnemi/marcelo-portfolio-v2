// ============================================
// HELPER: Verificación de admin en API Routes
// ============================================
// Función reutilizable que verifica la sesión
// del admin antes de ejecutar cualquier
// operación CRUD. Si no hay sesión válida,
// retorna un error 401 automáticamente.
// ============================================

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      ),
    };
  }

  return { authorized: true as const, session };
}
