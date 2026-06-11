"use client";
// ============================================
// PÁGINA: /admin/login
// ============================================

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/admin" });
  };

  const handleCredentialsLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err?.message || "Error fatal al conectar con NextAuth");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Panel Admin
          </h1>
          <p className="text-foreground/50 mt-2 text-sm">
            Acceso restringido. Ingresa con tu cuenta de Google autorizada.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-foreground/5 bg-foreground/[0.02] backdrop-blur-sm flex flex-col gap-5 items-center w-full">
          {/* Botón de Google */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-medium text-foreground bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50 flex justify-center items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              <path fill="none" d="M1 1h22v22H1z"/>
            </svg>
            {googleLoading ? "Redirigiendo..." : "Continuar con Google"}
          </motion.button>

          <div className="w-full flex items-center gap-4 my-2 opacity-50">
            <div className="flex-1 h-px bg-foreground/20"></div>
            <span className="text-xs uppercase font-semibold">o con email</span>
            <div className="flex-1 h-px bg-foreground/20"></div>
          </div>

          <form onSubmit={handleCredentialsLogin} className="w-full flex flex-col gap-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-foreground/70 mb-1.5 text-left">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={form.email}
                autoComplete="username"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="admin@marceloromero.dev"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground/70 mb-1.5 text-left">
                Contraseña
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={form.password}
                autoComplete="current-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || googleLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 py-3.5 rounded-xl font-medium text-white bg-primary hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/30 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
            </motion.button>
          </form>

          <a href="/" className="text-center text-sm text-foreground/40 hover:text-primary transition-colors mt-2">
            ← Volver al portafolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
