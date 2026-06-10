// ============================================
// LAYOUT PRINCIPAL - SEO Y METADATOS
// ============================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Preloader } from "@/components/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO: Metadatos globales
export const metadata: Metadata = {
  title: "Marcelo Romero | Desarrollador de Software & IA",
  description:
    "Portafolio profesional de Marcelo Alberto Romero Jara. Desarrollador de Software especializado en Inteligencia Artificial, Computer Vision, NLP y arquitecturas escalables.",
  keywords: [
    "Marcelo Romero",
    "Desarrollador Software",
    "Inteligencia Artificial",
    "Computer Vision",
    "NLP",
    "Python",
    "TensorFlow",
    "React",
    "Next.js",
    "Ecuador",
  ],
  authors: [{ name: "Marcelo Alberto Romero Jara" }],
  openGraph: {
    title: "Marcelo Romero | Desarrollador de Software & IA",
    description:
      "Portafolio profesional. Especializado en IA, Computer Vision y desarrollo web moderno.",
    type: "website",
    locale: "es_EC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marcelo Romero | Desarrollador de Software & IA",
    description:
      "Portafolio profesional. Especializado en IA, Computer Vision y desarrollo web moderno.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* FontAwesome CDN para iconos de marcas y UI */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Devicon CDN para iconos de lenguajes/tecnologías */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Preloader>
            {children}
          </Preloader>
        </ThemeProvider>
      </body>
    </html>
  );
}
