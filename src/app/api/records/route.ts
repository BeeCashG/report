export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";
import { saveFile } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    
    let records;
    if (studentId) {
      records = await query("SELECT * FROM PageRecord WHERE studentId = ? ORDER BY date DESC", [studentId]);
    } else {
      records = await query("SELECT * FROM PageRecord ORDER BY date DESC");
    }
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const studentId = formData.get("studentId") as string;
    const studentName = formData.get("studentName") as string;
    const date = formData.get("date") as string;
    const pagesEdited = parseInt(formData.get("pagesEdited") as string);
    const notes = formData.get("notes") as string;
    const file = formData.get("file") as File | null;

    let pdfUrl = "";
    let pdfName = "";

    if (file && file.size > 0) {
      pdfUrl = await saveFile(file);
      pdfName = file.name;
    }

    const id = uuidv4();
    await query(
      "INSERT INTO WorkRecord (id, student_id, date, description, file_url) VALUES (?, ?, ?, ?, ?)",
      [
        id, 
        studentId ?? null, 
        date ?? null, 
        notes || "", 
        pdfUrl || null
      ]
    );

    const record = await getOne("SELECT * FROM WorkRecord WHERE id = ?", [id]);
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
