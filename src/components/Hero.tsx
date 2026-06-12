"use client";
// ============================================
// COMPONENTE: Hero — Tarjeta de Identidad
// ============================================

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface SocialLink {
  id: string;
  label: string;
  url?: string | null;
  iconUrl?: string | null;
}

/* ─── Props ─── */
interface HeroProps {
  fullName: string;
  title?: string | null;
  /** Extracto corto del admin. La bio completa va en otra sección. */
  shortBio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  socialLinks?: SocialLink[];
}

export default function Hero({
  fullName, title, shortBio, avatarUrl,
  location, socialLinks = []
}: HeroProps) {

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const linkTarget = "_blank";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -5, rotateX: -0.5, rotateY: 0.5 }}
      style={{ perspective: 1000 }}
      /* ── Centrada, ancho máximo controlado ── */
      className="w-full max-w-2xl mx-auto flex-shrink-0 z-10"
    >
      <div className="
        w-full rounded-3xl
        bg-card/80 backdrop-blur-md
        border border-primary/20
        shadow-2xl shadow-black/5 dark:shadow-black/50
        hover:border-primary/45
        transition-all duration-400 overflow-hidden
      ">

        {/* ── BLOQUE SUPERIOR: foto izq. + nombre/info der. ── */}
        <div className="flex flex-row items-center gap-6 px-7 pt-6 pb-5">

          {/* FOTO CIRCULAR */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="relative flex-shrink-0"
          >
            <div className="
              w-20 h-20 rounded-full
              border-2 border-[#bc8cff]/40
              bg-[#bc8cff]/10
              overflow-hidden flex items-center justify-center
              shadow-[0_0_20px_rgba(188,140,255,0.22)]
            ">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-[#bc8cff]">{initials}</span>
              )}
            </div>
            {/* Punto de estado online */}
            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 dark:bg-green-400 border-2 border-card shadow-[0_0_6px_rgba(34,197,94,0.7)] dark:shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
          </motion.div>

          {/* NOMBRE + DATOS DE PRESENTACIÓN */}
          <div className="flex flex-col min-w-0 flex-1">

            {/* Nombre grande */}
            <motion.h1
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-tight"
            >
              {fullName}
            </motion.h1>

            {/* Rol con indicador pulsante */}
            {title && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.22 }}
                className="flex items-center gap-2 mt-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#bc8cff] shadow-[0_0_6px_#bc8cff] animate-pulse flex-shrink-0" />
                <span className="text-sm font-bold text-[#bc8cff] tracking-wide truncate">{title}</span>
              </motion.div>
            )}

            {/* Ubicación */}
            {location && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.28 }}
                className="flex items-center gap-1.5 mt-2 text-[11px] text-text-secondary"
              >
                <MapPin size={11} className="text-[#bc8cff]/70 flex-shrink-0" />
                <span>{location}</span>
              </motion.div>
            )}

            {/* Short Bio — extracto parametrizable desde el Admin */}
            {shortBio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="mt-2.5 text-xs text-text-secondary leading-relaxed"
              >
                {shortBio}
              </motion.p>
            )}

          </div>
        </div>

        {/* ── DIVISOR DEGRADADO ── */}
        <div className="mx-7 h-px bg-gradient-to-r from-transparent via-[#bc8cff]/20 to-transparent" />

        {/* ── FILA INFERIOR: Links de Contacto Horizontal Dinámicos ── */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.38 }}
          className="flex flex-wrap items-center justify-center gap-3 px-7 py-4 border-t border-card-border/30 bg-card/10"
        >
          {socialLinks.map((link) => {
            const isClickable = !!link.url;
            const Component = isClickable ? motion.a : motion.div;

            return (
              <Component
                key={link.id}
                href={link.url || undefined}
                target={isClickable ? linkTarget : undefined}
                rel={isClickable && linkTarget === "_blank" ? "noopener noreferrer" : undefined}
                whileHover={isClickable ? "hover" : undefined}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-card-border/40 transition-colors text-sm text-foreground font-medium shadow-sm group ${
                  isClickable ? "hover:bg-primary/10 hover:border-primary/50 cursor-pointer" : "cursor-default"
                }`}
              >
                <motion.div
                  variants={{ hover: { rotate: [-2, 2, -2, 2, 0], scale: 1.1 } }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center flex-shrink-0"
                >
                  {link.iconUrl && (
                    link.iconUrl.startsWith("http") || link.iconUrl.startsWith("/") ? (
                      <img src={link.iconUrl} alt={link.label} className="w-4 h-4 object-contain" />
                    ) : (
                      <i className={`${link.iconUrl} text-lg`} />
                    )
                  )}
                </motion.div>
                <span>{link.label}</span>
              </Component>
            );
          })}
        </motion.div>

      </div>
    </motion.div>
  );
}
