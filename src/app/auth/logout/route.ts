import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { supabase, headers } = createRouteHandlerClient(request);

  await supabase.auth.signOut();

  headers.set("Location", "/login");
  return new Response(null, { status: 302, headers });
}
