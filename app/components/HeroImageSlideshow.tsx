// app/components/HeroImageSlideshow.tsx

'use client'; // Bắt buộc, vì chúng ta dùng useState và useEffect

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 1. Khai báo danh sách ảnh
// (Hãy đảm bảo tên file và đuôi file (.jpg, .png) chính xác)
const images = [
  '/images/intro1.jpg',
  '/images/intro2.jpg',
  '/images/intro3.jpg',
  '/images/intro4.jpg',
];

export function HeroImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Logic tự động chuyển ảnh
  useEffect(() => {
    // Đặt thời gian chuyển ảnh (ví dụ: 5000ms = 5 giây)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % images.length // Quay vòng lại ảnh đầu tiên
      );
    }, 5000); 

    // Dọn dẹp timer khi component bị xóa
    return () => clearInterval(interval);
  }, []);

  // 3. Hàm mới để xử lý khi nhấp vào dấu chấm
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    // 4. Container cho slideshow
    <div className="relative w-full aspect-[4/3] rounded-lg shadow-2xl overflow-hidden">
      
      {/* 5. Render các ảnh */}
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Ảnh giới thiệu ${index + 1}`}
          fill // 'fill' sẽ làm ảnh lấp đầy container
          className={`
            absolute top-0 left-0 w-full h-full
            object-cover // Đảm bảo ảnh che phủ, không bị méo
            transition-opacity duration-1000 ease-in-out // Hiệu ứng mờ dần 1 giây
            ${index === currentIndex ? 'opacity-100' : 'opacity-0'} // Chỉ hiển thị ảnh hiện tại
          `}
          // Ưu tiên tải ảnh đầu tiên để không bị FOUC
          priority={index === 0} 
        />
      ))}

      {/* === BƯỚC 6: THÊM DẤU CHẤM CHUYỂN ẢNH === */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)} // <-- Thêm sự kiện click
            className={`
              w-3 h-3 rounded-full 
              transition-all duration-300
              ${index === currentIndex ? 'bg-white scale-110' : 'bg-white/50'}
              hover:bg-white
            `}
            aria-label={`Chuyển đến ảnh ${index + 1}`}
          />
        ))}
      </div>
      {/* ========================================= */}

    </div>
  );
}