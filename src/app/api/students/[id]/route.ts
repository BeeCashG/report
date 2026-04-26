export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await getOne("SELECT * FROM Student WHERE id = ?", [id]);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    await query(
      "UPDATE Student SET name = ?, thesisTitle = ?, contact = ? WHERE id = ?",
      [body.name, body.thesisTitle || null, body.contact || null, id]
    );
    const student = await getOne("SELECT * FROM Student WHERE id = ?", [id]);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query("DELETE FROM Student WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
