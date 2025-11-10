"use client";

import "./globals.css";
import "@/lib/fontawesome";
import Navbar from "@/components/Navbar/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Ẩn navbar nếu pathname nằm trong nhóm (auth)
  const isAuthPage = pathname.startsWith("/login-register") || pathname.startsWith("/(auth)");

  return (
    <html lang="vi">
      <body className="bg-gray-50">
        {!isAuthPage && <Navbar />} {/* chỉ hiển thị khi không ở (auth) */}
        <main>{children}</main>
      </body>
    </html>
  );
}
