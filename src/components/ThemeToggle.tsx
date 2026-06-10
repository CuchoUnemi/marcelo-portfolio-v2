"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse" />; // Esqueleto seguro

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Alternar tema"
      className="w-8 h-8 rounded-full flex items-center justify-center bg-card border border-card-border text-foreground hover:bg-card-border transition-colors cursor-pointer"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
