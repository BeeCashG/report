export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const record: any = db.prepare("SELECT pdfUrl FROM PageRecord WHERE id = ?").get(id);

    if (record?.pdfUrl) {
      await deleteFile(record.pdfUrl);
    }

    db.prepare("DELETE FROM PageRecord WHERE id = ?").run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
