// app/subscription/page.tsx
"use client";

import { CheckCircle, Package, Star, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Dữ liệu gói (đã thêm 'id' và 'priceValue')
const pricingPlans = [
  {
    id: 2, // <-- ID gói (dùng làm subId)
    name: 'Basic',
    price: '50.000đ',
    priceValue: 50000, // <-- Giá trị số (để gửi đi)
    description: '30 tin / 7 ngày',
    features: [
      '30 tin đăng không giới hạn',
      'Thời hạn 7 ngày mỗi tin',
      'Hiển thị thông thường',
      'Hỗ trợ cơ bản',
    ],
    icon: Package,
    buttonText: 'Mua Ngay Basic',
    isPopular: false,
    accentColor: 'text-pink-500',
    borderColor: 'border-pink-500',
    buttonClasses: 'bg-pink-600 hover:bg-pink-700 text-white',
  },
  {
    id: 3, // <-- ID gói
    name: 'Premium',
    price: '150.000đ',
    priceValue: 150000, // <-- Giá trị số
    description: '60 tin / 14 ngày',
    features: [
      '60 tin đăng không giới hạn',
      'Thời hạn 14 ngày mỗi tin',
      'Hiển thị nổi bật ưu tiên',
      'Hỗ trợ khách hàng ưu tiên',
      'Badge "Tin Premium"',
    ],
    icon: Star,
    buttonText: 'Mua Ngay Premium',
    isPopular: true,
    accentColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
    buttonClasses: 'bg-yellow-500 hover:bg-yellow-600 text-gray-900',
  },
  {
    id: 4, // <-- ID gói
    name: 'VIP',
    price: '200.000đ',
    priceValue: 200000, // <-- Giá trị số
    description: '90 tin / 30 ngày',
    features: [
      '90 tin đăng không giới hạn',
      'Thời hạn 30 ngày mỗi tin',
      'Hiển thị đầu trang luôn',
      'Hỗ trợ VIP 24/7',
      'Quảng cáo trên trang chủ',
      'Badge "Tin VIP"',
    ],
    icon: Gem,
    buttonText: 'Mua Ngay VIP',
    isPopular: false,
    accentColor: 'text-blue-500',
    borderColor: 'border-blue-500',
    buttonClasses: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
];

// Định nghĩa kiểu dữ liệu cho plan
type Plan = typeof pricingPlans[0];

export default function PricingPage() {
  const router = useRouter();
  // (1) Mặc định, state isLoggedIn là 'false' (chưa đăng nhập)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // (2) Khi trang tải, hàm này chạy 1 lần
  useEffect(() => {
    // Nó tìm trong localStorage một key tên là "userData"
    const storedUserData = localStorage.getItem("userData");
    
    if (storedUserData) {
      // Nếu tìm thấy, nó mới set isLoggedIn = true
      setIsLoggedIn(true);
    }
    // Nếu không tìm thấy, isLoggedIn vẫn là 'false' như mặc định
  }, []); // Mảng rỗng nghĩa là chỉ chạy 1 lần khi trang tải

  // (3) Hàm xử lý khi nhấn nút "Mua Ngay"
  const handleCheckoutClick = (plan: Plan) => {
    // (4) Nó kiểm tra state isLoggedIn
    if (isLoggedIn) {
      // đọc userData từ localStorage để kiểm tra gói hiện tại
      const stored = localStorage.getItem("userData");
      const user: any = stored ? JSON.parse(stored) : null;

      // helper: lấy tên gói hiện tại nếu có
      const getCurrentPlanName = (u: any) => {
        if (!u) return null;
        return (
          u.subName ||
          u.subscriptionName ||
          u.subscription?.subName ||
          u.sub?.subName ||
          u.subid?.subName ||
          u.subscriptionId?.subName ||
          null
        );
      };

      const currentPlanName = getCurrentPlanName(user);

      // Nếu biết user đang ở gói Free (tên chứa 'free') --> không báo, cho proceed
      const isFree = currentPlanName ? /free/i.test(currentPlanName) : false;

      // Nếu user có gói (khác null) và không phải Free => hiển thị confirm
      if (currentPlanName && !isFree) {
        const proceed = window.confirm(
          `Bạn đang có gói "${currentPlanName}". Nếu mua gói mới thì gói cũ sẽ biến mất. Bạn có muốn tiếp tục?`
        );
        if (!proceed) return;
      }

      // Nếu không có currentPlanName (không biết) hoặc user xác nhận, tiếp tục checkout
      const checkoutUrl = `/payment/checkout?subId=${plan.id}&price=${plan.priceValue}&name=${encodeURIComponent(plan.name)}`;
      router.push(checkoutUrl);
    } else {
      // Chưa đăng nhập -> Chuyển về trang login
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
          </p>
        </div>

        {/* --- Lưới chứa các gói --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
          
          {pricingPlans.map((plan) => (
            <div
              key={plan.id} // Dùng key duy nhất
              className={`
                relative group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2
                transition-all duration-300
                ${plan.isPopular ? 'scale-105' : 'hover:shadow-xl'}
                ${plan.borderColor}
              `}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="bg-yellow-500 text-gray-900 text-sm font-bold px-6 py-2 rounded-full uppercase shadow-lg">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              <div className="relative h-full flex flex-col overflow-hidden rounded-2xl">
                <div className="p-8 flex flex-col h-full">
                  <div className="flex-shrink-0">
                    <plan.icon className={`w-10 h-10 mb-4 ${plan.accentColor}`} />
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 my-4">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400"> / gói</span>
                  </div>

                  <hr className="border-gray-200 dark:border-slate-700 my-6" />

                  <ul className="space-y-4 text-gray-600 dark:text-gray-300 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Nút Mua Ngay */}
                  <div className="flex-shrink-0 mt-8">
                    <button
                      // (5) Nút này gọi hàm xử lý ở trên
                      onClick={() => handleCheckoutClick(plan)}
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