// ============================================
// PÁGINA PRINCIPAL - SERVER COMPONENT
// ============================================
// Layout libre con scroll vertical natural.
// Centrado en eje, max-w-[1200px], gap generoso.
// ============================================

import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Biography from "@/components/Biography";
import Experience from "@/components/Experience";
import EducationSection from "@/components/EducationSection";
import CertificationsSection from "@/components/CertificationsSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import { StaggerContainer, StaggerItem } from "@/components/PageClientWrapper";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const [profile, experiences, projects, skills, education, certifications, socialLinks] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({
        include: { category: true },
        orderBy: [
          { category: { order: "asc" } },
          { order: "asc" }
        ],
      }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.certification.findMany({ orderBy: { order: "asc" } }),
      prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    ]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#060913] text-white flex items-center justify-center font-mono">
        <div className="text-center p-8 border border-[#bc8cff]/20 rounded-3xl bg-[#101524]/80 backdrop-blur-md">
          <h1 className="text-3xl font-black mb-3 text-[#bc8cff]">⚙️ Configuración Pendiente</h1>
          <p className="text-white/50 text-sm mb-4">Ejecuta el seed para poblar la base de datos:</p>
          <code className="block p-4 rounded-xl bg-[#060913] text-[#00f2ff] text-sm border border-[#30363d]">
            npx prisma db seed
          </code>
        </div>
      </div>
    );
  }

  return (
    // ── CONTENEDOR RAÍZ: scroll libre, fondo espacial ──
    <div className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-300">

      {/* Glows decorativos de fondo dinámicos */}
      <div className="fixed top-0 right-1/3 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px] pointer-events-none z-0 transition-colors" />
      <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-experience/10 rounded-full blur-[140px] pointer-events-none z-0 transition-colors" />

      {/* ── CONTENEDOR MAESTRO CENTRADO ── */}
      <StaggerContainer className="relative z-10 flex flex-col items-center mx-auto max-w-[1200px] px-4 pt-28 pb-24 md:pb-12 gap-8 text-center">

        {/* 1. DYNAMIC ISLAND — Header */}
        <StaggerItem className="w-full flex justify-center">
          <Header />
        </StaggerItem>

        {/* 2. IDENTITY CARD — Hero */}
        <StaggerItem className="w-full">
          <div id="perfil" className="scroll-mt-32">
            <Hero
              fullName={profile.fullName}
              title={profile.title}
              shortBio={profile.bio}
              avatarUrl={profile.avatarUrl}
              location={profile.location}
              socialLinks={socialLinks}
            />
          </div>
        </StaggerItem>

        {/* 3. DOS ALAS SIMÉTRICAS — Bio + Exp | Edu + Cert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">

          {/* ALA IZQUIERDA: Biografía + Experiencia + Proyectos */}
          <div className="flex flex-col gap-6">
            <StaggerItem><Biography aboutMe={profile.aboutMe} /></StaggerItem>
            <StaggerItem>
              <div id="experiencia" className="scroll-mt-32">
                <Experience experiences={experiences} />
              </div>
            </StaggerItem>
            <StaggerItem><ProjectsSection projects={projects} /></StaggerItem>
          </div>

          {/* ALA DERECHA: Educación + Certificaciones */}
          <div className="flex flex-col gap-6">
            <StaggerItem>
              <div id="educacion" className="scroll-mt-32">
                <EducationSection education={education} />
              </div>
            </StaggerItem>
            <StaggerItem><CertificationsSection certifications={certifications} /></StaggerItem>
          </div>
        </div>

        {/* 4. TECH ARSENAL (SkillsSection) */}
        <StaggerItem className="w-full text-center">
          <div id="habilidades" className="w-full text-center scroll-mt-32">
            <div style={{ "--color-skills": "#10b981" } as React.CSSProperties}>
              <SkillsSection skills={skills} />
            </div>
          </div>
        </StaggerItem>

        {/* 5. FOOTER */}
        <footer className="w-full pt-4 border-t border-primary/10 flex justify-center items-center text-[11px] text-text-secondary font-mono tracking-widest">
          <span>
            © {new Date().getFullYear()} &nbsp;·&nbsp;{" "}
            <span className="text-primary/80">{profile.fullName}</span>
            &nbsp;·&nbsp; Desarrollado en Next.js
          </span>
        </footer>

      </StaggerContainer>
    </div>
  );
}
