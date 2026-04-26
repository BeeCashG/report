export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const students = db.prepare("SELECT * FROM Student ORDER BY name ASC").all();
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = uuidv4();
    const stmt = db.prepare("INSERT INTO Student (id, name, projectTitle, contact) VALUES (?, ?, ?, ?)");
    stmt.run(id, body.name, body.projectTitle || null, body.contact || null);
    
    const student = db.prepare("SELECT * FROM Student WHERE id = ?").get(id);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
