import * as jose from "jose";
import { isSuperUserEmail } from "./superuser";

export type AuthState = {
  userId: string | null;
  email: string | null;
  isSuperUser: boolean;
};

/**
 * Resolves identity from NextAuth JWT (Authorization: Bearer) or dev header.
 * Works with Next.js Headers, plain objects, or Express Request objects.
 */
export async function resolveAuth(headers: {
  get?: (name: string) => string | null;
  [key: string]: unknown;
}): Promise<AuthState> {
  const getHeader = (name: string): string | undefined => {
    if (typeof headers.get === "function") {
      return headers.get(name) ?? headers.get(name.toLowerCase()) ?? undefined;
    }
    const v = (headers as Record<string, unknown>)[name.toLowerCase()];
    if (Array.isArray(v)) return v[0];
    return typeof v === "string" ? v : undefined;
  };

  const devEmail = getHeader("x-dev-user-email");
  if (process.env.NODE_ENV !== "production" && devEmail) {
    return {
      userId: null,
      email: devEmail.trim(),
      isSuperUser: isSuperUserEmail(devEmail),
    };
  }

  const auth = getHeader("authorization");
  const token =
    auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : null;
  if (!token) {
    return { userId: null, email: null, isSuperUser: false };
  }

  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    return { userId: null, email: null, isSuperUser: false };
  }

  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    const email =
      (payload.email as string | undefined) ||
      (payload as Record<string, unknown>).email?.toString() ||
      null;
    const userId =
      (payload.sub as string | undefined) ||
      (payload as Record<string, unknown>).userId?.toString() ||
      null;
    return {
      userId: userId || null,
      email,
      isSuperUser: isSuperUserEmail(email),
    };
  } catch {
    return { userId: null, email: null, isSuperUser: false };
  }
}
