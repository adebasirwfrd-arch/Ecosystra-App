import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers, type GqlContext } from "./graphql/resolvers";
import { resolveAuth } from "./lib/auth";
import { prisma } from "./db";
import { startEmailWorkerIfEnabled } from "./lib/email-queue";

dotenv.config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || true,
      credentials: true,
    })
  );
  app.use(express.json());

  const server = new ApolloServer<GqlContext>({
    typeDefs,
    resolvers,
    formatError: (err) => {
      const code =
        err.message === "UNAUTHORIZED"
          ? "UNAUTHENTICATED"
          : err.message === "FORBIDDEN"
            ? "FORBIDDEN"
            : undefined;
      return {
        message: err.message,
        extensions: code ? { code } : err.extensions,
      };
    },
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }): Promise<GqlContext> => {
        const auth = await resolveAuth(req);
        const prismaUser = auth.email
          ? await prisma.user.findUnique({ where: { email: auth.email } })
          : null;
        return { auth, prismaUser };
      },
    })
  );

  startEmailWorkerIfEnabled();

  app.listen(port, () => {
    console.log(`API ready at http://localhost:${port}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error("Initialisation failed", err);
  process.exit(1);
});
