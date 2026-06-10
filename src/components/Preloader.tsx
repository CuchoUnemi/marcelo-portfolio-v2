"use client";

import React, { useState, useEffect, createContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SiPython, SiDjango, SiJavascript, SiHtml5, SiCss, 
  SiReact, SiVuedotjs, SiTailwindcss, SiDocker, SiGoogle,
  SiTensorflow, SiPytorch, SiKeras, SiScikitlearn, SiPandas, 
  SiNumpy, SiOpencv, SiJupyter, SiOpenai, SiHuggingface, 
  SiGithub, SiGit, SiLinux, SiUbuntu, SiPostgresql, 
  SiMongodb, SiRedis, SiNginx, SiNodedotjs, SiTypescript, 
  SiGraphql, SiNextdotjs, SiVercel, SiFigma, SiSupabase, 
  SiPrisma, SiAnthropic
} from "react-icons/si";
import { FaDatabase, FaAws } from "react-icons/fa";

export const PreloaderContext = createContext<boolean>(true);

// ============================================
// COMPONENTE: Constelación Tech
// ============================================
const TECH_ICONS = [
  // Web Core & Frontend
  { id: "js", icon: SiJavascript, color: "#F7DF1E", size: "text-6xl", pos: { top: "65%", left: "12%" }, delay: 1 },
  { id: "html", icon: SiHtml5, color: "#E34F26", size: "text-4xl", pos: { top: "25%", left: "60%" }, delay: 0.2 },
  { id: "css", icon: SiCss, color: "#1572B6", size: "text-3xl", pos: { top: "75%", left: "45%" }, delay: 1.5 },
  { id: "react", icon: SiReact, color: "#61DAFB", size: "text-7xl", pos: { top: "15%", left: "85%" }, delay: 0.8 },
  { id: "vue", icon: SiVuedotjs, color: "#4FC08D", size: "text-5xl", pos: { top: "70%", left: "75%" }, delay: 1.2 },
  { id: "tailwind", icon: SiTailwindcss, color: "#06B6D4", size: "text-4xl", pos: { top: "45%", left: "10%" }, delay: 0.4 },
  { id: "typescript", icon: SiTypescript, color: "#3178C6", size: "text-5xl", pos: { top: "82%", left: "25%" }, delay: 0.7 },
  { id: "nextjs", icon: SiNextdotjs, color: "#ffffff", size: "text-6xl", pos: { top: "35%", left: "50%" }, delay: 0.3 },
  { id: "figma", icon: SiFigma, color: "#F24E1E", size: "text-3xl", pos: { top: "12%", left: "30%" }, delay: 1.6 },
  
  // Backend & Databases
  { id: "python", icon: SiPython, color: "#3776AB", size: "text-5xl", pos: { top: "15%", left: "15%" }, delay: 0 },
  { id: "django", icon: SiDjango, color: "#092E20", size: "text-4xl", pos: { top: "30%", left: "80%" }, delay: 0.5 },
  { id: "nodejs", icon: SiNodedotjs, color: "#339939", size: "text-5xl", pos: { top: "55%", left: "5%" }, delay: 1.1 },
  { id: "graphql", icon: SiGraphql, color: "#E10098", size: "text-4xl", pos: { top: "60%", left: "90%" }, delay: 1.9 },
  { id: "postgresql", icon: SiPostgresql, color: "#4169E1", size: "text-5xl", pos: { top: "40%", left: "20%" }, delay: 0.8 },
  { id: "mongodb", icon: SiMongodb, color: "#47A248", size: "text-4xl", pos: { top: "88%", left: "55%" }, delay: 1.4 },
  { id: "redis", icon: SiRedis, color: "#DC382D", size: "text-3xl", pos: { top: "22%", left: "70%" }, delay: 1.7 },
  { id: "sql", icon: FaDatabase, color: "#336791", size: "text-4xl", pos: { top: "10%", left: "45%" }, delay: 1.1 },
  { id: "supabase", icon: SiSupabase, color: "#3ECF8E", size: "text-5xl", pos: { top: "78%", left: "92%" }, delay: 0.5 },
  { id: "prisma", icon: SiPrisma, color: "#ffffff", size: "text-4xl", pos: { top: "45%", left: "35%" }, delay: 0.9 },

  // AI & Machine Learning
  { id: "tensorflow", icon: SiTensorflow, color: "#FF6F00", size: "text-6xl", pos: { top: "8%", left: "75%" }, delay: 0.2 },
  { id: "pytorch", icon: SiPytorch, color: "#EE4C2C", size: "text-5xl", pos: { top: "85%", left: "35%" }, delay: 1.3 },
  { id: "keras", icon: SiKeras, color: "#D00000", size: "text-4xl", pos: { top: "52%", left: "65%" }, delay: 0.6 },
  { id: "scikit", icon: SiScikitlearn, color: "#F7931E", size: "text-5xl", pos: { top: "68%", left: "28%" }, delay: 1.8 },
  { id: "pandas", icon: SiPandas, color: "#150458", size: "text-4xl", pos: { top: "28%", left: "8%" }, delay: 0.4 },
  { id: "numpy", icon: SiNumpy, color: "#4DABCF", size: "text-5xl", pos: { top: "58%", left: "45%" }, delay: 1.5 },
  { id: "opencv", icon: SiOpencv, color: "#5C3EE8", size: "text-4xl", pos: { top: "92%", left: "15%" }, delay: 0.7 },
  { id: "jupyter", icon: SiJupyter, color: "#F37626", size: "text-3xl", pos: { top: "38%", left: "92%" }, delay: 1.1 },
  { id: "openai", icon: SiOpenai, color: "#ffffff", size: "text-5xl", pos: { top: "48%", left: "78%" }, delay: 0.3 },
  { id: "huggingface", icon: SiHuggingface, color: "#FFD21E", size: "text-6xl", pos: { top: "20%", left: "40%" }, delay: 1.4 },
  { id: "anthropic", icon: SiAnthropic, color: "#D97757", size: "text-4xl", pos: { top: "72%", left: "60%" }, delay: 0.9 },

  // DevOps & Cloud
  { id: "docker", icon: SiDocker, color: "#2496ED", size: "text-6xl", pos: { top: "85%", left: "80%" }, delay: 1.8 },
  { id: "aws", icon: FaAws, color: "#FF9900", size: "text-5xl", pos: { top: "50%", left: "85%" }, delay: 0.6 },
  { id: "github", icon: SiGithub, color: "#ffffff", size: "text-4xl", pos: { top: "5%", left: "5%" }, delay: 1.2 },
  { id: "git", icon: SiGit, color: "#F05032", size: "text-3xl", pos: { top: "95%", left: "50%" }, delay: 0.5 },
  { id: "linux", icon: SiLinux, color: "#FCC624", size: "text-5xl", pos: { top: "18%", left: "95%" }, delay: 1.7 },
  { id: "ubuntu", icon: SiUbuntu, color: "#E95420", size: "text-4xl", pos: { top: "32%", left: "22%" }, delay: 0.8 },
  { id: "nginx", icon: SiNginx, color: "#009639", size: "text-3xl", pos: { top: "62%", left: "8%" }, delay: 1.6 },
  { id: "vercel", icon: SiVercel, color: "#ffffff", size: "text-4xl", pos: { top: "75%", left: "95%" }, delay: 0.4 },
  { id: "google", icon: SiGoogle, color: "#4285F4", size: "text-3xl", pos: { top: "35%", left: "30%" }, delay: 0.9 },
];

