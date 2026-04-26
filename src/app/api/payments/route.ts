export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query, getOne } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    
    let payments;
    if (studentId) {
      payments = await query("SELECT * FROM Payment WHERE studentId = ? ORDER BY date DESC", [studentId]);
    } else {
      payments = await query("SELECT * FROM Payment ORDER BY date DESC");
    }
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = uuidv4();
    await query(
      "INSERT INTO Payment (id, studentId, studentName, amountPaid, date, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [id, body.studentId, body.studentName, parseFloat(body.amountPaid), body.date, body.notes || null]
    );
    
    const payment = await getOne("SELECT * FROM Payment WHERE id = ?", [id]);
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
