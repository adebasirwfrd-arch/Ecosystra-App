import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

export type CreateApolloClientOptions = {
  /** Called after successful GraphQL mutations (for TanStack Query invalidation). */
  afterMutation?: (operationName: string) => void;
};

export function createApolloClient(options: CreateApolloClientOptions = {}) {
  const { afterMutation } = options;

  const uri =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";

  const httpLink = createHttpLink({ uri });

  const errorLink = onError(({ networkError }) => {
    if (!networkError || typeof window === "undefined") return;
    const w = window as Window & { __ecoGqlBackendWarned?: boolean };
    if (w.__ecoGqlBackendWarned) return;
    w.__ecoGqlBackendWarned = true;
    console.warn(
      "[Ecosystra] GraphQL server not reachable (ERR_CONNECTION_REFUSED usually means the API is not running).",
      "Start it: from the full-kit app run `pnpm ecosystra:api`, or `npm run dev` in ecosystra-clone/apps/api.",
      "Endpoint:",
      uri
    );
  });

  const mutationInvalidationLink = new ApolloLink((operation, forward) => {
    return forward(operation).map((result) => {
      const isMutation = operation.query.definitions.some(
        (d) =>
          d.kind === "OperationDefinition" && d.operation === "mutation"
      );
      if (
        isMutation &&
        afterMutation &&
        !result.errors?.length
      ) {
        afterMutation(operation.operationName || "");
      }
      return result;
    });
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, mutationInvalidationLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
        fetchPolicy: "cache-first",
        nextFetchPolicy: "cache-first",
      },
      query: {
        errorPolicy: "all",
        fetchPolicy: "cache-first",
      },
    },
  });
}
