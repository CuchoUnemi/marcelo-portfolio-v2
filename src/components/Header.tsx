"use client";
import { User, Briefcase, Code, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "perfil", href: "#perfil", Icon: User },
  { label: "experiencia", href: "#experiencia", Icon: Briefcase },
  { label: "habilidades", href: "#habilidades", Icon: Code },
  { label: "educación", href: "#educacion", Icon: GraduationCap },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("perfil");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 } 
    );

    const sections = NAV_LINKS.map(link => link.href.substring(1));
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(targetId); // Fuerza el estado activo visualmente
    }
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-[800px]">
      <div className="w-full bg-card/60 backdrop-blur-xl border border-primary/25 rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(188,140,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.04)]">
        
        {/* NAV LINKS (Iconos en móvil, Texto en escritorio) */}
        <nav className="flex items-center gap-2 md:gap-1">
          {NAV_LINKS.map(({ label, href, Icon }) => {
            const isActive = activeSection === href.substring(1);
            return (
              <motion.a
                key={label}
                href={href}
                onClick={(e) => handleNavClick(e, href.substring(1))}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`relative flex items-center justify-center p-2 md:px-4 md:py-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "text-primary bg-primary/10" : "text-foreground/60 hover:text-primary hover:bg-primary/5"
                }`}
                title={label}
              >
                <motion.div 
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="md:hidden flex flex-col items-center"
                >
                  <Icon size={18} className={isActive ? "text-primary" : ""} />
                  {isActive && (
                    <motion.div layoutId="activeDotMobile" className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                  )}
                </motion.div>
                <span className="hidden md:block text-xs font-mono tracking-widest relative">
                  ./{label}
                  {isActive && (
                    <motion.div layoutId="activeDotDesktop" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                  )}
                </span>
              </motion.a>
            );
          })}
        </nav>

        {/* THEME TOGGLE (Botón a la derecha) */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

