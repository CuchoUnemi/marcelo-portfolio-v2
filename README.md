# 🚀 Marcelo Romero | Software Engineer & AI Specialist Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

Portafolio web interactivo y de alto rendimiento diseñado con un panel de administración (CMS) personalizado "Zero-Trust" y efectos visuales de vanguardia utilizando Framer Motion y APIs nativas.

## ✨ Características Principales

### 🎨 Experiencia de Usuario (UI/UX)
- **Animaciones Físicas y de Carga:** Pantalla de *Preloader* espectacular simulando una constelación interactiva y red neuronal animada con gravedades y gradientes (Canvas + Framer Motion).
- **Dark Mode Nativo:** Diseño premium enfocado en modo oscuro con acentos de neón vibrantes, texturas *glassmorphism* y desenfoques (blur).
- **Visor de Documentos In-App:** Visualizador de PDFs (Certificados y CV) integrado directamente en el navegador mediante un *Modal global* interactivo.

### 🛡️ Ciberseguridad & DevSecOps
- **Zero-Trust Admin Panel:** CMS protegido por Middlewares Edge de Next.js. Las rutas de API (`/api/admin/*`) están aseguradas y validadas contra intentos de intrusión.
- **Defensas Anti-DDoS y Spam:** Implementación de Rate Limiting en memoria para detener ataques de fuerza bruta en los inicios de sesión, envíos de formulario de contacto, y *crawlers* de analítica.
- **Sanitización de Archivos:** El endpoint de subida de archivos previene *Unrestricted File Upload* admitiendo estrictamente formatos permitidos (`.pdf`, `.png`, etc.) y auto-gestionando la base de datos para no dejar *blobs huérfanos*.

### 🏗️ Arquitectura y Almacenamiento
- **Base de Datos (Neon DB):** Modelado estructurado a través de Prisma ORM para una gestión perfecta de habilidades, experiencias, certificados y control de visitas.
- **Storage Cloud (Vercel Blob):** Gestión automatizada en la nube con *Random Suffixes* y ciclo de vida síncrono.
- **Autenticación (NextAuth):** Implementación sólida de Credentials y Google Providers, enlazando los perfiles directamente a los administradores autorizados de la BD.

---

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion.
- **Backend:** Next.js API Routes, Zod (Validaciones).
- **Base de Datos:** PostgresSQL (Neon), Prisma ORM.
- **Storage:** @vercel/blob.
- **Seguridad:** bcryptjs, NextAuth (JWT).

---

## 🚀 Instalación y Despliegue Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd portfolio-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**
   Crea un archivo `.env` en la raíz del proyecto y agrega tus claves (puedes usar `.env.example` si lo configuraste):
   ```env
   # Database (Neon PostgreSQL)
   DATABASE_URL="postgresql://user:pass@host/db"
   
   # NextAuth
   NEXTAUTH_SECRET="tu-super-secreto-seguro"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth (Opcional)
   GOOGLE_CLIENT_ID="tu-client-id"
   GOOGLE_CLIENT_SECRET="tu-client-secret"

   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_aqui"
   ```

4. **Poblar la Base de Datos (Seed)**
   Antes de arrancar, genera el cliente de Prisma y ejecuta el seed para crear tu usuario administrador:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Iniciar Servidor de Desarrollo**
   ```bash
   npm run dev
   ```
   > 🌐 Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

---

## 🛡️ Panel de Administración

Para acceder al CMS del portafolio (crear habilidades, subir PDFs, editar la biografía), navega a:
**[http://localhost:3000/admin](http://localhost:3000/admin)**

*(Inicia sesión con las credenciales que se generan por defecto en tu script de seed de Prisma o mediante tu cuenta autorizada de Google).*

---

✒️ Diseñado y construido con obsesión al detalle por **Marcelo Romero**.
