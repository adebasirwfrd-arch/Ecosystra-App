import { ApolloServer } from "@apollo/server";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/configs/next-auth";
import { typeDefs } from "@/lib/ecosystra/schema";
import { resolvers, type GqlContext } from "@/lib/ecosystra/resolvers";
import type { AuthState } from "@/lib/ecosystra/auth";
import { resolveAuth } from "@/lib/ecosystra/auth";
import { isSuperUserEmail } from "@/lib/ecosystra/superuser";
import { db as prisma } from "@/lib/prisma";

const GQL_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-dev-user-email",
} as const;

let serverInstance: ApolloServer<GqlContext> | null = null;

function getServer(): ApolloServer<GqlContext> {
  if (!serverInstance) {
    serverInstance = new ApolloServer<GqlContext>({
      typeDefs,
      resolvers,
      introspection: true,
    });
    serverInstance.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();
  }
  return serverInstance;
}

/**
 * Email app and others call `/api/graphql` with `fetch` (same-origin) but often without
 * `Authorization: Bearer …`. Fall back to NextAuth session cookies so the active user matches.
 */
function normalizeSessionEmail(
  email: string | null | undefined
): string | null {
  if (!email) return null;
  const t = email.trim();
  return t ? t.toLowerCase() : null;
}

async function resolveAuthForRequest(req: NextRequest): Promise<AuthState> {
  const headerAuth = await resolveAuth(req.headers);

  if (headerAuth.email) {
    const email = normalizeSessionEmail(headerAuth.email);
    if (!email) return { userId: null, email: null, isSuperUser: false };
    return {
      userId: headerAuth.userId,
      email,
      isSuperUser: isSuperUserEmail(email),
    };
  }

  if (headerAuth.userId) {
    const u = await prisma.user.findUnique({
      where: { id: headerAuth.userId },
      select: { email: true },
    });
    const email = normalizeSessionEmail(u?.email ?? null);
    if (email) {
      return {
        userId: headerAuth.userId,
        email,
        isSuperUser: isSuperUserEmail(email),
      };
    }
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    let email = normalizeSessionEmail(session.user.email ?? null);
    if (!email) {
      const u = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true },
      });
      email = normalizeSessionEmail(u?.email ?? null);
    }
    if (email) {
      return {
        userId: session.user.id,
        email,
        isSuperUser: isSuperUserEmail(email),
      };
    }
  }

  return { userId: null, email: null, isSuperUser: false };
}

async function buildContext(req: NextRequest): Promise<GqlContext> {
  const auth = await resolveAuthForRequest(req);
  let prismaUser = null;
  if (auth.email) {
    prismaUser = await prisma.ecoUser.findFirst({
      where: { email: { equals: auth.email, mode: "insensitive" } },
    });
  }
  return { auth, prismaUser };
}

function toGraphqlErrorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ errors: [{ message }] }, { status, headers: GQL_CORS_HEADERS });
}

async function handleGraphQL(req: NextRequest): Promise<NextResponse> {
  try {
    const server = getServer();

    let body: Record<string, unknown>;

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      const varsRaw = searchParams.get("variables");
      let variables: unknown;
      if (varsRaw) {
        try {
          variables = JSON.parse(varsRaw);
        } catch {
          return toGraphqlErrorResponse("Invalid variables JSON in query string", 400);
        }
      }
      body = {
        query: searchParams.get("query") || "",
        variables,
        operationName: searchParams.get("operationName") || undefined,
      };
    } else {
      try {
        body = (await req.json()) as Record<string, unknown>;
      } catch {
        return toGraphqlErrorResponse("Invalid JSON body", 400);
      }
    }

    const context = await buildContext(req);

    const result = await server.executeOperation(
      {
        query: body.query as string,
        variables: body.variables as Record<string, unknown> | undefined,
        operationName: body.operationName as string | undefined,
      },
      { contextValue: context }
    );

    if (result.body.kind === "single") {
      const { data, errors } = result.body.singleResult;
      return NextResponse.json({ data, errors }, { status: 200, headers: GQL_CORS_HEADERS });
    }

    return NextResponse.json(
      { errors: [{ message: "Streaming not supported" }] },
      { status: 400, headers: GQL_CORS_HEADERS }
    );
  } catch (e) {
    console.error("[api/graphql]", e);
    const detail =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : e instanceof Error
          ? e.message
          : String(e);
    // Always return JSON so clients never see an empty 500 body.
    return NextResponse.json(
      { errors: [{ message: detail }] },
      { status: 200, headers: GQL_CORS_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleGraphQL(req);
}

export async function POST(req: NextRequest) {
  return handleGraphQL(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-dev-user-email",
    },
  });
}
