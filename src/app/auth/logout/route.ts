import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

  await supabase.auth.signOut();

  responseHeaders.set("Location", "/login");
  return new Response(null, { status: 302, headers: responseHeaders });
}
