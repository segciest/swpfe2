// app/page.tsx

// KHÔNG CÓ 'use client'; đây là Server Component

import Link from 'next/link';
import { 
    PlusCircle, 
    Star, 
    Car, 
    BatteryCharging,
    CheckCircle,
    Users,
    LifeBuoy,
    Gem
} from 'lucide-react';
import { HomePageListings } from './components/HomePageListings'; 
// === BƯỚC 1: IMPORT SLIDESHOW ===
import { HeroImageSlideshow } from './components/HeroImageSlideshow';
// ==================================

export default function Home() {
  return (
    <div className="bg-slate-900 text-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Chào mừng đến với <span className="text-green-400">EV-Market</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Nền tảng mua bán xe điện và pin số 1 Việt Nam. Kết nối người mua
              và người bán một cách nhanh chóng, an toàn và hiệu quả.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Link
                href="/create-post"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full text-md transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Đăng Tin Ngay</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-full text-md transition-colors"
              >
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Xem Gói Ưu Đãi</span>
              </Link>
            </div>
          </div>
          
          {/* === BƯỚC 2: THAY THẾ ẢNH TĨNH === */}
          <div>
            {/* Xóa <img> cũ và thay bằng component mới */}
            <HeroImageSlideshow />
          </div>
          {/* ================================= */}

        </div>
      </section>

      {/* --- PHÂN CÁCH --- */}
      <hr className="border-t border-slate-700/50" />

      {/* --- 2. DANH MỤC SẢN PHẨM --- */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Danh Mục Sản Phẩm</h2>
          <p className="text-lg text-gray-300 mb-12">Khám phá các sản phẩm xe điện và pin chất lượng cao</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/30 border border-blue-700 p-8 rounded-lg shadow-lg text-center">
              <Car className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-2">Xe Điện</h3>
              <p className="text-gray-300 mb-4">Các dòng xe điện từ phổ thông đến cao cấp</p>
              <p className="text-2xl font-bold text-blue-400 mb-6">1,234+ tin đăng</p>
              <Link
                href="/search?category=xe-dien"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Xem Tất Cả Xe Điện
              </Link>
            </div>
            
            <div className="bg-slate-800/30 border border-green-700 p-8 rounded-lg shadow-lg text-center">
              <BatteryCharging className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-2">Pin Xe Điện</h3>
              <p className="text-gray-300 mb-4">Pin lithium chất lượng cao, bảo hành dài hạn</p>
              <p className="text-2xl font-bold text-green-400 mb-6">567+ tin đăng</p>
              <Link
                href="/search?category=pin"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Xem Tất Cả Pin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHÂN CÁCH --- */}
      <hr className="border-t border-slate-700/50" />

      {/* --- 3. TIN ĐĂNG NỔI BẬT --- */}
      <section className="py-24 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Tin Đăng Mới Nhất</h2>
          
          <HomePageListings />

        </div>
      </section>

      {/* --- PHÂN CÁCH --- */}
      <hr className="border-t border-slate-700/50" />

      {/* --- 4. STATS SECTION --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-green-400 mb-2">2,500+</p>
              <p className="text-lg text-gray-300">Tin Đăng</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white mb-2">1,200+</p>
              <p className="text-lg text-gray-300">Người Dùng</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-white mb-2">850+</p>
              <p className="text-lg text-gray-300">Giao Dịch</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-green-400 mb-2">98%</p>
              <p className="text-lg text-gray-300">Hài Lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PHÂN CÁCH --- */}
      <hr className="border-t border-slate-700/50" />

      {/* --- 5. CALL TO ACTION (CTA) --- */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Bắt Đầu Đăng Tin Ngay Hôm Nay!</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Tiếp cận hàng nghìn khách hàng tiềm năng với các gói ưu đãi đặc biệt.
            Nền tảng minh bạch, an toàn và dễ sử dụng.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-lg mb-10">
            <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Đăng tin miễn phí</span>
            <span className="flex items-center gap-2"><Users className="w-5 h-5 text-green-400" /> Tiếp cận rộng rãi</span>
            <span className="flex items-center gap-2"><LifeBuoy className="w-5 h-5 text-green-400" /> Hỗ trợ 24/7</span>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="/create-post"
              className="flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-full text-md transition-colors hover:bg-green-600"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Đăng Tin Miễn Phí</span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-full text-md transition-colors"
            >
              <Gem className="w-5 h-5" />
              <span>Nâng Cấp VIP</span>
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}