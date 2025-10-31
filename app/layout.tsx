// app/layout.tsx
'use client'; 

import "./globals.css";
// Đảm bảo đường dẫn import Navbar và Footer đúng với vị trí thực tế
import Navbar from "@/components/Navbar/Navbar"; // Navbar ở thư mục gốc components/
import Footer from "@/components/Footer/Footer"; // Footer ở thư mục gốc components/
// KHÔNG CẦN ThemeProvider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Đây là cái "khung" của trang web
    <html lang="vi"> 
      {/* Đặt nền trắng mặc định cho body */}
      <body className="bg-white text-gray-900"> 
          {/* Navbar phải được gọi ở đây */}
          <Navbar />
          
          {/* <main> chứa nội dung (chính là file app/page.tsx của bạn) */}
          <main>
            {children}
          </main>
          
          {/* Footer phải được gọi ở đây */}
          <Footer />
      </body>
    </html>
  );
}

