import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

export function createEcosystraGraphqlClient() {
  const uri =
    process.env.NEXT_PUBLIC_ECOSYSTRA_GRAPHQL_URL ||
    "http://localhost:4000/graphql"

  return new ApolloClient({
    link: createHttpLink({ uri }),
    cache: new InMemoryCache(),
  })
}
