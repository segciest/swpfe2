'use client'; 

import { useState, useEffect } from 'react'; // Mang logic state vào đây
import Link from 'next/link';
import Image from 'next/image'; // Cần Image cho slideshow nền
// Import "tab nhỏ" (file bạn đã có)
import { HeroImageSlideshow } from '@/app/components/HeroImageSlideshow'; 
// Import list tin đăng
import { HomePageListings } from '@/app/components/HomePageListings'; 
import { CheckCircle, Zap, ShieldCheck, Truck } from 'lucide-react';

// Danh sách ảnh (phải giống hệt file slideshow)
const images = [
  '/images/intro1.jpg',
  '/images/intro2.jpg',
  '/images/intro3.jpg',
  '/images/intro4.jpg',
  '/images/intro5.jpg',
  '/images/intro6.jpg',
];

export default function Home() {
  // Toàn bộ logic state nằm ở đây (parent component)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5 giây
    return () => clearInterval(interval);
  }, []);

  // Các hàm điều khiển (sẽ được truyền xuống cho cả 2 slideshow)
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="w-full">
      {/* --- PHẦN HERO --- */}
      <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden"> 
        
        {/* SLIDESHOW NỀN (XÓA PHÔNG) */}
        <div className="absolute inset-0 z-0">
          {images.map((src, index) => (
            <Image
              key={`bg-${src}`}
              src={src}
              alt="Ảnh nền"
              fill
              className={`
                absolute top-0 left-0 w-full h-full object-cover 
                transition-all duration-1500 ease-in-out 
                transform filter blur-sm scale-110
                ${index === currentIndex ? 'opacity-100' : 'opacity-0'}
              `}
              priority={index === 0}
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/1920x1080/334155/e2e8f0?text=BG'; }}
            />
          ))}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* HỘP NỘI DUNG VÀ "TAB NHỎ" */}
        <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Hộp thông tin bên trái */}
            <div className="bg-yellow-500/80 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-yellow-600">
              <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
                Đăng tin bán xe điện cũ và pin
              </h1>
              <p className="text-lg text-gray-900 mb-8">
                Nền tảng mua bán xe điện và phụ tùng uy tín hàng đầu Việt Nam. 
                Kết nối người mua và người bán một cách nhanh chóng, an toàn và hiệu quả.
              </p>
              <div className="grid grid-cols-2 gap-4 text-gray-900 font-medium mb-8">
                 <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-800" /><span>Đảm bảo chất lượng</span></div>
                 <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-green-800" /><span>Hỗ trợ 24/7</span></div>
                 <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-800" /><span>Giá cả hợp lý</span></div>
                 <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-green-800" /><span>Giao hàng toàn quốc</span></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Link href="/listings/create" className="flex-1 text-center bg-gray-900 text-white font-bold px-6 py-3 rounded-full text-md transition-colors hover:bg-gray-700">
                   Đăng tin ngay
                 </Link>
                 <div className="relative flex-1">
                   <Link href="/subscription" className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full text-md transition-colors">
                     Các gói ưu đãi
                   </Link>
                   <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full rotate-12">
                     HOT
                   </span>
                 </div>
              </div>
            </div>

            {/* "TAB NHỎ" (SLIDESHOW BÊN PHẢI) */}
            <div className="relative w-full h-[350px]"> 
              <HeroImageSlideshow 
                currentIndex={currentIndex}
                goToSlide={goToSlide}
                prevSlide={prevSlide}
                nextSlide={nextSlide}
              />
            </div>

          </div>
        </div>
      </section>

      {/* --- PHẦN TIN ĐĂNG NỔI BẬT (CHỈ 1 LẦN) --- */}
      <section className="bg-white py-24">
          <div className="container mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Tin đăng nổi bật</h2>
              {/* Chỉ gọi 1 LẦN ở đây */}
              <HomePageListings />
          </div>
      </section>
    </div>
  );
}