const TechConstellation = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {TECH_ICONS.map((tech) => {
        const Icon = tech.icon;
        // Diferentes trayectorias para cada uno
        const randomX = Math.floor(Math.random() * 80) - 40;
        const randomY = Math.floor(Math.random() * 80) - 40;
        
        return (
          <motion.div
            key={tech.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.1, 1],
              x: [0, randomX, 0],
              y: [0, randomY, 0],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10, // Entre 10s y 20s
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: tech.delay
            }}
            className={`absolute ${tech.size}`}
            style={{
              top: tech.pos.top,
              left: tech.pos.left,
              color: tech.color,
              filter: `drop-shadow(0px 0px 15px ${tech.color}) drop-shadow(0px 0px 5px #ffffff50)`,
            }}
          >
            <Icon />
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================
// COMPONENTE: Red Neuronal Neón (Canvas)
// ============================================
const NeuralNetworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Cian, Lila, Rosa Eléctrico, Verde Neón
    const colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#22c55e"]; 
    const numNodes = 70;
    const maxDistance = 160;

    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote en bordes
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset para las líneas
      }
    }

    const nodes: Node[] = [];
    for (let i = 0; i < numNodes; i++) {
      nodes.push(new Node());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Actualizar posiciones
      nodes.forEach((node) => node.update());

      // Dibujar Aristas (Conexiones)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            // Gradiente entre los dos nodos
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, nodes[i].color);
            gradient.addColorStop(1, nodes[j].color);
            
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = 1 - dist / maxDistance; // Desvanecimiento suave
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Dibujar Nodos (encima de las líneas)
      nodes.forEach((node) => node.draw(ctx));

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />;
};

export function Preloader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Bloquear scroll mientras carga
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Tiempo de exhibición del splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            // Animación de salida: Desvanecimiento suave y zoom in
            exit={{ 
              opacity: 0, 
              scale: 1.1, 
              transition: { duration: 0.8, ease: "easeInOut" } 
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#010409] overflow-hidden"
          >
            {/* RED NEURONAL COLORIDA (FONDO ANIMADO) */}
            <NeuralNetworkCanvas />

            {/* CONSTELACIÓN TECH 3D */}
            <TechConstellation />


            {/* CONTENIDO CENTRAL */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-indigo-400 to-pink-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              >
                M R
              </motion.div>
              
              {/* Línea de carga que se dibuja */}
              <div className="w-full h-[2px] bg-foreground/10 mt-6 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut", delay: 0.3 }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                />
              </div>

              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mt-6 text-xs md:text-sm font-mono tracking-[0.3em] text-foreground/50 uppercase"
              >
                Iniciando Sistema
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proveemos el estado de carga al contenido principal para que retrase su animación */}
      <PreloaderContext.Provider value={loading}>
        {children}
      </PreloaderContext.Provider>
    </>
  );
}
