import { PageRecord } from "@/types";

const API_BASE = "/api/records";

export const recordService = {
  async getAllRecords(): Promise<PageRecord[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch records");
    return res.json();
  },

  async getRecordsByStudent(studentId: string): Promise<PageRecord[]> {
    const res = await fetch(`${API_BASE}?studentId=${studentId}`);
    if (!res.ok) throw new Error("Failed to fetch records");
    return res.json();
  },

  async addRecord(record: Omit<PageRecord, "id" | "createdAt">, file?: File): Promise<PageRecord> {
    const formData = new FormData();
    formData.append("studentId", record.studentId);
    formData.append("studentName", record.studentName || "");
    formData.append("date", new Date(record.date).toISOString());
    formData.append("pagesEdited", record.pagesEdited.toString());
    formData.append("notes", record.notes || "");
    if (file) formData.append("file", file);

    const res = await fetch(API_BASE, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to add record");
    return res.json();
  },

  async deleteRecord(id: string, pdfUrl?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete record");
  }
};
