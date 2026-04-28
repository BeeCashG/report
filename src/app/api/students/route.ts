import { NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const students = await query("SELECT * FROM Student ORDER BY name ASC");
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, course, total_fee, paid_fee } = body;
    const id = uuidv4();

    await query(
      "INSERT INTO Student (id, name, email, phone, course, total_fee, paid_fee) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        name || null, 
        name ?? null, 
        email ?? null, 
        phone ?? null, 
        course ?? null, 
        total_fee ?? 0, 
        paid_fee ?? 0
      ]
    );

    const student = await getOne("SELECT * FROM Student WHERE id = ?", [id]);
    return NextResponse.json(student);
  } catch (error: any) {
    console.error("POST /api/students error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
