import { Student } from "@/types";

const API_BASE = "/api/students";

export const studentService = {
  async getAllStudents(): Promise<Student[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch students");
    return res.json();
  },

  async getStudentById(id: string): Promise<Student | null> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) return null;
    return res.json();
  },

  async addStudent(student: Omit<Student, "id" | "createdAt">): Promise<Student> {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Failed to add student");
    return res.json();
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return res.json();
  },

  async deleteStudent(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete student");
  }
};
