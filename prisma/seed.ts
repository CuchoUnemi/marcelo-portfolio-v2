// ============================================
// SEED - Datos iniciales del CV de Marcelo
// ============================================
// Este script inserta tu currículum optimizado
// en la base de datos. Solo necesitas ejecutarlo
// una vez. Luego podrás editar todo desde el admin.
// ============================================

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando datos del CV...");

  // --- PERFIL ---
  await prisma.profile.upsert({
    where: { id: "perfil-marcelo" },
    update: {},
    create: {
      id: "perfil-marcelo",
      fullName: "Marcelo Alberto Romero Jara",
      title: "Desarrollador de Software & Inteligencia Artificial",
      email: "marcelo.romero@example.com",
      phone: null,
      location: "Guayaquil, Ecuador",
      githubUrl: "https://github.com/CuchoUnemi",
      linkedinUrl: null,
      websiteUrl: null,
      bio: "Desarrollador de Software especializado en Inteligencia Artificial (Computer Vision & NLP) y arquitecturas escalables. Apasionado por transformar datos complejos en soluciones tecnológicas prácticas. Poseo experiencia práctica diseñando modelos de Machine Learning, automatizando procesos y desarrollando aplicaciones web integrales aplicando buenas prácticas de ingeniería (Clean Code) y metodologías ágiles.",
      avatarUrl: null,
    },
  });

  // --- EXPERIENCIA ---
  await prisma.experience.createMany({
    data: [
      {
        company: "Universidad Estatal de Milagro (UNEMI)",
        position: "Desarrollador de Proyectos de IA & Software",
        startDate: new Date("2022-05-01"),
        endDate: null,
        description:
          "Lideré y colaboré en el ciclo de vida completo de aplicaciones de software, desde la fase de recolección de requisitos hasta la implementación. Implementé soluciones robustas de Inteligencia Artificial y automatización de procesos web. Fomenté entornos de trabajo colaborativo utilizando metodologías ágiles (Scrum, Kanban) y control de versiones estricto (Git Flow).",
        order: 0,
      },
    ],
    skipDuplicates: true,
  });

  // --- EDUCACIÓN ---
  await prisma.education.createMany({
    data: [
      {
        institution: "Universidad Estatal de Milagro (UNEMI)",
        degree: "Ingeniería en Software",
        fieldOfStudy: "Inteligencia Artificial & Desarrollo de Software",
        startDate: new Date("2021-05-01"),
        endDate: null,
        description: "8vo Semestre - Enfoque en Inteligencia Artificial, Computer Vision y desarrollo de aplicaciones escalables.",
        order: 0,
      },
    ],
    skipDuplicates: true,
  });

  // --- HABILIDADES Y CATEGORÍAS ---
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();

  const catBackend = await prisma.skillCategory.create({ data: { name: "Backend & IA", order: 0 } });
  const catFrontend = await prisma.skillCategory.create({ data: { name: "Frontend & Web", order: 1 } });
  const catCloud = await prisma.skillCategory.create({ data: { name: "Cloud & DevOps", order: 2 } });
  const catMethod = await prisma.skillCategory.create({ data: { name: "Metodologías", order: 3 } });

  await prisma.skill.createMany({
    data: [
      // Backend & IA
      { name: "Python", categoryId: catBackend.id, level: 90, order: 0, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "TensorFlow", categoryId: catBackend.id, level: 85, order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" },
      { name: "Keras", categoryId: catBackend.id, level: 80, order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/keras/keras-original.svg" },
      { name: "OpenCV", categoryId: catBackend.id, level: 85, order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg" },
      { name: "Scikit-learn", categoryId: catBackend.id, level: 80, order: 4, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg" },
      { name: "SQL", categoryId: catBackend.id, level: 75, order: 5, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
      // Frontend & Web
      { name: "JavaScript", categoryId: catFrontend.id, level: 80, order: 0, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
      { name: "React", categoryId: catFrontend.id, level: 70, order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
      { name: "Next.js", categoryId: catFrontend.id, level: 65, order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
      { name: "TailwindCSS", categoryId: catFrontend.id, level: 75, order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "HTML/CSS", categoryId: catFrontend.id, level: 85, order: 4, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
      // Cloud & DevOps
      { name: "AWS", categoryId: catCloud.id, level: 60, order: 0, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "Google Cloud", categoryId: catCloud.id, level: 55, order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" },
      { name: "Git / GitHub", categoryId: catCloud.id, level: 85, order: 2, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
      { name: "Docker", categoryId: catCloud.id, level: 60, order: 3, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      // Metodologías
      { name: "Scrum", categoryId: catMethod.id, level: 80, order: 0, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg" },
      { name: "Kanban", categoryId: catMethod.id, level: 75, order: 1, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trello/trello-plain.svg" },
    ],
    skipDuplicates: true,
  });

  // --- PROYECTOS ---
  await prisma.project.createMany({
    data: [
      {
        title: "Sistema Inteligente de Detección en Hojas de Tomate",
        description:
          "Entrené e implementé un modelo de visión artificial avanzado (EfficientNetB0) utilizando Python, TensorFlow y OpenCV para clasificar enfermedades agrícolas. Diseñé un pipeline de datos completo: desde el preprocesamiento masivo de imágenes hasta la evaluación exhaustiva de métricas de precisión.",
        technologies: "Python, TensorFlow, Keras, OpenCV, EfficientNetB0",
        featured: true,
        order: 0,
      },
      {
        title: "Detección de Dislexia mediante NLP",
        description:
          "Desarrollé un sistema de análisis lingüístico empleando técnicas avanzadas de Procesamiento de Lenguaje Natural (Scikit-learn, Python). Entrené modelos de clasificación automatizada capaces de identificar patrones sintácticos y semánticos asociados a la dislexia en textos escritos.",
        technologies: "Python, Scikit-learn, NLP, Machine Learning",
        featured: true,
        order: 1,
      },
      {
        title: "Automatizaciones de Hogar Inteligente",
        description:
          "Construí un ecosistema domótico interconectado, integrando dispositivos de hardware IoT mediante el consumo de APIs. Orquesté rutinas de control por voz utilizando Google Home, optimizando procesos cotidianos mediante scripts programados.",
        technologies: "IoT, APIs, Google Home, Automatización",
        featured: false,
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  // --- CERTIFICACIONES ---
  await prisma.certification.createMany({
    data: [
      {
        title: "AWS Cloud Practitioner Essentials",
        issuer: "Amazon Web Services (AWS)",
        date: new Date("2024-01-01"),
        order: 0,
      },
      {
        title: "Certificación en Inteligencia Artificial",
        issuer: "UNEMI",
        date: new Date("2024-06-01"),
        order: 1,
      },
    ],
    skipDuplicates: true,
  });

  // --- ADMIN USER ---
  const hashedPassword = await hash("Admin2026!Secure", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@marceloromero.dev" },
    update: {},
    create: {
      email: "admin@marceloromero.dev",
      password: hashedPassword,
      name: "Marcelo Admin",
    },
  });

  console.log("✅ Datos del CV insertados correctamente.");
  console.log("🔐 Admin creado: admin@marceloromero.dev / Admin2026!Secure");
  console.log("   (¡Cambia esta contraseña desde el panel!)");
}

main()
  .catch((e) => {
    console.error("❌ Error al sembrar datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
