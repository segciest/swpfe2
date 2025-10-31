// app/layout.tsx

import { ThemeProvider } from './components/ThemeProvider'; // <-- Sửa lại thành đường dẫn tương đối
import Navbar from '@/components/Navbar/Navbar'; // <-- Sửa lại (Bỏ {})
import Footer from '@/components/Footer/Footer'; // <-- Sửa lại (Bỏ {})
import './globals.css';
// ... các import khác của bạn (ví dụ: font chữ)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Đặt Navbar VÀ Footer ở đây */}
          <Navbar /> 
          
          <main>
            {children} {/* Đây là nơi page.tsx sẽ được render */}
          </main>
          
          <Footer />

        </ThemeProvider>
      </body>
    </html>
  );
}