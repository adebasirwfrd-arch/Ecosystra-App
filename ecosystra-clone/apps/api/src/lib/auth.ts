import * as jose from "jose";
import type { Request } from "express";
import { isSuperUserEmail } from "./superuser";

export type AuthState = {
  /** Prisma user id when resolved */
  userId: string | null;
  email: string | null;
  isSuperUser: boolean;
};

function getHeader(req: Request, name: string): string | undefined {
  const v = req.headers[name.toLowerCase()] ?? req.headers[name];
  if (Array.isArray(v)) return v[0];
  return typeof v === "string" ? v : undefined;
}

/**
 * Resolves identity from NextAuth JWT (Authorization: Bearer) or dev header.
 */
export async function resolveAuth(req: Request): Promise<AuthState> {
  const devEmail = getHeader(req, "x-dev-user-email");
  if (process.env.NODE_ENV !== "production" && devEmail) {
    return {
      userId: null,
      email: devEmail.trim(),
      isSuperUser: isSuperUserEmail(devEmail),
    };
  }

  const auth = getHeader(req, "authorization");
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

export function requireUser(
  auth: AuthState,
  prismaUserId: string | null
): asserts prismaUserId is string {
  if (!prismaUserId) {
    throw new Error("UNAUTHORIZED");
  }
}
