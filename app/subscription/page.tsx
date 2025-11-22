// app/subscription/page.tsx
"use client";

import { CheckCircle, Package, Star, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SubscriptionBanner from '@/components/Banner/SubscriptionBanner';
import { getSubscriptions } from '@/utils/api';

// Định nghĩa kiểu dữ liệu cho plan (gộp từ dữ liệu BE)
type Plan = {
  id: number; // subId
  name: string; // subName
  price: string; // formatted price string for display (e.g. "50.000đ")
  priceValue: number; // numeric price to send to backend (VNĐ)
  description?: string; // subDetails or derived description
  features: string[];
  icon: any;
  buttonText: string;
  isPopular?: boolean;
  accentColor?: string;
  borderColor?: string;
  buttonClasses?: string;
};

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
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

  // Load subscriptions from backend and map to UI plan structure
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const subs: any[] = await getSubscriptions();
        if (!mounted || !Array.isArray(subs)) return;

        const icons = [Package, Star, Gem, Package, Star];

        const mapped: Plan[] = subs
          // filter out free packages: either subPrice == 0 or name contains 'free'
          .filter((s) => {
            const priceNum = Number(s.subPrice ?? 0);
            const name = (s.subName || '').toString();
            return priceNum > 0 && !/free/i.test(name);
          })
          .map((s, idx) => {
            const priceNum = Number(s.subPrice ?? 0);
            const priceDisplay = priceNum ? priceNum.toLocaleString('vi-VN') + 'đ' : '0đ';

            const details = s.subDetails || '';
            const features = details
              ? details.split(/\n|\r|,|;|\.|\|/).map((t: string) => t.trim()).filter(Boolean)
              : [`${s.duration || ''} ngày`, 'Hỗ trợ cơ bản'];

            return {
              id: Number(s.subId),
              name: s.subName || `Gói ${s.subId}`,
              price: priceDisplay,
              priceValue: priceNum,
              description: s.subDetails || `${s.duration || ''} ngày`,
              features,
              icon: icons[idx % icons.length] || Package,
              buttonText: `Mua Ngay ${s.subName || ''}`,
              isPopular: !!s.priorityLevel,
              accentColor: idx === 1 ? 'text-yellow-500' : idx === 2 ? 'text-blue-500' : 'text-pink-500',
              borderColor: idx === 1 ? 'border-yellow-500' : idx === 2 ? 'border-blue-500' : 'border-pink-500',
              buttonClasses: idx === 1 ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : idx === 2 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white',
            };
          });

        setPlans(mapped);
      } catch (err) {
        // silently fail: keep static UI if needed
        console.error('Failed to load subscriptions', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
    <div className="bg-white min-h-screen">
      {/* Banner chuyên dụng cho trang Subscription */}
      <SubscriptionBanner />
      
      <section className="container mx-auto px-6 py-24">
        
        {/* --- Tiêu đề --- */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bảng Giá Dịch Vụ
          </h1>
          <p className="text-lg text-gray-600">
            Lựa chọn gói dịch vụ đăng tin phù hợp với nhu cầu của bạn.
          </p>
        </div>

        {/* --- Lưới chứa các gói --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
          
          {plans.map((plan: Plan, idx: number) => (
            <div
              key={plan.id} // Dùng key duy nhất
              className={
                `relative group rounded-2xl shadow-lg border-2 transition-all duration-300 ` +
                // center card slightly larger
                `${idx === Math.floor(plans.length/2) ? 'scale-105' : 'hover:shadow-xl'} ` +
                // border color fallback
                `${plan.borderColor || (idx === 1 ? 'border-yellow-500' : idx === 2 ? 'border-blue-500' : 'border-pink-500')} ` +
                // subtle themed background per index
                `${idx === 0 ? 'bg-gradient-to-b from-pink-50 to-pink-100' : idx === 1 ? 'bg-gradient-to-b from-yellow-50 to-yellow-100' : 'bg-gradient-to-b from-blue-50 to-blue-100'}`
              }
            >
              {/* Show 'Phổ biến nhất' only on the center card */}
              {idx === Math.floor(plans.length/2) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="bg-yellow-500 text-gray-900 text-sm font-bold px-6 py-2 rounded-full uppercase shadow-lg">
                    Phổ biến nhất
                  </span>
                </div>
              )}

              <div className="relative h-full flex flex-col overflow-hidden rounded-2xl">
                <div className="p-8 flex flex-col h-full">
                  <div className="flex-shrink-0">
                    <plan.icon className={`w-10 h-10 mb-4 ${plan.accentColor || (idx === 1 ? 'text-yellow-500' : idx === 2 ? 'text-blue-500' : 'text-pink-500')}`} />
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {plan.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 my-4">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500"> / gói</span>
                  </div>

                  <hr className="border-gray-200 my-6" />

                  <ul className="space-y-4 text-gray-600 flex-grow">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Nút Mua Ngay */}
                  <div className="flex-shrink-0 mt-8">
                    <button
                      onClick={() => handleCheckoutClick(plan)}
                      className={`block w-full text-center px-6 py-4 rounded-lg font-bold text-lg transition-colors cursor-pointer ` +
                        // prefer plan.buttonClasses if provided, otherwise choose themed button
                        `${plan.buttonClasses || (idx === 1 ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : idx === 2 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-pink-600 hover:bg-pink-700 text-white')}`
                      }
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