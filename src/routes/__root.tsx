import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-aura-black px-4">
      <div className="max-w-md text-center">
        <h1 className="display-md text-aura-text">404</h1>
        <p className="mt-4 body-md text-aura-text-muted">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-aura-violet px-8 text-white body-strong hover:bg-aura-violet-dim transition-all duration-base"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-aura-black px-4">
      <div className="max-w-md text-center">
        <h1 className="heading-xl text-aura-text">Something went wrong</h1>
        <p className="mt-2 body-md text-aura-text-muted">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-aura-violet px-8 text-white body-strong hover:bg-aura-violet-dim transition-all duration-base"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AURA WEAR — البِس. عبِّر عن نفسك." },
      { name: "description", content: "باكات كاملة من ملابس AURA WEAR، توصَّل لعندك." },
      { property: "og:title", content: "AURA WEAR" },
      { property: "og:description", content: "باكات كاملة، توصَّل لعندك." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
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
      <AuthProvider>
        <Outlet />
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: 0, background: "#16161F", color: "#F0F0F5", border: "1px solid #2A2A3A" } }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
