"use client";

import { useState, useEffect } from "react";
import { Student, PageRecord, Payment, DashboardStats } from "@/types";

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    totalEarnings: 0,
    totalPaid: 0,
    remainingBalance: 0,
  });
  const [recentRecords, setRecentRecords] = useState<PageRecord[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();

        setStudents(data.students);
        setRecentRecords(data.recentRecords);
        setRecentPayments(data.recentPayments);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { stats, recentRecords, recentPayments, students, loading };
}
