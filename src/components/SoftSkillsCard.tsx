"use client";
// ============================================
// COMPONENTE: SoftSkillsCard
// ============================================
// Diseño: Flex Wrap Tags + Anti-Gravity Scroll
// ============================================

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

export interface SoftSkill {
  id: string;
  name: string;
  order: number;
}

interface SoftSkillsCardProps {
  skills: SoftSkill[];
}

export default function SoftSkillsCard({ skills }: SoftSkillsCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  const checkScrollState = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      setHasScroll(scrollHeight > clientHeight + 10);
      // Tolerancia de 10px para asegurar activación en todos los navegadores
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 10);
    }
  };

  useEffect(() => {
    checkScrollState();
    const observer = new ResizeObserver(() => checkScrollState());
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [skills]);

  const handleScroll = () => {
    checkScrollState();
  };

  const handleArrowClick = () => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.div 
      whileHover={{ 
        scale: 1.005, 
        boxShadow: "0px 0px 25px color-mix(in srgb, var(--color-skills) 15%, transparent)",
        borderColor: "var(--color-skills)" 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="premium-card bg-card border border-card-border p-6 lg:p-8 flex flex-col gap-5 rounded-[32px] relative overflow-hidden"
    >
      {/* Encabezado del Módulo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-1 h-5 rounded-full bg-[var(--color-skills)] shadow-[0_0_8px_var(--color-skills)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--color-skills)] flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--color-skills)]" />
          Habilidades Blandas & Keywords
        </h3>
      </div>

      {/* Contenedor Fijo con Altura Rígida y Scroll Mask */}
      <div className="relative w-full h-[320px]">
        {/* Contenedor Flex Wrap con Custom Scrollbar */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-wrap content-start gap-3 h-full overflow-y-auto pb-12 pr-3
                     [&::-webkit-scrollbar]:w-1.5 
                     [&::-webkit-scrollbar-track]:bg-transparent 
                     [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full 
                     hover:[&::-webkit-scrollbar-thumb]:bg-foreground/20
                     transition-colors"
          style={{
            // Fade-out mask que protege la visibilidad de la barra de scroll (últimos 8px intocables)
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, black, black)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, black, black)',
            WebkitMaskSize: 'calc(100% - 8px) 100%, 8px 100%',
            maskSize: 'calc(100% - 8px) 100%, 8px 100%',
            WebkitMaskPosition: 'left top, right top',
            maskPosition: 'left top, right top',
            WebkitMaskRepeat: 'no-repeat, no-repeat',
            maskRepeat: 'no-repeat, no-repeat',
          }}
        >
          {skills.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs text-text-secondary italic">Sin datos disponibles.</p>
            </div>
          ) : (
            skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                className="group relative flex items-center px-4 py-2 rounded-xl 
                           bg-[var(--color-skills)]/5 border border-[var(--color-skills)]/20 backdrop-blur-md
                           hover:bg-[var(--color-skills)]/15 hover:border-[var(--color-skills)]/50
                           transition-all duration-300 cursor-default overflow-hidden shrink-0"
              >
                {/* Shine Animation Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[var(--color-skills)]/10 to-transparent z-0 pointer-events-none" />
                
                <span className="relative z-10 text-sm font-medium text-foreground group-hover:text-foreground transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            ))
          )}
        </div>

        {/* Flecha Dinámica (Chevron) Inferior */}
        {hasScroll && skills.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none z-20 pb-2">
            <motion.button
              onClick={handleArrowClick}
              className={`p-1.5 rounded-full bg-card backdrop-blur-md border border-card-border shadow-[0_0_15px_rgba(0,0,0,0.1)] text-text-secondary transition-colors ${
                isAtBottom ? "pointer-events-auto cursor-pointer hover:text-foreground hover:bg-foreground/10" : "pointer-events-none"
              }`}
              animate={{ rotate: isAtBottom ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
