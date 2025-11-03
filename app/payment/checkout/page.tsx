"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createVNPayPayment, cancelPayment } from '@/utils/api';
import { CreditCard, AlertTriangle, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  type UserInfo = { userId: string; userName?: string; userEmail?: string } | null;
  const [user, setUser] = useState<UserInfo>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pendingPaymentModal, setPendingPaymentModal] = useState<any>(null);

  // Lấy thông tin từ URL
  const subId = searchParams.get('subId');
  const price = searchParams.get('price');
  const name = searchParams.get('name');

  // Lấy user từ localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const data = JSON.parse(storedUserData);

      setUser({
        userId: data.userId,
        userName: data.userName || 'Khách hàng',
        userEmail: data.userEmail || 'user@example.com',
      });
    } else {
      router.push('/login-register');
    }
    setAuthChecked(true);
  }, [router]);

  // Hàm xử lý thanh toán VNPay
  const handleVNPayPayment = async () => {
    if (!subId || !price || !name || !user) {
      alert('Thông tin gói hoặc người dùng không hợp lệ.');
      return;
    }
    setProcessing(true);
    try {
      const paymentData = {
        amount: parseFloat(price),
        orderInfo: `Thanh toán gói ${name}`,
        subscriptionId: parseInt(subId as string, 10),
        userId: user.userId,
      };

      const data = await createVNPayPayment(paymentData);
      // Backend returns { paymentUrl, orderId, amount, paymentId, userSubId }
      // or on conflict: { error: 'PENDING_PAYMENT_EXISTS', message, pendingPayment }
      if (data && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      if (data && data.error === 'PENDING_PAYMENT_EXISTS' && data.pendingPayment) {
        setPendingPaymentModal({
          paymentId: data.pendingPayment.paymentId,
          orderId: data.pendingPayment.orderId,
          amount: data.pendingPayment.amount,
          subName: data.pendingPayment.packageName || data.pendingPayment.subName || name,
          createDate: data.pendingPayment.createDate,
          minutesRemaining: data.pendingPayment.minutesRemaining,
        });
        setProcessing(false);
        return;
      }

      throw new Error((data && data.message) || 'Không thể tạo thanh toán');
    } catch (e) {
      const err = e as Error;
      alert(err.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
      setProcessing(false);
    }
  };

  // Hàm hủy giao dịch
  const handleCancelPendingPayment = async () => {
    if (!pendingPaymentModal) return;
    try {
      setProcessing(true);
      await cancelPayment(pendingPaymentModal.paymentId);
      alert('Đã hủy giao dịch cũ thành công!');
      setPendingPaymentModal(null);
      setTimeout(() => {
        setProcessing(false);
        handleVNPayPayment();
      }, 500);
    } catch (e) {
      const err = e as Error;
      alert(err.message || 'Không thể hủy giao dịch');
      setProcessing(false);
    }
  };

  // Trạng thái loading khi check auth
  if (!authChecked || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-12 text-center max-w-md border dark:border-slate-700 text-gray-900 dark:text-white">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 dark:border-green-500 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold">Đang kiểm tra đăng nhập...</h2>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH (FORM TRẮNG TRÊN NỀN ẢNH)
  return (
    <div
      className="min-h-screen flex justify-center items-center py-12 px-4"
      style={{
        backgroundImage: "url('/images/paymentbackground.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Form màu trắng */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full text-gray-900 dark:text-white transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-center">Thanh toán</h1>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h2>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gói đăng ký:</span>
                <span className="font-bold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Người mua:</span>
                <span className="font-bold">{user.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="font-bold">{user.userEmail}</span>
              </div>
              <hr className="border-gray-200 dark:border-slate-600" />
              <div className="flex justify-between items-center">
                <span className="text-lg">Tổng thanh toán:</span>
                <span className="font-bold text-blue-600 text-2xl">
                  {price ? parseFloat(price).toLocaleString('vi-VN') : '0'}đ
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="border-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <img src="/images/vnpaylogo.png" alt="VNPay" className="w-10 h-10 rounded-md" />
                <div>
                  <h3 className="font-bold">VNPay</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Thanh toán qua cổng VNPay</p>
                </div>
              </div>
              <ul className="space-y-1 text-sm pl-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Hỗ trợ thanh toán qua ATM/Visa/MasterCard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Bảo mật tuyệt đối</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Xác nhận thanh toán tức thì</span>
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleVNPayPayment}
            disabled={processing}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-3"
          >
            {processing ? 'Đang xử lý...' : 'Thanh toán với VNPay'}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full text-center mt-4 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 py-3 rounded-lg font-semibold transition"
          >
            Quay lại
          </button>

          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 text-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-bold">Lưu ý:</span> Bạn sẽ được chuyển đến trang thanh toán VNPay. Sau khi thanh toán thành công, bạn sẽ được chuyển về trang xác nhận.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Hủy Giao Dịch Cũ */}
      {pendingPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 max-w-md w-full text-gray-900 dark:text-white transition-colors duration-300">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center mb-3">Phát hiện giao dịch đang chờ</h2>
            <p className="text-center mb-2">
              Bạn có một giao dịch cho gói <strong>{pendingPaymentModal.subName}</strong> (mã: {pendingPaymentModal.paymentId}) chưa hoàn tất.
            </p>
            <p className="text-center mb-6">Vui lòng hủy giao dịch cũ trước khi đăng ký gói mới.</p>

            <div className="space-y-3">
              <button
                onClick={handleCancelPendingPayment}
                disabled={processing}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
              >
                {processing ? 'Đang hủy...' : '✗ Hủy giao dịch cũ'}
              </button>
              <button
                onClick={() => setPendingPaymentModal(null)}
                className="w-full py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
