import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  const { supabase, headers } = createRouteHandlerClient(request);

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  headers.set("Location", "/");
  return new Response(null, { status: 302, headers });
}
