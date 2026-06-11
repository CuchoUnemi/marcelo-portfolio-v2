// ============================================
// VALIDACIONES ZOD - SEGURIDAD DE DATOS
// ============================================
// Cada esquema aquí valida los datos ANTES de
// que lleguen a la base de datos. Si alguien
// intenta inyectar código malicioso o enviar
// datos corruptos, Zod los rechazará
// automáticamente con un mensaje de error claro.
// ============================================

import { z } from "zod";

// --- PROFILE ---
export const ProfileSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  title: z.string().min(2).max(150),
  location: z.string().max(100).optional().nullable(),
  bio: z.string().min(2, "El extracto debe tener al menos 2 caracteres").max(2000),
  aboutMe: z.string().max(5000).optional().nullable().or(z.literal("")),
  avatarUrl: z.string().url().optional().nullable().or(z.literal("")),
});

// --- EXPERIENCE ---
export const ExperienceSchema = z.object({
  company: z.string().min(2).max(100),
  position: z.string().min(2).max(150),
  startDate: z.string().datetime({ message: "Fecha de inicio inválida" }),
  endDate: z.string().datetime().optional().nullable(),
  description: z.string().min(10).max(5000),
  order: z.number().int().min(0).default(0),
});

// --- EDUCATION ---
export const EducationSchema = z.object({
  institution: z.string().min(2).max(150),
  degree: z.string().min(2).max(150),
  fieldOfStudy: z.string().max(100).optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  order: z.number().int().min(0).default(0),
});

// --- SKILL ---
export const SkillSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(50),
  categoryId: z.string().min(1, "La categoría es requerida"),
  level: z.number().int().min(0).max(100).default(80),
  iconUrl: z.string().optional().nullable().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

// --- PROJECT ---
export const ProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  technologies: z.string().min(2).max(500),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  projectUrl: z.string().url().optional().nullable().or(z.literal("")),
  githubUrl: z.string().url().optional().nullable().or(z.literal("")),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

// --- CERTIFICATION ---
export const CertificationSchema = z.object({
  title: z.string().min(2).max(200),
  issuer: z.string().min(2).max(150),
  date: z.string().datetime(),
  url: z.string().url().optional().nullable().or(z.literal("")),
  fileUrl: z.string().url().optional().nullable().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

// --- CONTACT MESSAGE ---
// Eliminado a petición del usuario

// --- ADMIN LOGIN ---
export const AdminLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
