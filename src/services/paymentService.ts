import { Payment } from "@/types";

const API_BASE = "/api/payments";

export const paymentService = {
  async getAllPayments(): Promise<Payment[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch payments");
    return res.json();
  },

  async getPaymentsByStudent(studentId: string): Promise<Payment[]> {
    const res = await fetch(`${API_BASE}?studentId=${studentId}`);
    if (!res.ok) throw new Error("Failed to fetch payments");
    return res.json();
  },

  async addPayment(payment: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payment),
    });
    if (!res.ok) throw new Error("Failed to add payment");
    return res.json();
  },

  async deletePayment(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete payment");
  }
};
