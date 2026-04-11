"use client";

import { usePathname, useRouter } from "next/navigation";
import App from "../App";
import { Providers } from "./providers";

export function ClientApp() {
  const pathname = usePathname();
  const router = useRouter();

  const pathToView: Record<string, string> = {
    "/": "board",
    "/board": "board",
    "/dashboard": "dashboard",
    "/profile": "profile",
    "/tasks": "tasks",
    "/members": "members",
    "/settings": "settings",
    "/inbox": "inbox",
    "/notifications": "notifications",
  };

  const viewToPath: Record<string, string> = {
    board: "/board",
    dashboard: "/dashboard",
    profile: "/profile",
    tasks: "/tasks",
    members: "/members",
    settings: "/settings",
    inbox: "/inbox",
    notifications: "/notifications",
  };

  const initialView = pathToView[pathname] || "board";

  return (
    <Providers>
      <App
        initialView={initialView}
        onRouteNavigate={(view) => {
          const nextPath = viewToPath[view] || "/board";
          if (pathname !== nextPath) router.push(nextPath);
        }}
      />
    </Providers>
  );
}
