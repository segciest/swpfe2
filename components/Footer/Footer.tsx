// components/Footer/Footer.tsx
import Link from 'next/link';
import React from 'react';
import { Bolt } from 'lucide-react'; // Import icon logo

const Footer = () => {
  return (
    // SỬA MÀU: Đổi sang dải màu gradient
    <footer className="bg-gradient-to-r from-yellow-300 to-yellow-600 text-gray-900 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Cột 1: Logo và Mô tả */}
          <div>
            {/* Thêm logo giống Navbar */}
            <div className="flex items-center gap-2 mb-4">
              <Bolt className="w-8 h-8 text-green-800" />
              <span className="text-2xl font-bold text-green-900">EV-Market</span>
            </div>
            <p className="text-gray-800">
              Nền tảng mua bán xe điện xanh và pin xe điện đã qua sử dụng
              hàng đầu Việt Nam. Kết nối người mua và người bán một cách tin
              cậy và hiệu quả.
            </p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li><Link href="/mua-xe" className="hover:underline text-gray-800 hover:text-black">Mua xe điện cũ</Link></li>
              <li><Link href="/ban-xe" className="hover:underline text-gray-800 hover:text-black">Đăng tin bán xe</Link></li>
              <li><Link href="/mua-pin" className="hover:underline text-gray-800 hover:text-black">Mua pin xe điện</Link></li>
              <li><Link href="/bao-hiem" className="hover:underline text-gray-800 hover:text-black">Bảo hiểm xe điện</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="/huong-dan" className="hover:underline text-gray-800 hover:text-black">Hướng dẫn đăng tin</Link></li>
              <li><Link href="/chinh-sach" className="hover:underline text-gray-800 hover:text-black">Chính sách bảo mật</Link></li>
              <li><Link href="/dieu-khoan" className="hover:underline text-gray-800 hover:text-black">Điều khoản sử dụng</Link></li>
              <li><Link href="/cau-hoi" className="hover:underline text-gray-800 hover:text-black">Câu hỏi thường gặp</Link></li>
              <li><Link href="/lien-he-ho-tro" className="hover:underline text-gray-800 hover:text-black">Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-center">
                <span>1900 1234 (24/7)</span>
              </li>
              <li className="flex items-center">
                <span>support@ecobike.vn</span>
              </li>
              <li className="flex items-center">
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng Copyright ở cuối (Sửa màu viền) */}
        <div className="border-t border-gray-900/30 pt-8 text-center text-gray-800">
          <p>&copy; {new Date().getFullYear()} EV-Market. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

