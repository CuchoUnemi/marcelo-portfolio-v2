"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode, useEffect, useContext } from "react";
import { PreloaderContext } from "@/components/Preloader";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 } // Reducido para pintura más rápida
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export function StaggerContainer({ children, className = "" }: { children: ReactNode, className?: string }) {
  const isPreloading = useContext(PreloaderContext);

  useEffect(() => {
    // Rastrear la visita sin bloquear la UI
    fetch("/api/track").catch(() => {});
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isPreloading ? "hidden" : "show"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
