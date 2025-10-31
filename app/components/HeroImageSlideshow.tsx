// app/components/HeroImageSlideshow.tsx

'use client'; 

// BƯỚC 1: Xóa useState, useEffect
// import { useState, useEffect } from 'react'; 
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icon mũi tên

// Danh sách ảnh (giữ nguyên)
const images = [
  '/images/intro1.jpg',
  '/images/intro2.jpg',
  '/images/intro3.jpg',
  '/images/intro4.jpg',
  '/images/intro5.jpg',
  '/images/intro6.jpg',
];

// BƯỚC 2: Định nghĩa props mà component này sẽ nhận
interface HeroSlideshowProps {
  currentIndex: number;
  goToSlide: (index: number) => void;
  prevSlide: () => void;
  nextSlide: () => void;
}

// BƯỚC 3: Nhận props từ cha (từ app/page.tsx)
export function HeroImageSlideshow({ 
  currentIndex, 
  goToSlide, 
  prevSlide, 
  nextSlide 
}: HeroSlideshowProps) {

  // BƯỚC 4: Toàn bộ logic (useState, useEffect) đã được xóa khỏi đây

  return (
    // Container (Thêm bo tròn, bóng, viền như trong video)
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10 backdrop-blur-sm">
      
      {/* Render các ảnh (Logic fade/scale giữ nguyên) */}
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Ảnh giới thiệu ${index + 1}`}
          fill 
          className={`
            absolute top-0 left-0 w-full h-full
            object-cover 
            transition-all duration-1500 ease-in-out /* Hiệu ứng 1.5 giây */
            transform
            ${index === currentIndex 
              ? 'opacity-100 scale-100' // Ảnh hiện tại
              : 'opacity-0 scale-110'   // Ảnh ẩn (tạo hiệu ứng zoom)
            }
          `}
          priority={index === 0} 
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/1920x1080/334155/e2e8f0?text=Image+Not+Found'; }}
        />
      ))}

      {/* 5. NÚT ĐIỀU HƯỚNG BÊN TRÁI (Sử dụng prop) */}
      <button
        onClick={prevSlide} // <-- Dùng prop từ cha
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition"
        aria-label="Ảnh trước"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* 6. NÚT ĐIỀU HƯỚNG BÊN PHẢI (Sử dụng prop) */}
      <button
        onClick={nextSlide} // <-- Dùng prop từ cha
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition"
        aria-label="Ảnh kế tiếp"
      >
        <ChevronRight size={24} />
      </button>

      {/* 7. Dấu chấm điều hướng (Sử dụng prop) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)} // <-- Dùng prop từ cha
            className={`
              w-3 h-3 rounded-full 
              transition-all duration-300
              ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}
              hover:bg-white
            `}
            aria-label={`Chuyển đến ảnh ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

