import { createServerSupabaseClient } from "@/lib/supabase-server";
import { CleaningType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("cleaning_logs")
      .select("*")
      .order("cleaned_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const room_id = body.room_id as string;
    const cleaning_type = body.cleaning_type as CleaningType;
    const notes = body.notes as string | undefined;

    if (!room_id || !cleaning_type) {
      return NextResponse.json(
        { error: "room_id and cleaning_type are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("cleaning_logs")
      .insert([
        {
          room_id,
          cleaning_type,
          notes: notes ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create cleaning log" },
      { status: 500 }
    );
  }
}