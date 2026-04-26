export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { saveFile } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    
    let records;
    if (studentId) {
      records = db.prepare("SELECT * FROM PageRecord WHERE studentId = ? ORDER BY date DESC").all(studentId);
    } else {
      records = db.prepare("SELECT * FROM PageRecord ORDER BY date DESC").all();
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

    if (file) {
      pdfUrl = await saveFile(file);
      pdfName = file.name;
    }

    const id = uuidv4();
    const stmt = db.prepare("INSERT INTO PageRecord (id, studentId, studentName, date, pagesEdited, notes, pdfUrl, pdfName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(id, studentId, studentName, date, pagesEdited, notes || null, pdfUrl || null, pdfName || null);

    const record = db.prepare("SELECT * FROM PageRecord WHERE id = ?").get(id);
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
