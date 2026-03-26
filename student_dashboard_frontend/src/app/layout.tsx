import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduConnect",
  description:
    "EduConnect — a student and educator dashboard for courses, assignments, grades, and announcements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
