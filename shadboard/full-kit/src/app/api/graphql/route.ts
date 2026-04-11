import { ApolloServer } from "@apollo/server";
import { NextRequest, NextResponse } from "next/server";
import { typeDefs } from "@/lib/ecosystra/schema";
import { resolvers, type GqlContext } from "@/lib/ecosystra/resolvers";
import { resolveAuth } from "@/lib/ecosystra/auth";
import { db as prisma } from "@/lib/prisma";

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

async function buildContext(req: NextRequest): Promise<GqlContext> {
  const headers = req.headers;
  const auth = await resolveAuth(headers);
  let prismaUser = null;
  if (auth.email) {
    prismaUser = await prisma.ecoUser.findUnique({
      where: { email: auth.email },
    });
  }
  return { auth, prismaUser };
}

async function handleGraphQL(req: NextRequest): Promise<NextResponse> {
  const server = getServer();

  const contentType = req.headers.get("content-type") || "";
  let body: Record<string, unknown>;

  if (req.method === "GET") {
    const { searchParams } = new URL(req.url);
    body = {
      query: searchParams.get("query") || "",
      variables: searchParams.get("variables")
        ? JSON.parse(searchParams.get("variables")!)
        : undefined,
      operationName: searchParams.get("operationName") || undefined,
    };
  } else {
    body = await req.json();
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
    return NextResponse.json(
      { data, errors },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, x-dev-user-email",
        },
      }
    );
  }

  return NextResponse.json(
    { errors: [{ message: "Streaming not supported" }] },
    { status: 400 }
  );
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
