"use client";

import { useState, useEffect, use } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  User, 
  Mail, 
  BookOpen, 
  TrendingUp, 
  CreditCard, 
  Clock, 
  ChevronLeft,
  Download,
  FileText
} from "lucide-react";
import Link from "next/link";
import { studentService } from "@/services/studentService";
import { recordService } from "@/services/recordService";
import { paymentService } from "@/services/paymentService";
import { Student, PageRecord, Payment } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<Student | null>(null);
  const [records, setRecords] = useState<PageRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [studentData, recordData, paymentData] = await Promise.all([
          studentService.getStudentById(id),
          recordService.getRecordsByStudent(id),
          paymentService.getPaymentsByStudent(id),
        ]);

        if (studentData) {
          setStudent(studentData);
          setRecords(recordData);
          setPayments(paymentData);
        } else {
          toast.error("Student not found");
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Failed to load student data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Student Not Found</h2>
        <Button asChild className="mt-4">
          <Link href="/students">Back to Students</Link>
        </Button>
      </div>
    );
  }

  const totalPages = records.reduce((sum, r) => sum + Number(r.pagesEdited), 0);
  const totalEarnings = totalPages * 100;
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
  const balance = totalEarnings - totalPaid;

  const stats = [
    { title: "Total Pages", value: totalPages, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Earnings", value: `Rs ${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Paid", value: `Rs ${totalPaid.toLocaleString()}`, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Pending Balance", value: `Rs ${balance.toLocaleString()}`, icon: Clock, color: balance > 0 ? "text-orange-600" : "text-slate-600", bg: balance > 0 ? "bg-orange-50" : "bg-slate-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/students">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{student.name}</h2>
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <Mail className="h-4 w-4" />
            <span>{student.contact || "No contact info"}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>Basic information and project details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Title</label>
              <p className="text-sm font-medium text-slate-700">{student.projectTitle || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Details</label>
              <p className="text-sm font-medium text-slate-700">{student.contact || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered On</label>
              <p className="text-sm font-medium text-slate-700">
                {student.createdAt ? format(new Date(student.createdAt), "PPP") : "N/A"}
              </p>
            </div>
            <div className="pt-4">
              <Button className="w-full" variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="edits" className="w-full">
              <div className="px-6 pt-6 flex items-center justify-between">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="edits">Edits</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </div>
              </div>

              <TabsContent value="edits" className="mt-4">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>File</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.length > 0 ? (
                      records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="pl-6 font-medium">
                            {format(new Date(record.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.pagesEdited} pages</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900">
                            Rs {(Number(record.pagesEdited) * 100).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {record.pdfUrl ? (
                              <a 
                                href={record.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <FileText className="h-3 w-3" />
                                <span className="text-xs truncate max-w-[100px]">{record.pdfName}</span>
                              </a>
                            ) : (
                              <span className="text-xs text-slate-300">None</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-slate-500 italic">
                          No editing history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="payments" className="mt-4">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="pl-6">Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="pl-6 font-medium">
                            {format(new Date(payment.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            Rs {payment.amountPaid.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-slate-500">
                            {payment.notes || <span className="text-slate-300 italic">No notes</span>}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-slate-500 italic">
                          No payment history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
