export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const students = await query("SELECT * FROM Student ORDER BY name ASC");
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = uuidv4();
    await query(
      "INSERT INTO Student (id, name, thesisTitle, contact) VALUES (?, ?, ?, ?)",
      [id, body.name, body.thesisTitle || null, body.contact || null]
    );
    const student = await getOne("SELECT * FROM Student WHERE id = ?", [id]);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
