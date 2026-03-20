import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("google map leads")
    .select("keyword")
    .not("keyword", "is", null)
    .order("keyword");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Deduplicate keywords
  const keywords = [...new Set((data || []).map((r) => r.keyword).filter(Boolean))];
  return NextResponse.json({ keywords });
}
