"use client";
// ============================================
// COMPONENTE: EducationSection
// ============================================

import AnimateOnScroll from "./AnimateOnScroll";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: Date;
  endDate: Date | null;
  description?: string | null;
}

interface Props {
  education: EducationItem[];
}

export default function EducationSection({ education }: Props) {
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
  }, [education]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setIsAtBottom(isBottom);
  };

  return (
    <section className="scroll-mt-24 w-full">
      <AnimateOnScroll>
        <motion.div 
          whileHover={{ 
            scale: 1.005, 
            boxShadow: "0px 0px 25px color-mix(in srgb, var(--color-primary) 15%, transparent)",
            borderColor: "var(--color-primary)" 
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="premium-card bg-card border border-card-border p-6 w-full text-left rounded-[32px] relative overflow-hidden"
        >
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-10 h-1 bg-gradient-to-r from-accent to-primary rounded-full" />
            Educación
          </h3>

          <div className="relative w-full">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-2 overflow-x-hidden pb-8 custom-scrollbar"
            >
              {education.map((edu, i) => (
                <AnimateOnScroll key={edu.id} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="p-4 rounded-xl bg-card/40 border border-transparent transition-all duration-300 group relative overflow-hidden hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-primary)_15%,transparent)]"
                  >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                    <div>
                      <h4 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">{edu.degree}</h4>
                      {edu.fieldOfStudy && (
                        <p className="text-xs text-text-secondary/80 font-medium mt-0.5">{edu.fieldOfStudy}</p>
                      )}
                    </div>
                    <span className="text-xs text-text-secondary font-mono whitespace-nowrap mt-1 sm:mt-0">
                      {new Date(edu.startDate).getUTCFullYear()} —{" "}
                      {edu.endDate ? new Date(edu.endDate).getUTCFullYear() : "Presente"}
                    </span>
                  </div>

                  <p className="text-primary font-semibold text-sm mb-1">{edu.institution}</p>

                  {edu.description && (
                    <p className="text-text-secondary leading-snug text-sm">{edu.description}</p>
                  )}
                  </motion.div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Scroll Indicator */}
            {hasScroll && (
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card to-transparent pointer-events-none flex items-end justify-center pb-2">
                <ChevronDown className={`animate-bounce text-primary w-6 h-6 opacity-70 transition-transform duration-300 ${isAtBottom ? 'rotate-180' : 'rotate-0'}`} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimateOnScroll>
    </section>
  );
}
