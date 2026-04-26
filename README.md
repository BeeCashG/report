# EditTrack - Consultancy Editor Dashboard

A modern, scalable web application for consultancy editors to track student page editing work, manage payments, and handle PDF files.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database/Storage**: Firebase (Firestore & Storage)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Exports**: XLSX (Excel) & jsPDF (PDF)

## Core Features
- **Dashboard**: KPI cards for earnings, pages, and payments. Charts for pages per student and earnings distribution.
- **Student Management**: CRUD operations for students. Detailed student profiles with full history.
- **Editing Records**: Track pages edited per student. Auto-calculates earnings at **Rs 100 per page**.
- **PDF Management**: Upload, preview, and download edited PDFs for each record.
- **Payment Tracking**: Record and monitor student payments and pending balances.
- **Reports**: Bulk export to Excel and professional PDF report generation per student.

## Setup Instructions

### 1. Clone and Install
```bash
npm install
```

### 2. Firebase Configuration
Create a `.env.local` file in the root directory and add your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Firebase Setup
1. **Firestore**: Enable Firestore in your Firebase console. Create collections: `students`, `pageRecords`, and `payments`.
2. **Storage**: Enable Firebase Storage.
3. **Rules**: Ensure your security rules allow read/write access (or configure Auth if needed).

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Structure
- **Students**: name, projectTitle, contact, createdAt.
- **PageRecords**: studentId, studentName, date, pagesEdited, notes, pdfUrl, pdfName, createdAt.
- **Payments**: studentId, studentName, amountPaid, date, notes, createdAt.

## Business Logic
- **Earnings** = Total Pages Edited × Rs 100.
- **Remaining Balance** = Total Earnings − Total Paid.
