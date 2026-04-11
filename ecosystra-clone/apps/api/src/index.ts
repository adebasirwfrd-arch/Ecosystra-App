import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = express();
  
  // Konfigurasi Middlewares dasar keamanan (sejalan dengan CSP & Auth)
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  
  // Endpoint GraphQL
  app.use(
    '/graphql', 
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Disinilah penempatan verifikasi Token Akses JWT
        const token = req.headers.authorization || '';
        // Validasi identitas pengguna, pengembalian payload
        return { user: { token } };
      }
    })
  );

  app.listen(port, () => {
    console.log(`🚀 API Server ready at http://localhost:${port}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error('Initialisation failed', err);
});
