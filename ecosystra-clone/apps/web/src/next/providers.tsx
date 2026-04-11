"use client";

import { ApolloProvider } from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMemo } from "react";
import type { ReactNode } from "react";

import { createApolloClient } from "./apollo-client";

export function Providers({ children }: { children: ReactNode }) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "774084590937-ej8f13a7j01gddobb42a426uksudqst8.apps.googleusercontent.com";

  const apolloClient = useMemo(() => createApolloClient(), []);

  /* eslint-disable @typescript-eslint/no-explicit-any -- dual @types/react when embedded in Next.js */
  const Apollo = ApolloProvider as any;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Apollo client={apolloClient}>
        {children}
      </Apollo>
    </GoogleOAuthProvider>
  );
}
