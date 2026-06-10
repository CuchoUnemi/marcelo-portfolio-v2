"use client";
// ============================================
// COMPONENTE: Biography — Tarjeta de Biografía
// ============================================
// Acento: --color-biography (#bc8cff) Lila Stitch
// ============================================

import { motion } from "framer-motion";

interface BiographyProps {
  aboutMe: string | null | undefined;
}

export default function Biography({ aboutMe }: BiographyProps) {
  return (
    <motion.div 
      whileHover={{ 
        scale: 1.005, 
        boxShadow: "0px 0px 25px color-mix(in srgb, var(--color-primary) 15%, transparent)",
        borderColor: "var(--color-primary)" 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="premium-card bg-card border border-card-border p-6 lg:p-8 flex flex-col gap-5 rounded-[32px] relative overflow-hidden"
    >
      {/* Encabezado con acento lila */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">
          Biografía
        </h3>
      </div>

      {/* Cuerpo de texto */}
      {aboutMe ? (
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="flex flex-col gap-4"
        >
          {aboutMe.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm text-foreground/80 leading-[1.9] tracking-normal text-left"
            >
              {paragraph.trim()}
            </p>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-primary/20 rounded-2xl">
          <p className="text-xs text-text-secondary italic text-center max-w-xs leading-relaxed">
            La biografía completa se configura desde el{" "}
            <span className="text-primary/80 not-italic font-medium">Panel Admin</span>
            {" "}→ Perfil → Biografía Completa.
          </p>
        </div>
      )}
    </motion.div>
  );
}
