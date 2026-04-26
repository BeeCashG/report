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
  FileText, 
  Download, 
  Eye, 
  Search,
  ExternalLink,
  Calendar,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { recordService } from "@/services/recordService";
import { PageRecord } from "@/types";
import { format } from "date-fns";

export default function FilesPage() {
  const [records, setRecords] = useState<PageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchFiles() {
      try {
        const data = await recordService.getAllRecords();
        // Filter only those with PDFs
        setRecords(data.filter(r => r.pdfUrl));
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  const filteredFiles = records.filter(r => 
    r.pdfName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Files</h2>
        <p className="text-slate-500">Manage and preview all edited documents.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by file name or student..." 
            className="pl-10 bg-white shadow-sm border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredFiles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="border-none shadow-sm group hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-50 group-hover:bg-blue-50 transition-colors">
                <FileText className="h-12 w-12 text-slate-300 group-hover:text-blue-300" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-slate-900 truncate mb-1" title={file.pdfName}>
                  {file.pdfName}
                </h3>
                <div className="space-y-1 mt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="h-3 w-3" />
                    <span>{file.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(file.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                  <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                    <a href={file.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-3 w-3" /> Preview
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 hover:bg-blue-50" asChild>
                    <a href={file.pdfUrl} download={file.pdfName}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No files found</h3>
          <p className="text-slate-500">Try adjusting your search or upload new records.</p>
        </div>
      )}
    </div>
  );
}
