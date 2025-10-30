// app/subscription/page.tsx
"use client"; // BƯỚC 1: Chuyển thành Client Component

import { CheckCircle, Package, Star, Gem } from 'lucide-react';
// import Link from 'next/link'; // Không cần Link nữa
import { useRouter } from 'next/navigation'; // BƯỚC 2: Import hooks
import { useEffect, useState } from 'react';

// Dữ liệu (không thay đổi)
const pricingPlans = [
  {
    name: 'Basic',
    price: '50.000đ',
    description: '30 tin / 7 ngày',
    features: [
      '30 tin đăng không giới hạn',
      'Thời hạn 7 ngày mỗi tin',
      'Hiển thị thông thường',
      'Hỗ trợ cơ bản',
      'Quản lý tin đăng đơn giản',
    ],
    icon: Package,
    buttonText: 'Mua Ngay Basic',
    href: '/checkout/basic',
    isPopular: false,
    accentColor: 'text-pink-500',
    borderColor: 'border-pink-500',
    buttonClasses: 'bg-pink-600 hover:bg-pink-700 text-white',
  },
  {
    name: 'Premium',
    price: '150.000đ',
    description: '60 tin / 14 ngày',
    features: [
      '60 tin đăng không giới hạn',
      'Thời hạn 14 ngày mỗi tin',
      'Hiển thị nổi bật ưu tiên',
      'Hỗ trợ khách hàng ưu tiên',
      'Badge "Tin Premium"',
      'Thống kê xem tin chi tiết',
    ],
    icon: Star,
    buttonText: 'Mua Ngay Premium',
    href: '/checkout/premium',
    isPopular: true, 
    accentColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
    buttonClasses: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
  },
  {
    name: 'VIP',
    price: '200.000đ',
    description: '90 tin / 30 ngày',
    features: [
      '90 tin đăng không giới hạn',
      'Thời hạn 30 ngày mỗi tin',
      'Hiển thị đầu trang luôn',
      'Hỗ trợ VIP 24/7',
      'Quảng cáo trên trang chủ',
      'Badge "Tin VIP"',
      'Thống kê chi tiết & báo cáo',
      'Tư vấn bán hàng chuyên nghiệp',
    ],
    icon: Gem,
    buttonText: 'Mua Ngay VIP',
    href: '/checkout/vip',
    isPopular: false,
    accentColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    buttonClasses: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
];

export default function PricingPage() {
  // BƯỚC 2 (tiếp): Khởi tạo state và router
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra đăng nhập khi component được tải
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setIsLoggedIn(true);
    }
  }, []); // Chạy 1 lần sau khi render

  // BƯỚC 3: Hàm xử lý click
  const handleCheckoutClick = (checkoutHref: string) => {
    if (isLoggedIn) {
      // 1. Nếu đã đăng nhập, đi tới trang thanh toán
      router.push(checkoutHref);
    } else {
      // 2. Nếu chưa đăng nhập, chuyển hướng về trang login
      router.push('/login-register'); 
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-slate-900">
      <section className="container mx-auto px-6 py-24">
        
        {/* --- Tiêu đề --- */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Bảng Giá Dịch Vụ
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Lựa chọn gói dịch vụ đăng tin phù hợp với nhu cầu của bạn. 
            Tất cả các gói đều bao gồm các tính năng cơ bản để đảm bảo tin đăng hiệu quả.
          </p>
        </div>

        {/* --- Lưới chứa các gói --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
          
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2
                transition-all duration-300
                ${plan.isPopular 
                  ? 'scale-105'
                  : 'hover:shadow-xl'
                }
                ${plan.borderColor}
              `}
            >
              {/* --- Tag "Phổ biến nhất" --- */}
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="bg-yellow-500 text-gray-900 text-sm font-bold px-6 py-2 rounded-full uppercase shadow-lg">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              {/* Lớp bọc nội dung */}
              <div className="relative h-full flex flex-col overflow-hidden rounded-2xl">
                <div className="p-8 flex flex-col h-full">
                  {/* --- Tiêu đề Thẻ --- */}
                  <div className="flex-shrink-0">
                    <plan.icon className={`w-10 h-10 mb-4 ${plan.accentColor}`} />
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                  </div>
                  
                  {/* --- Giá --- */}
                  <div className="flex-shrink-0 my-4">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400"> / gói</span>
                  </div>

                  <hr className="border-gray-200 dark:border-slate-700 my-6" />

                  {/* --- Danh sách Tính năng --- */}
                  <ul className="space-y-4 text-gray-600 dark:text-gray-300 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* BƯỚC 3 (tiếp): Thay <Link> bằng <button> và dùng onClick */}
                  <div className="flex-shrink-0 mt-8 
                                  opacity-0 group-hover:opacity-100 
                                  transform translate-y-4 group-hover:translate-y-0 
                                  transition-all duration-300 ease-in-out">
                    <button
                      onClick={() => handleCheckoutClick(plan.href)}
                      className={`
                        block w-full text-center px-6 py-4 rounded-lg font-bold text-lg
                        transition-colors cursor-pointer
                        ${plan.buttonClasses}
                      `}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}