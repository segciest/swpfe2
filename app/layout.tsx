import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
