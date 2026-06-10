"use client";
// ============================================
// COMPONENTE: AnimateOnScroll
// ============================================
// Wrapper reutilizable que anima cualquier
// sección cuando entra en el viewport del
// usuario al hacer scroll.
// ============================================

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimateOnScroll({ children, className = "", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
