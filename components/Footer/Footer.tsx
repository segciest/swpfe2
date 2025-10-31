// app/components/Footer/Footer.tsx
import Link from 'next/link';
import React from 'react';
// Bạn có thể cần import icons từ một thư viện như 'lucide-react'
// import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a3a3a] text-white pt-16 pb-8"> {/* Màu xanh đậm giống video */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Cột 1: EcoBike Market */}
          <div>
            <h2 className="text-2xl font-bold mb-4">EcoBike Market</h2>
            <p className="text-gray-300">
              Nền tảng mua bán xe điện xanh và pin xe điện đã qua sử dụng
              hàng đầu Việt Nam. Kết nối người mua và người bán một cách tin
              cậy và hiệu quả.
            </p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li><Link href="/mua-xe" className="hover:underline">Mua xe điện cũ</Link></li>
              <li><Link href="/ban-xe" className="hover:underline">Đăng tin bán xe</Link></li>
              <li><Link href="/mua-pin" className="hover:underline">Mua pin xe điện</Link></li>
              <li><Link href="/bao-hiem" className="hover:underline">Bảo hiểm xe điện</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="/huong-dan" className="hover:underline">Hướng dẫn đăng tin</Link></li>
              <li><Link href="/chinh-sach" className="hover:underline">Chính sách bảo mật</Link></li>
              <li><Link href="/dieu-khoan" className="hover:underline">Điều khoản sử dụng</Link></li>
              <li><Link href="/cau-hoi" className="hover:underline">Câu hỏi thường gặp</Link></li>
              <li><Link href="/lien-he-ho-tro" className="hover:underline">Liên hệ hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                {/* <Phone size={18} className="mr-2" /> */}
                <span>1900 1234 (24/7)</span>
              </li>
              <li className="flex items-center">
                {/* <Mail size={18} className="mr-2" /> */}
                <span>support@ecobike.vn</span>
              </li>
              <li className="flex items-center">
                {/* <MapPin size={18} className="mr-2" /> */}
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
            </ul>
            {/* Thêm các icon thanh toán/mạng xã hội ở đây nếu cần */}
          </div>
        </div>

        {/* Dòng Copyright ở cuối */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EcoBike Market. Đã đăng ký bản quyền.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;