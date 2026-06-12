"use client";
// ============================================
// COMPONENTE: CertificationsSection
// ============================================
// Acento: --color-certifications (#f43f5e) Rosa Eléctrico
// Layout: lista vertical limpia (flex-col)
// Scroll interno de respaldo: max-h-[320px]
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

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        setHasScroll(scrollHeight > clientHeight + 5);
        if (scrollHeight <= clientHeight + 5) {
          setIsAtBottom(true);
        } else {
          const isBottom = scrollHeight - scrollRef.current.scrollTop <= clientHeight + 10;
          setIsAtBottom(isBottom);
        }
      }
    };

    const timer = setTimeout(checkScroll, 100);
    checkScroll();

    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [certifications]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    setIsAtBottom(isBottom);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const linkTarget = isMobile ? "_blank" : "_self";

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

      {/* Lista vertical con scroll de respaldo y gradiente */}
      <div className="relative w-full">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 w-full pb-8"
        >
          {certifications.length === 0 ? (
          <p className="text-xs text-text-secondary italic text-center py-6">
            Agrega tus certificados desde el Panel Admin.
          </p>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center gap-4 p-5 mb-3 border border-transparent rounded-xl hover:bg-[var(--color-certifications)]/10 hover:border-[var(--color-certifications)]/50 transition-colors group relative overflow-hidden"
            >
              {/* Contenedor del Icono (Fijo para que no se aplaste) */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-certifications)]/10 text-[var(--color-certifications)] group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6" />
              </div>

              {/* Contenedor de Textos (Flex-1 para empujar la fecha) */}
              <div className="flex-1 min-w-0">
                  <h4 className="text-base md:text-lg font-bold text-foreground truncate block group-hover:text-[var(--color-certifications)] transition-colors">
                      {cert.title}
                  </h4>
                  <p className="text-sm text-text-secondary truncate block mt-0.5">
                      {cert.issuer}
                  </p>
              </div>

              {/* Fecha y link (Alineada a la derecha, fija) */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-mono text-[var(--color-certifications)]/80">
                      {new Date(cert.date).getUTCFullYear()}
                  </span>
                  {(cert.url || cert.fileUrl) && (
                    <button
                      onClick={() => setSelectedPdf(cert.fileUrl || cert.url!)}
                      className="text-[var(--color-certifications)]/60 hover:text-[var(--color-certifications)] transition-colors pointer-events-auto cursor-pointer"
                      title="Ver certificado"
                    >
                      <ExternalLink size={16} />
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
        </div>
        
        {/* Scroll Indicator */}
        {hasScroll && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card to-transparent pointer-events-none flex items-end justify-center pb-1">
            <ChevronDown size={20} className={`animate-bounce text-[var(--color-certifications)]/60 transition-transform duration-300 ${isAtBottom ? 'rotate-180' : 'rotate-0'}`} />
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
              className="w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-red-500 rounded-full absolute top-4 right-4 z-50 text-white transition-colors"
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
