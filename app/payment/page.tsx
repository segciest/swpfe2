'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { createVNPayPayment, cancelPayment } from '@/utils/api'; // (Không cần, chúng ta sẽ gọi API trực tiếp)
import { CreditCard, AlertTriangle, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

/**
 * Component nội dung chính, phải bọc trong <Suspense>
 */
function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  // const [pendingPaymentModal, setPendingPaymentModal] = useState<any>(null); // (Tạm ẩn logic phức tạp)

  // 1. Lấy thông tin gói từ URL
  const subId = searchParams.get('subId');
  const price = searchParams.get('price');
  const name = searchParams.get('name');

  // 2. Lấy thông tin user từ localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const data = JSON.parse(storedUserData);
      setUser(data); // Lưu toàn bộ data user
    } else {
      // Nếu chưa đăng nhập, đá về trang login
      router.push('/login-register');
    }
    setAuthChecked(true);
  }, [router]);

  /**
   * 3. HÀM QUAN TRỌNG NHẤT: Gọi API Bước 2
   */
  const handleVNPayPayment = async () => {
    if (!subId || !price || !name || !user) {
      alert('Thông tin gói hoặc người dùng không hợp lệ.');
      return;
    }
    setProcessing(true);
    
    try {
      // Dữ liệu gửi lên server (API Bước 2)
      const paymentData = {
        amount: parseFloat(price),
        subId: parseInt(subId, 10),
        userId: user.userId, // Giả sử user data có 'userId'
      };

      // Gọi API route /api/payment/create mà chúng ta vừa tạo
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.code === '200' && data.data) {
        // 4. Nếu API trả về thành công (data.data là link VNPAY)
        // -> Tự động chuyển hướng người dùng đến cổng VNPAY
        window.location.href = data.data;
      } else {
        // Xử lý lỗi từ API (Vd: lỗi 500)
        throw new Error(data.message || 'Không thể tạo thanh toán. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo thanh toán VNPay:", error);
      alert(error.message || 'Đã xảy ra lỗi kết nối. Vui lòng kiểm tra lại.');
      setProcessing(false);
    }
    // Không setProcessing(false) ở đây vì nếu thành công, trang sẽ chuyển đi
  };

  // Trạng thái loading...
  if (!authChecked || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold">Đang kiểm tra đăng nhập...</h2>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH
  return (
    <div className="min-h-screen flex justify-center items-center py-12 px-4 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full">

        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center">Xác nhận thanh toán</h1>
        </div>

        <div className="p-6 md:p-8">

          {/* Thông tin đơn hàng */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Gói đăng ký:</span>
                <span className="font-bold">{name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người mua:</span>
                <span className="font-bold">{user.userName || 'N/A'}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-lg">Tổng thanh toán:</span>
                <span className="font-bold text-blue-600 text-2xl">
                  {price ? parseFloat(price).toLocaleString('vi-VN') : '0'}đ
                </span>
              </div>
            </div>
          </div>

          {/* Nút bấm */}
          <button
            onClick={handleVNPayPayment} // <-- GỌI HÀM SỐ 3
            disabled={processing}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-3"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              'Thanh toán với VNPay'
            )}
          </button>

          <button
            onClick={() => router.back()} // Nút quay lại
            disabled={processing}
            className="w-full text-center mt-4 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Component cha, dùng <Suspense> để bọc
 */
export default function PaymentPage() {
  // <Suspense> là bắt buộc khi component con dùng useSearchParams
  return (
    <Suspense fallback={ // Giao diện tạm thời khi đang tải
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold">Đang tải trang thanh toán...</h2>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}