import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

export function createEcosystraGraphqlClient() {
  const uri =
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    process.env.NEXT_PUBLIC_ECOSYSTRA_GRAPHQL_URL ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/api/graphql`
      : "http://localhost:4000/graphql")

  return new ApolloClient({
    link: createHttpLink({ uri, credentials: "include" }),
    cache: new InMemoryCache(),
  })
}
