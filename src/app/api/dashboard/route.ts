export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const allStudents = db.prepare("SELECT * FROM Student ORDER BY name ASC").all();
    const allRecords: any[] = db.prepare("SELECT * FROM PageRecord ORDER BY date DESC").all();
    const allPayments: any[] = db.prepare("SELECT * FROM Payment ORDER BY date DESC").all();

    const totalPages = allRecords.reduce((sum, r) => sum + r.pagesEdited, 0);
    const totalEarnings = totalPages * 100;
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amountPaid, 0);

    return NextResponse.json({
      students: allStudents,
      recentRecords: allRecords.slice(0, 5),
      recentPayments: allPayments.slice(0, 5),
      stats: {
        totalPages,
        totalEarnings,
        totalPaid,
        remainingBalance: totalEarnings - totalPaid,
      }
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
