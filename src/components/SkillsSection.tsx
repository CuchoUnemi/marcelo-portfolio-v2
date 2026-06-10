"use client";
// ============================================
// COMPONENTE: SkillsSection
// ============================================

import { motion, AnimatePresence } from "framer-motion";
import AnimateOnScroll from "./AnimateOnScroll";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface SkillCategory {
  id: string;
  name: string;
}

interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  iconUrl?: string | null;
}

interface Props {
  skills: SkillItem[];
}

export default function SkillsSection({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isMobile, setIsMobile] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleTabsScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    handleTabsScroll(); // Verificar estado inicial
    window.addEventListener("resize", handleTabsScroll);
    return () => window.removeEventListener("resize", handleTabsScroll);
  }, []);

  // Detección de dispositivo móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detector Global de Clics (Click Outside)
  useEffect(() => {
    if (!activeSkill) return;

    const handleGlobalClick = (e: MouseEvent) => {
      // Si el clic no fue dentro de un elemento de habilidad, cerramos el porcentaje
      const target = e.target as HTMLElement;
      if (!target.closest('.skill-badge-item')) {
        setActiveSkill(null);
      }
    };

    // setTimeout evita que el clic inicial dispare el evento inmediatamente
    setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 0);
    
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [activeSkill]);

  const grouped = skills.reduce(
    (acc, skill) => {
      const catName = skill.category.name;
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(skill);
      return acc;
    },
    {} as Record<string, SkillItem[]>
  );

  const categories = ["All", ...Object.keys(grouped)];

  return (
    <section className="scroll-mt-24 w-full">
      <AnimateOnScroll>
        <motion.div
          whileHover={{ y: -8, scale: 1.015, boxShadow: '0 0 15px rgba(188,140,255,0.4)' }}
          transition={{ duration: 0.3 }}
          className="premium-card p-4 md:p-5 w-full max-w-3xl mx-auto flex flex-col gap-3 rounded-[32px] hover:border-primary transition-colors overflow-hidden relative"
        >
          <h2 className="text-lg font-bold text-center w-full mb-1">Habilidades</h2>

          {/* Menú de pestañas responsivo (solo móvil) */}
          <div className="relative w-full block md:hidden mb-4">
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--color-bg-card)] to-transparent z-10 flex items-center justify-start pointer-events-none text-[var(--color-primary)]">
                <ChevronLeft className="w-5 h-5 ml-1 animate-pulse" />
              </div>
            )}

            <div 
              ref={tabsRef}
              onScroll={handleTabsScroll}
              className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar w-full justify-start snap-x"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-center shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    activeCategory === cat 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-card border border-card-border text-text-secondary hover:bg-card-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-bg-card)] to-transparent z-10 flex items-center justify-end pointer-events-none text-[var(--color-primary)]">
                <ChevronRight className="w-5 h-5 mr-1 animate-pulse" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
              {Object.entries(grouped).map(([category, categorySkills], catIndex) => {
                // En móvil, filtramos según la pestaña activa
                if (isMobile && activeCategory !== "All" && activeCategory !== category) return null;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={category} 
                    className="bg-card/40 border border-card-border rounded-2xl p-3 w-full"
                  >
                    <h3 className="text-left font-bold text-[var(--color-skills)] text-sm mb-3">
                      {category}
                    </h3>

                    <div className="flex flex-wrap justify-start gap-2">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.id}
                          initial="hidden"
                          whileInView="visible"
                          whileHover="hover"
                          animate={activeSkill === skill.name ? "hover" : "visible"}
                          onClick={() => setActiveSkill(activeSkill === skill.name ? null : skill.name)}
                          whileTap={{ scale: 0.95 }}
                          viewport={{ once: true }}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1, transition: { delay: skillIndex * 0.05 } },
                            hover: { scale: 1.05, y: -2, transition: { type: "spring", stiffness: 400, damping: 10 } }
                          }}
                          className="skill-badge-item relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-card border border-[var(--color-skills)]/20 hover:border-[var(--color-skills)] hover:bg-[var(--color-skills)]/10 transition-colors text-foreground cursor-pointer shadow-sm hover:shadow-md select-none"
                        >
                          {/* Tooltip de Porcentaje Dinámico */}
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 5 },
                              visible: { opacity: 0, y: 5 },
                              hover: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 10 } }
                            }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20"
                          >
                            {skill.level ? `${skill.level}%` : "90%"}
                            {/* Triángulo del tooltip */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-foreground" />
                          </motion.div>

                          {skill.iconUrl && (
                            skill.iconUrl.startsWith("http") || skill.iconUrl.startsWith("/") ? (
                              <img
                                src={skill.iconUrl}
                                alt={`${skill.name} icon`}
                                className="w-3.5 h-3.5 object-contain flex-shrink-0"
                              />
                            ) : (
                              <i className={`${skill.iconUrl} text-sm flex-shrink-0`} />
                            )
                          )}
                          <span className="font-medium">{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimateOnScroll>
    </section>
  );
}
