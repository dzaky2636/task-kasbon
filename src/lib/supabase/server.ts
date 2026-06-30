import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server Components cannot set cookies. Token refreshes are handled
          // by the proxy (Next.js 16 replacement for middleware).
        },
      },
    },
  );
}

interface RouteHandlerContext {
  supabase: ReturnType<typeof createServerClient>;
  headers: Headers;
}

export function createRouteHandlerClient(request: Request): RouteHandlerContext {
  const responseHeaders = new Headers();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(
            request.headers.get("Cookie") ?? "",
          ).map((c) => ({ name: c.name, value: c.value ?? "" }));
        },
        setAll(cookiesToSet, cacheHeaders) {
          cookiesToSet.forEach(({ name, value, options }) =>
            responseHeaders.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            ),
          );
          Object.entries(cacheHeaders).forEach(([key, value]) =>
            responseHeaders.set(key, value),
          );
        },
      },
    },
  );

  return { supabase, headers: responseHeaders };
}
