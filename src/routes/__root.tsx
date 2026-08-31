import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { BackgroundMesh } from "../components/site/BackgroundMesh";

function NotFoundComponent() {
  return (
    <div className="relative min-h-screen bg-background px-4">
      <BackgroundMesh />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <p className="eyebrow mb-3">404 / NOT FOUND</p>

          <h1 className="display text-7xl text-foreground">404</h1>

          <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
            Page not found
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-7">
            <Link
              to="/"
              className="inline-flex items-center justify-center border border-foreground px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-background px-4">
      <BackgroundMesh />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <p className="eyebrow mb-3">SYSTEM / ERROR</p>

          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center justify-center border border-foreground px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Try again
            </button>

            <a
              href="/"
              className="inline-flex items-center justify-center border border-border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Kuldeep Mandal — Software Engineer",
      },
      {
        name: "description",
        content: "Software engineer building AI systems, backend services and full-stack products.",
      },
      {
        name: "author",
        content: "Kuldeep Mandal",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
  }),

  shellComponent: RootShell,

  component: RootComponent,

  notFoundComponent: NotFoundComponent,

  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        {children}

        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-background">
        {/* 
          Global technical network.

          This is intentionally behind every section.
          Hero has its own original SystemField on top.
        */}
        <BackgroundMesh />

        {/* 
          All actual page content remains above
          the global network.
        */}
        <main className="relative z-10">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
}
