'use client';

import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

interface DownloadCertificateProps {
  courseTitle: string;
  studentName: string;
  date: string;
  score: string;
}

export function DownloadCertificate({ courseTitle, studentName, date, score }: DownloadCertificateProps) {
  const handleDownload = () => {
    // Create a new PDF document, landscape orientation
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // --- Background & Border ---
    // Fill background with a very light cream/off-white
    doc.setFillColor(255, 252, 245);
    doc.rect(0, 0, 297, 210, "F");

    // Add an ornamental border
    doc.setLineWidth(2);
    doc.setDrawColor(218, 165, 32); // Golden
    doc.rect(10, 10, 277, 190);
    
    // Inner thinner border
    doc.setLineWidth(0.5);
    doc.setDrawColor(218, 165, 32);
    doc.rect(15, 15, 267, 180);

    // --- Header Section ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(44, 62, 80); // Dark Blue/Grey
    doc.text("CERTIFICATE OF ELIGIBILITY", 148.5, 50, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", 148.5, 70, { align: "center" });

    // --- Student Name ---
    // Use a standout font styling for the name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(36);
    doc.setTextColor(218, 165, 32); // Gold for the name
    doc.text(studentName, 148.5, 90, { align: "center" });

    // --- Body Text ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    
    const text1 = "Has successfully passed the eligibility assessment for the course:";
    doc.text(text1, 148.5, 110, { align: "center" });

    // --- Course Title ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text(courseTitle, 148.5, 125, { align: "center" });

    // --- Score & Date Details ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`With a score of ${score}`, 148.5, 140, { align: "center" });
    
    // --- Signatures / Footer ---
    doc.setLineWidth(0.5);
    doc.setDrawColor(100, 100, 100);
    doc.line(70, 175, 130, 175); // Left Line
    doc.line(170, 175, 230, 175); // Right Line

    doc.setFontSize(12);
    doc.text("Date", 100, 182, { align: "center" });
    doc.text("Director of Education", 200, 182, { align: "center" });

    // Fill in the actual date text above the line
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.text(date, 100, 172, { align: "center" });
    doc.text("EduQualify Team", 200, 172, { align: "center" });

    // --- Branding ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text("EduQualify", 148.5, 30, { align: "center" });

    // Save
    doc.save(`${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
  };

  return (
    <Button 
      variant="outline" 
      className="w-full border-slate-200 hover:border-emerald-500 hover:text-emerald-600 group-hover:bg-emerald-50 dark:border-slate-700 dark:hover:border-emerald-800 dark:group-hover:bg-emerald-900/20 transition-all font-medium"
      onClick={handleDownload}
    >
      Download Certificate
    </Button>
  );
}
