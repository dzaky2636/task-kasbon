import { createRouteHandlerClient } from "@/lib/supabase/server";
import { createDebtSchema } from "@/lib/utils/validation";
import type { Debt } from "@/lib/types/debt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { supabase, headers } = createRouteHandlerClient(request);

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const type = url.searchParams.get("type");

  let query = supabase
    .from("debts")
    .select("*")
    .order("created_at", { ascending: false });

  if (status === "settled") {
    query = query.not("settled_at", "is", null);
  } else if (status === "unsettled") {
    query = query.is("settled_at", null);
  }

  if (type === "owed_to_me" || type === "i_owe") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat data" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ data: (data as Debt[]) ?? [] }, { headers });
}

export async function POST(request: Request) {
  const { supabase, headers } = createRouteHandlerClient(request);

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Data tidak valid" },
      { status: 400 },
    );
  }

  const parsed = createDebtSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("debts")
    .insert({
      user_id: userData.user.id,
      type: parsed.data.type,
      counterpart_name: parsed.data.counterpart_name,
      amount: parsed.data.amount,
      note: parsed.data.note ?? null,
      due_date: parsed.data.due_date ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ data }, { status: 201, headers });
}
