"use client";
// ============================================
// COMPONENTE: Experience — Línea de Tiempo
// ============================================
// Acento: --color-experience (#00f2ff) Cian Neón
// Scroll interno de respaldo: max-h-[320px]
// ============================================

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  description: string;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatPeriod(start: string | Date, end?: string | Date | null): string {
  const fmt = (d: string | Date) => {
    const date = new Date(d);
    // getUTCMonth and getUTCFullYear prevent timezone shift hydration mismatches
    return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Presente"}`;
}

export default function Experience({ experiences }: ExperienceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setHasScroll(scrollHeight > clientHeight);
      if (scrollHeight <= clientHeight) {
        setIsAtBottom(true);
      }
    }
  }, [experiences]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setIsAtBottom(isBottom);
  };

  return (
    <motion.div 
      whileHover={{ 
        scale: 1.005, 
        boxShadow: "0px 0px 25px color-mix(in srgb, var(--color-experience) 15%, transparent)",
        borderColor: "var(--color-experience)" 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="premium-card bg-card border border-card-border p-6 lg:p-8 flex flex-col gap-5 rounded-[32px] relative overflow-hidden"
    >
      {/* Encabezado con acento cian */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-1 h-5 rounded-full bg-[var(--color-experience)] shadow-[0_0_8px_var(--color-experience)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--color-experience)]">
          Experiencia Laboral
        </h3>
      </div>

      {/* Timeline con scroll interno de respaldo */}
      <div className="relative w-full">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar pb-8"
        >
        {experiences.length === 0 ? (
          <p className="text-xs text-text-secondary italic text-center py-6">
            Agrega experiencias desde el Panel Admin.
          </p>
        ) : (
          <div className="relative flex flex-col gap-0">
            {/* Línea vertical continua */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[var(--color-experience)] via-[var(--color-experience)]/20 to-transparent" />

            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative pl-7 pb-7 last:pb-0 group">
                {/* Nodo */}
                <div className="
                  absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full
                  bg-background border-2 border-[var(--color-experience)]/50
                  group-hover:border-[var(--color-experience)] group-hover:shadow-[0_0_10px_var(--color-experience)]
                  transition-all duration-300
                ">
                  {idx === 0 && !exp.endDate && (
                    <div className="absolute inset-[2px] rounded-full bg-[var(--color-experience)] animate-pulse" />
                  )}
                </div>

                <motion.div
                  whileHover={{ x: 6, scale: 1.01 }}
                  className="flex flex-col gap-1.5 border border-transparent rounded-xl p-4 relative overflow-hidden transition-all duration-300 -mt-2 -ml-2 hover:border-[var(--color-experience)] hover:bg-[var(--color-experience)]/10 hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-experience)_15%,transparent)]"
                >
                  {/* Puesto + Estado */}
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-[var(--color-experience)] transition-colors duration-200">
                      {exp.position}
                    </h4>
                    <span className={`
                      flex-shrink-0 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider
                      ${exp.endDate
                        ? "border-card-border text-text-secondary"
                        : "border-[var(--color-experience)]/30 text-[var(--color-experience)] bg-[var(--color-experience)]/10"}
                    `}>
                      {exp.endDate ? "Completado" : "● Actual"}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[var(--color-experience)]/80">{exp.company}</p>
                  <p className="text-[10px] font-mono text-text-secondary">
                    {formatPeriod(exp.startDate, exp.endDate)}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">{exp.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        )}
        </div>
        
        {/* Scroll Indicator */}
        {hasScroll && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card to-transparent pointer-events-none flex items-end justify-center pb-2">
            <ChevronDown className={`animate-bounce text-[var(--color-experience)] w-6 h-6 opacity-70 transition-transform duration-300 ${isAtBottom ? 'rotate-180' : 'rotate-0'}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
