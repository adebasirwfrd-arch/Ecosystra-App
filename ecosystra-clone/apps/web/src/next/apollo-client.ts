import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

export function createApolloClient() {
  const uri =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "/api/graphql";

  const httpLink = createHttpLink({ uri });

  const authLink = setContext(async (_, { headers }) => {
    if (typeof window === "undefined") {
      return { headers };
    }
    try {
      const { getSession } = await import("next-auth/react");
      let session = await getSession();
      if (!session?.apiAccessToken) {
        await new Promise((r) => setTimeout(r, 500));
        session = await getSession();
      }
      const token = session?.apiAccessToken;
      return {
        headers: {
          ...headers,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    } catch {
      return { headers };
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (typeof window === "undefined") return;
    if (graphQLErrors) {
      for (const e of graphQLErrors) {
        if (e.extensions?.code === "UNAUTHENTICATED") {
          console.warn(
            `[Ecosystra] Auth required for ${operation.operationName} — session may not be ready yet.`
          );
        }
      }
    }
    if (networkError) {
      const w = window as Window & { __ecoGqlBackendWarned?: boolean };
      if (w.__ecoGqlBackendWarned) return;
      w.__ecoGqlBackendWarned = true;
      console.warn(
        "[Ecosystra] GraphQL server not reachable.",
        "Start: npm run dev in ecosystra-clone/apps/api.",
        "Endpoint:",
        uri
      );
    }
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
        fetchPolicy: "cache-and-network",
      },
      query: {
        errorPolicy: "all",
        fetchPolicy: "cache-and-network",
      },
    },
  });
}
