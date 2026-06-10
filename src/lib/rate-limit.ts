// ============================================
// RATE LIMITER - Protección contra saturación
// ============================================
// Limita el número de peticiones que un usuario
// puede hacer por ventana de tiempo. Esto
// previene ataques de fuerza bruta al login
// y DDoS contra las API Routes.
//
// Implementación en memoria (sin Redis).
// Para producción a gran escala, usar Redis.
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 60 segundos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60_000);

interface RateLimitConfig {
  maxRequests: number;     // Máximo de peticiones permitidas
  windowMs: number;        // Ventana de tiempo en milisegundos
}

// Configuraciones predefinidas
export const RATE_LIMITS = {
  // Login: 5 intentos cada 15 minutos (anti fuerza bruta)
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  // API general: 60 peticiones por minuto
  api: { maxRequests: 60, windowMs: 60 * 1000 },
  // Contacto: 3 mensajes cada 10 minutos (anti spam)
  contact: { maxRequests: 3, windowMs: 10 * 60 * 1000 },
  // Track (Visitas): 20 peticiones por minuto (evita DDoS de registros)
  track: { maxRequests: 20, windowMs: 60 * 1000 },
};

/**
 * Verifica si un identificador (IP o email) ha excedido
 * el límite de peticiones. Retorna true si está bloqueado.
 */
export function isRateLimited(
  identifier: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = identifier;

  const entry = rateLimitMap.get(key);

  // Si no hay registro o la ventana expiró, crear uno nuevo
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { limited: false, remaining: config.maxRequests - 1, resetIn: config.windowMs };
  }

  // Incrementar contador
  entry.count++;

  if (entry.count > config.maxRequests) {
    const resetIn = entry.resetTime - now;
    return { limited: true, remaining: 0, resetIn };
  }

  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}
