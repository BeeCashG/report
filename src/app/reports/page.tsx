"use client";

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  FileDown, 
  Table as TableIcon, 
  FileText, 
  BarChart,
  Download
} from "lucide-react";
import { studentService } from "@/services/studentService";
import { recordService } from "@/services/recordService";
import { paymentService } from "@/services/paymentService";
import { Student } from "@/types";
import { exportToExcel, generateStudentReport } from "@/lib/exportUtils";
import { toast } from "sonner";

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    studentService.getAllStudents().then(setStudents);
  }, []);

  const handleExportAll = async (type: "records" | "payments") => {
    setLoading(true);
    try {
      if (type === "records") {
        const data = await recordService.getAllRecords();
        const exportData = data.map(r => ({
          Date: new Date(r.date).toLocaleDateString(),
          Student: r.studentName,
          Pages: r.pagesEdited,
          Earnings: Number(r.pagesEdited) * 100,
          Notes: r.notes
        }));
        exportToExcel(exportData, "All_Editing_Records");
      } else {
        const data = await paymentService.getAllPayments();
        const exportData = data.map(p => ({
          Date: new Date(p.date).toLocaleDateString(),
          Student: p.studentName,
          Amount: p.amountPaid,
          Notes: p.notes
        }));
        exportToExcel(exportData, "All_Payments");
      }
      toast.success("Export successful");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student");
      return;
    }

    setLoading(true);
    try {
      const [student, records, payments] = await Promise.all([
        studentService.getStudentById(selectedStudentId),
        recordService.getRecordsByStudent(selectedStudentId),
        paymentService.getPaymentsByStudent(selectedStudentId),
      ]);

      if (student) {
        generateStudentReport(student, records, payments);
        toast.success("Report generated");
      }
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports & Export</h2>
        <p className="text-slate-500">Generate professional reports and export your data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5 text-blue-600" />
              Bulk Export
            </CardTitle>
            <CardDescription>Download all your data in Excel format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <TableIcon className="h-8 w-8 text-blue-500 bg-blue-100 p-2 rounded-lg" />
                <div>
                  <p className="font-medium">All Editing Records</p>
                  <p className="text-xs text-slate-500">History of all pages edited</p>
                </div>
              </div>
              <Button onClick={() => handleExportAll("records")} disabled={loading} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <BarChart className="h-8 w-8 text-green-500 bg-green-100 p-2 rounded-lg" />
                <div>
                  <p className="font-medium">All Payment Records</p>
                  <p className="text-xs text-slate-500">History of all payments</p>
                </div>
              </div>
              <Button onClick={() => handleExportAll("payments")} disabled={loading} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Per-Student Report
            </CardTitle>
            <CardDescription>Generate a detailed PDF summary for a specific student.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Student</label>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id || ""}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateReport} 
              disabled={loading || !selectedStudentId} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate PDF Report
            </Button>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-800 leading-relaxed">
                <strong>Note:</strong> The PDF report includes student profile, project details, full editing history, and a detailed payment summary with remaining balance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
