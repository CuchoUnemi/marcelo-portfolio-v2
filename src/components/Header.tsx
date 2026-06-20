"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import PillNav from "./ui/PillNav";
import { User, Briefcase, Code, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";

const NAV_LINKS = [
  { label: "perfil", href: "#perfil", Icon: User },
  { label: "experiencia", href: "#experiencia", Icon: Briefcase },
  { label: "habilidades", href: "#habilidades", Icon: Code },
  { label: "educación", href: "#educacion", Icon: GraduationCap },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("perfil");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const items = NAV_LINKS.map(link => ({
    label: link.label.toUpperCase(),
    href: link.href,
    icon: <link.Icon size={16} />
  }));

  // Evitamos saltos de hidratación con el tema
  if (!mounted) return null;

  const isLight = resolvedTheme === "light";
  
  // Usamos fondo transparente para que herede la "isla" de cristal
  const baseColor = "transparent";
  const pillColor = "transparent";
  const pillTextColor = isLight ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)";
  const hoveredPillTextColor = "#ffffff"; // Texto siempre blanco en hover (por el fondo morado)
  const accentColor = isLight ? "#7e22ce" : "#bc8cff";

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-auto bg-card/60 backdrop-blur-xl border border-primary/25 rounded-full px-2 md:px-3 py-1.5 md:py-2 flex items-center gap-2 shadow-[0_0_30px_rgba(188,140,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.04)] pointer-events-auto">
        
        {/* NAV LINKS usando PillNav */}
        <PillNav
          items={items}
          activeHref={`#${activeSection}`}
          baseColor={baseColor}
          pillColor={pillColor}
          pillTextColor={pillTextColor}
          hoveredPillTextColor={hoveredPillTextColor}
          hoverCircleColor={accentColor}
          activeDotColor={accentColor}
          className="shrink-0"
        />

        {/* THEME TOGGLE */}
        <div className="flex items-center shrink-0 pl-2 md:pl-3 border-l border-primary/20">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
