import { createRouteHandlerClient } from "@/lib/supabase/server";
import { updateDebtSchema } from "@/lib/utils/validation";
import type { Debt } from "@/lib/types/debt";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, headers } = createRouteHandlerClient(request);

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const { id } = await params;

  const { data: existing, error: fetchError } = await supabase
    .from("debts")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  if ((existing as Debt).user_id !== userData.user.id) {
    return NextResponse.json(
      { error: "Kamu tidak punya akses ke data ini" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const parsed = updateDebtSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400, headers },
    );
  }

  const updateData: Record<string, unknown> = {};

  if (parsed.data.type !== undefined) updateData.type = parsed.data.type;
  if (parsed.data.counterpart_name !== undefined)
    updateData.counterpart_name = parsed.data.counterpart_name;
  if (parsed.data.amount !== undefined) updateData.amount = parsed.data.amount;
  if (parsed.data.due_date !== undefined) updateData.due_date = parsed.data.due_date;
  if (parsed.data.note !== undefined) updateData.note = parsed.data.note;

  if (Object.prototype.hasOwnProperty.call(parsed.data, "settled_at")) {
    updateData.settled_at = parsed.data.settled_at ?? null;
  }

  updateData.updated_at = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("debts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Gagal menyimpan perubahan" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ data: updated }, { headers });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { supabase, headers } = createRouteHandlerClient(request);

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData.user) {
    return NextResponse.json({ error: "Harus login dulu" }, { status: 401 });
  }

  const { id } = await params;

  const { data: existing, error: fetchError } = await supabase
    .from("debts")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  }

  if ((existing as Debt).user_id !== userData.user.id) {
    return NextResponse.json(
      { error: "Kamu tidak punya akses ke data ini" },
      { status: 403 },
    );
  }

  const { error: deleteError } = await supabase
    .from("debts")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Gagal menghapus" },
      { status: 500, headers },
    );
  }

  return NextResponse.json({ data: existing }, { headers });
}
