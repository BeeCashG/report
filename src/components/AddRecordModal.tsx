"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, FileUp, X, FileText } from "lucide-react";
import { recordService } from "@/services/recordService";
import { studentService } from "@/services/studentService";
import { Student } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface AddRecordModalProps {
  onSuccess: () => void;
  buttonText?: string;
}

export function AddRecordModal({ onSuccess, buttonText = "Add Record" }: AddRecordModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    pagesEdited: 0,
    notes: "",
  });

  useEffect(() => {
    if (open) {
      studentService.getAllStudents().then(setStudents);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) {
      toast.error("Please select a student");
      return;
    }
    if (formData.pagesEdited <= 0) {
      toast.error("Pages edited must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      await recordService.addRecord({
        ...formData,
        studentName: selectedStudent?.name || "Student",
        date: new Date(formData.date),
        pagesEdited: Number(formData.pagesEdited),
      }, file || undefined);

      toast.success("Record added successfully");
      setFormData({
        studentId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        pagesEdited: 0,
        notes: "",
      });
      setFile(null);
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Editing Record</DialogTitle>
            <DialogDescription>
              Record pages edited and upload the final PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Student</Label>
              <Select 
                value={formData.studentId} 
                onValueChange={(val) => setFormData({ ...formData, studentId: val })}
              >
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select student" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pages">Pages Edited</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  value={formData.pagesEdited}
                  onChange={(e) => setFormData({ ...formData, pagesEdited: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Specific instructions or feedback..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Upload PDF</Label>
              {!file ? (
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <FileUp className="w-8 h-8 text-slate-400" />
                  <p className="text-sm text-slate-500 font-medium">Click to upload or drag & drop</p>
                  <p className="text-xs text-slate-400">PDF (Max 10MB)</p>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="max-w-[250px]">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              {loading ? "Adding Record..." : `Save Record (Rs ${formData.pagesEdited * 100})`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
