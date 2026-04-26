export interface Student {
  id?: string;
  name: string;
  projectTitle?: string;
  contact?: string;
  createdAt: Date | string;
}

export interface PageRecord {
  id?: string;
  studentId: string;
  studentName?: string;
  date: Date | string;
  pagesEdited: number;
  notes?: string;
  pdfUrl?: string;
  pdfName?: string;
  createdAt: Date | string;
}

export interface Payment {
  id?: string;
  studentId: string;
  studentName?: string;
  amountPaid: number;
  date: Date | string;
  notes?: string;
  createdAt: Date | string;
}

export interface DashboardStats {
  totalPages: number;
  totalEarnings: number;
  totalPaid: number;
  remainingBalance: number;
}
