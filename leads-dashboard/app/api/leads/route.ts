import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { EmailFilter, SortField, SortOrder } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const keyword = searchParams.get("keyword") || "";
  const sortField = (searchParams.get("sortField") || "created_at") as SortField;
  const sortOrder = (searchParams.get("sortOrder") || "desc") as SortOrder;
  const emailFilter = (searchParams.get("emailFilter") || "all") as EmailFilter;
  const search = searchParams.get("search") || "";

  const offset = (page - 1) * limit;

  // Table name with space needs quoting — use the actual table name
  let query = supabase.from("google map leads").select("*", { count: "exact" });

  // Keyword filter
  if (keyword) {
    query = query.eq("keyword", keyword);
  }

  // Text search on business name or address
  if (search) {
    query = query.or(
      `business_name.ilike.%${search}%,address.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  // Email filter
  if (emailFilter === "with_email") {
    // has at least one email (emails array is not empty)
    query = query.not("emails", "eq", "{}");
  } else if (emailFilter === "without_email") {
    query = query.eq("emails", "{}");
  }

  // Sorting
  query = query.order(sortField, { ascending: sortOrder === "asc" });

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [], total: count || 0 });
}
