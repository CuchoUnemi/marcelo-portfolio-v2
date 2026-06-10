import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isRateLimited, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET() {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Desconocida";

    // Protección Anti-DDoS / Spam
    const rateCheck = isRateLimited(`track:${ip}`, RATE_LIMITS.track);
    if (rateCheck.limited) {
      return NextResponse.json({ success: false, error: "Too Many Requests" }, { status: 429 });
    }

    const userAgent = headersList.get("user-agent") || "";
    const city = headersList.get("x-vercel-ip-city") || null;
    const country = headersList.get("x-vercel-ip-country") || null;

    let deviceType = "Computadora";
    if (/mobile/i.test(userAgent) || /android/i.test(userAgent) || /iphone/i.test(userAgent)) {
      deviceType = "Móvil";
    } else if (/tablet/i.test(userAgent) || /ipad/i.test(userAgent)) {
      deviceType = "Tablet";
    }

    let os = "Desconocido";
    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/mac/i.test(userAgent)) os = "Mac OS";
    else if (/linux/i.test(userAgent)) os = "Linux";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/ios|iphone|ipad/i.test(userAgent)) os = "iOS";

    // Buscar si ya existe la visita
    const existing = await prisma.visitorLog.findFirst({
      where: { ipAddress: ip, deviceType, os }
    });

    if (existing) {
      await prisma.visitorLog.update({
        where: { id: existing.id },
        data: { 
          visitCount: existing.visitCount + 1, 
          lastVisit: new Date(),
          city: city || existing.city,
          country: country || existing.country
        }
      });
    } else {
      await prisma.visitorLog.create({
        data: {
          ipAddress: ip,
          city,
          country,
          deviceType,
          os,
          userAgent: userAgent.substring(0, 255)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error rastreando visita:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
