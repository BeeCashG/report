"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreVertical, 
  Download, 
  Eye, 
  Trash2, 
  FileText,
  Calendar as CalendarIcon
} from "lucide-react";
import { recordService } from "@/services/recordService";
import { PageRecord } from "@/types";
import { AddRecordModal } from "@/components/AddRecordModal";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

export default function RecordsPage() {
  const [records, setRecords] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await recordService.getAllRecords();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (record: PageRecord) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await recordService.deleteRecord(record.id!, record.pdfUrl);
        toast.success("Record deleted");
        fetchRecords();
      } catch (error) {
        toast.error("Failed to delete record");
      }
    }
  };

  const filteredRecords = records.filter(r => 
    r.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editing Records</h2>
          <p className="text-slate-500">History of all pages edited across all students.</p>
        </div>
        <AddRecordModal onSuccess={fetchRecords} />
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by student or notes..." 
                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{filteredRecords.length} Records</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3 w-3 text-slate-400" />
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{record.studentName}</div>
                      <div className="text-xs text-slate-400 max-w-[200px] truncate">{record.notes}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {record.pagesEdited} pages
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      Rs {(Number(record.pagesEdited) * 100).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {record.pdfUrl ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium max-w-[120px] truncate">{record.pdfName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">No file</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {record.pdfUrl && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" asChild>
                            <a href={record.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                              <Eye className="h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer text-red-600"
                              onClick={() => handleDelete(record)}
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500 italic">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
