import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { isRateLimited, RATE_LIMITS } from "@/lib/rate-limit"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Anti fuerza bruta: Limitar intentos por IP
        const ip = req?.headers?.["x-forwarded-for"] || "unknown";
        const rateCheck = isRateLimited(`login:${ip}`, RATE_LIMITS.login);
        if (rateCheck.limited) {
          throw new Error(`Demasiados intentos. Bloqueado temporalmente.`);
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }
        
        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email }
        });
        
        if (!admin) {
          throw new Error("Credenciales inválidas");
        }
        
        const isValid = await compare(credentials.password, admin.password);
        if (!isValid) {
          throw new Error("Credenciales inválidas");
        }
        
        return { id: admin.id, email: admin.email, name: admin.name };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }: { user: any, account: any }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        // Solo permitimos ingresar si el correo está registrado en adminUser
        const admin = await prisma.adminUser.findUnique({
          where: { email: user.email },
        });
        return !!admin;
      }
      return true; // Para credentials ya se validó en authorize()
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
