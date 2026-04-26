export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const record: any = await getOne("SELECT pdfUrl FROM PageRecord WHERE id = ?", [id]);

    if (record?.pdfUrl) {
      await deleteFile(record.pdfUrl);
    }

    await query("DELETE FROM PageRecord WHERE id = ?", [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
