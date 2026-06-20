"use client";
// ============================================
// COMPONENTE: CertificationsSection
// ============================================
// Diseño: Premium Dark con Scroll Inteligente
// ============================================

import { Award, ExternalLink, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: Date;
  url?: string | null;
  fileUrl?: string | null;
}

interface Props {
  certifications: CertificationItem[];
}

export default function CertificationsSection({ certifications }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const checkScrollState = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      setHasScroll(scrollHeight > clientHeight + 10);
      // Determina si estamos al final (margen de 10px para mayor fluidez UX)
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 10);
    }
  };

  useEffect(() => {
    // Verificación inicial e intento de detectar cambios de tamaño
    checkScrollState();
    const observer = new ResizeObserver(() => checkScrollState());
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [certifications]);

  const handleScroll = () => {
    checkScrollState();
  };

  const handleArrowClick = () => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div 
      whileHover={{ 
        scale: 1.005, 
        boxShadow: "0px 0px 25px color-mix(in srgb, var(--color-certifications) 15%, transparent)",
        borderColor: "var(--color-certifications)" 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="premium-card bg-card border border-card-border p-6 lg:p-8 flex flex-col gap-5 rounded-[32px] relative overflow-hidden"
    >
      {/* Encabezado con acento rosa */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-1 h-5 rounded-full bg-[var(--color-certifications)] shadow-[0_0_8px_var(--color-certifications)]" />
        <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-[var(--color-certifications)]">
          Certificaciones
        </h3>
      </div>

      {/* CONTENEDOR FIJO ANTI-GRAVITY */}
      <div className="relative w-full h-[320px]">
        {/* Lista con Scroll, Custom Scrollbar y Fade Mask Avanzado */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-col gap-4 h-full overflow-y-auto pb-12 pr-3
                     [&::-webkit-scrollbar]:w-1.5 
                     [&::-webkit-scrollbar-track]:bg-transparent 
                     [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full 
                     hover:[&::-webkit-scrollbar-thumb]:bg-foreground/20
                     transition-colors"
          style={{
            // El primer gradiente enmascara el contenido con desvanecimiento.
            // El segundo gradiente sólido previene que la barra de scroll (últimos 8px) desaparezca.
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
          {certifications.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-text-secondary italic">
                Agrega tus certificados desde el Panel Admin.
              </p>
            </div>
          ) : (
            certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                className="group relative flex items-center justify-between p-5 rounded-2xl 
                           bg-card/50 border border-card-border/40 backdrop-blur-md 
                           hover:bg-foreground/[0.03] hover:border-[var(--color-certifications)]/30 
                           transition-all duration-300 shrink-0"
              >
                {/* Efecto de luz (Shine) sutil al hacer hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent z-0 pointer-events-none rounded-2xl" />
                
                <div className="flex items-center gap-4 relative z-10 w-full">
                  {/* Contenedor del Icono */}
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-certifications)]/10 text-[var(--color-certifications)] group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6" />
                  </div>

                  {/* Textos */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <h4 className="text-base md:text-lg font-bold text-foreground group-hover:text-[var(--color-certifications)] transition-colors leading-tight truncate">
                      {cert.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5 leading-snug">
                      <span className="font-medium">{cert.issuer}</span>
                      <span className="w-1 h-1 rounded-full bg-card-border" />
                      <span className="font-mono text-[var(--color-certifications)]/80">
                        {new Date(cert.date).getUTCFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  {(cert.url || cert.fileUrl) && (
                    <button
                      onClick={() => setSelectedPdf(cert.fileUrl || cert.url!)}
                      className="flex-shrink-0 p-2.5 rounded-full bg-foreground/5 text-text-secondary 
                                 opacity-100 hover:bg-[var(--color-certifications)]/20 hover:text-[var(--color-certifications)] transition-all duration-300 pointer-events-auto cursor-pointer"
                      title="Ver certificado"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* INDICADOR DE CONTINUIDAD / SCROLL TO TOP */}
        {hasScroll && certifications.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none z-20 pb-2">
            <motion.button
              onClick={handleArrowClick}
              // Si isAtBottom es true, habilitamos el click y añadimos estilos hover
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

      {/* Visor de PDF Modal con Portal para evadir overflow-hidden */}
      {selectedPdf && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-10">
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-5xl h-[85vh] bg-card rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-card-border mt-auto md:mt-0"
          >
            <button 
              onClick={() => setSelectedPdf(null)}
              className="w-12 h-12 flex items-center justify-center bg-foreground/10 hover:bg-red-500 rounded-full absolute top-4 right-4 z-50 text-foreground hover:text-white transition-colors"
              title="Cerrar (X)"
            >
              <X size={24} />
            </button>
            <div className="hidden md:flex justify-between items-center p-3 bg-card border-b border-card-border/50">
              <h3 className="text-sm font-bold text-foreground px-2">Visualizador de Certificado</h3>
            </div>
            <iframe src={selectedPdf} className="w-full grow border-0 bg-white" />
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
