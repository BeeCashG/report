"use client";

import { 
  TrendingUp, 
  Users, 
  FileText, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Plus
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format } from "date-fns";

export default function DashboardPage() {
  const { stats, recentRecords, recentPayments, students, loading } = useDashboardData();

  const kpis = [
    { 
      title: "Total Pages Edited", 
      value: stats.totalPages.toLocaleString(), 
      icon: FileText, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      description: "Across all students"
    },
    { 
      title: "Total Earnings", 
      value: `Rs ${stats.totalEarnings.toLocaleString()}`, 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-50",
      description: "Rs 100 per page"
    },
    { 
      title: "Total Paid", 
      value: `Rs ${stats.totalPaid.toLocaleString()}`, 
      icon: CreditCard, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      description: "Payments received"
    },
    { 
      title: "Remaining Balance", 
      value: `Rs ${stats.remainingBalance.toLocaleString()}`, 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      description: "Pending payments"
    },
  ];

  const pieData = [
    { name: "Paid", value: stats.totalPaid, color: "#9333ea" },
    { name: "Pending", value: stats.remainingBalance, color: "#f97316" },
  ];

  // Mock data for pages per student chart (top 5)
  const chartData = students.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0],
    pages: Math.floor(Math.random() * 100) + 20 // Just for visual demo if no real data
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-slate-500">Track your editing progress and financials at a glance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
              <div className={`${kpi.bg} p-2 rounded-lg`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-slate-500 mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Pages per Student</CardTitle>
            <CardDescription>Page count for top 5 active students.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="pages" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Earnings vs Paid</CardTitle>
            <CardDescription>Financial distribution.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Edits</CardTitle>
              <CardDescription>Latest editing entries.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/records">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{record.studentName || "Student"}</p>
                        <p className="text-xs text-slate-500">{record.pagesEdited} pages edited</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">+Rs {Number(record.pagesEdited) * 100}</p>
                      <p className="text-xs text-slate-400">
                        {record.date ? format(new Date(record.date), "MMM d, yyyy") : "Today"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic py-4">No recent records found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payments received.</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/payments">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 p-2 rounded-lg">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{payment.studentName || "Student"}</p>
                        <p className="text-xs text-slate-500">Payment received</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">Rs {payment.amountPaid}</p>
                      <p className="text-xs text-slate-400">
                        {payment.date ? format(new Date(payment.date), "MMM d, yyyy") : "Today"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic py-4">No recent payments found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
