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
import { Plus, IndianRupee } from "lucide-react";
import { paymentService } from "@/services/paymentService";
import { studentService } from "@/services/studentService";
import { Student } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface AddPaymentModalProps {
  onSuccess: () => void;
}

export function AddPaymentModal({ onSuccess }: AddPaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    studentId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    amountPaid: 0,
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
    if (formData.amountPaid <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const selectedStudent = students.find(s => s.id === formData.studentId);
      await paymentService.addPayment({
        ...formData,
        studentName: selectedStudent?.name || "Student",
        date: new Date(formData.date),
        amountPaid: Number(formData.amountPaid),
      });

      toast.success("Payment recorded successfully");
      setFormData({
        studentId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        amountPaid: 0,
        notes: "",
      });
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details received from a student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="p-student">Student</Label>
              <Select 
                value={formData.studentId} 
                onValueChange={(val) => setFormData({ ...formData, studentId: val })}
              >
                <SelectTrigger id="p-student">
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
                <Label htmlFor="p-date">Date</Label>
                <Input
                  id="p-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount Paid (Rs)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    className="pl-9"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="p-notes">Notes (Optional)</Label>
              <Textarea
                id="p-notes"
                placeholder="Bank transfer, Cash, GPay, etc..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white w-full">
              {loading ? "Recording..." : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
