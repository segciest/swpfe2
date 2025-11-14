"use client";

import "./globals.css";
import "@/lib/fontawesome";
import Navbar from "@/components/Navbar/Navbar";
import Banner from "@/components/Banner/Banner";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Ẩn navbar nếu pathname nằm trong nhóm (auth)
  const isAuthPage = pathname.startsWith("/login-register") || pathname.startsWith("/(auth)");
  
  // Chỉ hiển thị banner ở trang chủ
  const isHomePage = pathname === "/";

  return (
    <html lang="vi">
      <body className="bg-gray-50">
        {!isAuthPage && <Navbar />} {/* chỉ hiển thị khi không ở (auth) */}
        {!isAuthPage && isHomePage && <Banner />} {/* Chỉ hiển thị Banner ở trang chủ */}
        <main>{children}</main>
      </body>
    </html>
  );
}
