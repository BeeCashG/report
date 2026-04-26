import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { Student, PageRecord, Payment } from "@/types";

export const exportToExcel = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};

export const generateStudentReport = (
  student: Student, 
  records: PageRecord[], 
  payments: Payment[]
) => {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text("Consultancy Work Report", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${format(new Date(), "PPP")}`, pageWidth / 2, 28, { align: "center" });

  // Student Info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Student Profile", 14, 45);
  
  doc.setFontSize(10);
  doc.text(`Name: ${student.name}`, 14, 55);
  doc.text(`Project: ${student.projectTitle || "N/A"}`, 14, 62);
  doc.text(`Contact: ${student.contact || "N/A"}`, 14, 69);

  // Financial Summary
  const totalPages = records.reduce((sum, r) => sum + Number(r.pagesEdited), 0);
  const totalEarnings = totalPages * 100;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
  const balance = totalEarnings - totalPaid;

  doc.setFontSize(16);
  doc.text("Financial Summary", 120, 45);
  doc.setFontSize(10);
  doc.text(`Total Pages: ${totalPages}`, 120, 55);
  doc.text(`Total Earnings: Rs ${totalEarnings.toLocaleString()}`, 120, 62);
  doc.text(`Total Paid: Rs ${totalPaid.toLocaleString()}`, 120, 69);
  doc.setTextColor(balance > 0 ? 220 : 0, balance > 0 ? 38 : 0, balance > 0 ? 38 : 0);
  doc.text(`Remaining Balance: Rs ${balance.toLocaleString()}`, 120, 76);
  doc.setTextColor(0, 0, 0);

  // Table - Editing History
  doc.setFontSize(14);
  doc.text("Editing History", 14, 90);
  
  const recordRows = records.map(r => [
    format(new Date(r.date), "dd/MM/yyyy"),
    r.pagesEdited.toString(),
    `Rs ${(Number(r.pagesEdited) * 100).toLocaleString()}`,
    r.notes || "-"
  ]);

  doc.autoTable({
    startY: 95,
    head: [["Date", "Pages", "Amount", "Notes"]],
    body: recordRows,
    theme: "striped",
    headStyles: { fillColor: [30, 58, 138] }
  });

  // Table - Payment History
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(14);
  doc.text("Payment History", 14, finalY + 15);

  const paymentRows = payments.map(p => [
    format(new Date(p.date), "dd/MM/yyyy"),
    `Rs ${p.amountPaid.toLocaleString()}`,
    p.notes || "-"
  ]);

  doc.autoTable({
    startY: finalY + 20,
    head: [["Date", "Amount Paid", "Notes"]],
    body: paymentRows,
    theme: "striped",
    headStyles: { fillColor: [21, 128, 61] } // green-700
  });

  doc.save(`${student.name.replace(/\s+/g, "_")}_Report.pdf`);
};
