// ============================================
// UTILIDADES DE AUTENTICACIÓN - JWT + COOKIES
// ============================================
// Manejo de sesiones del admin mediante JSON
// Web Tokens almacenados en cookies HttpOnly
// (inaccesibles desde JavaScript del navegador,
// lo que previene ataques XSS).
// ============================================

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const COOKIE_NAME = "admin_session";
const TOKEN_EXPIRY = "8h"; // La sesión expira en 8 horas

// Crear un token JWT firmado
export async function createToken(payload: { userId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

// Verificar un token JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}

// Guardar sesión en cookie HttpOnly
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,     // No accesible desde JS del navegador (previene XSS)
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "lax",    // Protección CSRF
    maxAge: 60 * 60 * 8, // 8 horas en segundos
    path: "/",
  });
}

// Obtener la sesión actual
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;
  return verifyToken(token);
}

// Destruir sesión (logout)
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
