"use client";
// ============================================
// COMPONENTE: ProjectsSection
// ============================================
// Tarjetas con efecto glassmorphism y soporte
// para imágenes multimedia.
// ============================================

import AnimateOnScroll from "./AnimateOnScroll";
import { Star, Code2, ExternalLink, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  imageUrl?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  featured: boolean;
}

interface Props {
  projects: ProjectItem[];
}

export default function ProjectsSection({ projects }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const linkTarget = isMobile ? "_blank" : "_self";

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
  }, [projects]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setIsAtBottom(isBottom);
  };

  return (
    <section id="proyectos" className="scroll-mt-24 w-full">
      <AnimateOnScroll>
        <motion.div 
          whileHover={{ 
            scale: 1.005, 
            boxShadow: "0px 0px 25px color-mix(in srgb, var(--color-secondary) 15%, transparent)",
            borderColor: "var(--color-secondary)" 
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="premium-card bg-card border border-card-border p-6 w-full text-left rounded-[32px] flex flex-col gap-4 relative overflow-hidden"
        >
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-10 h-1 bg-gradient-to-r from-secondary to-accent rounded-full" />
            Proyectos Destacados
          </h3>

          <div className="relative w-full">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar pb-8"
            >
              {projects.map((project, i) => (
                <AnimateOnScroll key={project.id} delay={i * 0.1}>
                  <motion.article 
                    whileHover={{ x: 6, scale: 1.01 }}
                    className="group relative h-full rounded-xl bg-card border border-card-border overflow-hidden transition-all duration-500 flex flex-col hover:border-secondary hover:bg-secondary/10 hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-secondary)_15%,transparent)]"
                  >
                  {/* Imagen del proyecto (si existe) */}
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden shrink-0 border-b border-card-border/50">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent pointer-events-none" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col gap-4 grow">
                    {/* Badge destacado */}
                    {project.featured && (
                      <span className="self-start px-3 py-1 flex items-center gap-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold border border-accent/20">
                        <Star size={12} fill="currentColor" /> Destacado
                      </span>
                    )}

                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors duration-300 text-foreground">
                      {project.title}
                    </h4>

                    <p className="text-text-secondary leading-relaxed text-sm grow">
                      {project.description}
                    </p>

                    {/* Tecnologías */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(",").map((tech) => (
                        <span
                          key={tech.trim()}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 mt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target={linkTarget}
                          rel={linkTarget === "_blank" ? "noreferrer" : undefined}
                          className="text-sm flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors pointer-events-auto"
                        >
                          <Code2 size={14} /> GitHub
                        </a>
                      )}
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target={linkTarget}
                          rel={linkTarget === "_blank" ? "noreferrer" : undefined}
                          className="text-sm flex items-center gap-1.5 text-text-secondary hover:text-secondary transition-colors pointer-events-auto"
                        >
                          <ExternalLink size={14} /> Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Efecto de brillo al hover interno adicional */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-secondary/10 via-transparent to-transparent" />
                  </motion.article>
              </AnimateOnScroll>
            ))}
            </div>
            
            {/* Scroll Indicator */}
            {hasScroll && (
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card to-transparent pointer-events-none flex items-end justify-center pb-2">
                <ChevronDown className={`animate-bounce text-secondary w-6 h-6 opacity-70 transition-transform duration-300 ${isAtBottom ? 'rotate-180' : 'rotate-0'}`} />
              </div>
            )}
          </div>
        </motion.div>
      </AnimateOnScroll>
    </section>
  );
}
