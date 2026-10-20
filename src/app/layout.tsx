import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "@/components/Toast";
import { RoleModal } from "@/components/RoleModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SBM Hospitals & MNSRI Digital Platform | Maharajganj-Raebareli",
  description:
    "Integrated clinical healthcare and neuroscience research platform serving Maharajganj & Raebareli, UP. Clinical EMR, AMMA Digital Clinics, Acute Stroke Care, and Neuroscience Research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4F8FA] text-[#1E293B] selection:bg-teal-100 selection:text-teal-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ToastContainer />
          <RoleModal />
        </AppProvider>
      </body>
    </html>
  );
}
