export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const allStudents: any = await query("SELECT * FROM Student ORDER BY name ASC");
    const allRecords: any = await query("SELECT * FROM PageRecord ORDER BY date DESC");
    const allPayments: any = await query("SELECT * FROM Payment ORDER BY date DESC");

    const totalPages = allRecords.reduce((sum: number, r: any) => sum + r.pagesEdited, 0);
    const totalEarnings = totalPages * 100;
    const totalPaid = allPayments.reduce((sum: number, p: any) => sum + Number(p.amountPaid), 0);

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
