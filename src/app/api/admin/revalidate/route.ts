import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

export async function POST() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
