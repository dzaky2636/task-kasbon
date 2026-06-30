import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  responseHeaders.set("Location", "/");
  return new Response(null, { status: 302, headers: responseHeaders });
}
