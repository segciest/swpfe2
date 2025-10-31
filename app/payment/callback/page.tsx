'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    orderId?: string;
    amount?: number;
    transactionNo?: string;
  } | null>(null);

  useEffect(() => {
    checkPaymentResult();
  }, []);

  const checkPaymentResult = async () => {
    try {
      const responseCode = searchParams.get('vnp_ResponseCode');
      const orderId = searchParams.get('vnp_TxnRef');
      const amount = searchParams.get('vnp_Amount');
      const transactionNo = searchParams.get('vnp_TransactionNo');

      if (!responseCode) {
        setResult({
          success: false,
          message: 'Không tìm thấy thông tin thanh toán'
        });
        setChecking(false);
        return;
      }

      // VNPay response codes:
      // 00: Success
      // Others: Failed
      const isSuccess = responseCode === '00';

      setResult({
        success: isSuccess,
        message: isSuccess 
          ? 'Thanh toán thành công! Gói đăng ký của bạn đã được kích hoạt.' 
          : 'Thanh toán thất bại. Vui lòng thử lại.',
        orderId: orderId || undefined,
        amount: amount ? parseInt(amount) / 100 : undefined,
        transactionNo: transactionNo || undefined,
      });
    } catch (error) {
      console.error('Failed to check payment:', error);
      setResult({
        success: false,
        message: 'Có lỗi xảy ra khi kiểm tra thanh toán'
      });
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-md">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Đang kiểm tra thanh toán...</h2>
          <p className="text-gray-500 mt-2">Vui lòng đợi</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h2>
          <Link href="/subscription" className="btn-primary inline-block">
            Quay lại trang gói đăng ký
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-2xl w-full">
        {result.success ? (
          <>
            {/* Success */}
            <div className="text-8xl mb-6 animate-bounce">✅</div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">Thanh toán thành công!</h1>
            <p className="text-lg text-gray-600 mb-8">{result.message}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg mb-4">Thông tin giao dịch</h3>
              <div className="space-y-2">
                {result.orderId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold">{result.orderId}</span>
                  </div>
                )}
                {result.transactionNo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-semibold">{result.transactionNo}</span>
                  </div>
                )}
                {result.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-green-600">
                      {result.amount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/" className="btn-primary block">
                🏠 Về trang chủ
              </Link>
              <Link href="/my-posts" className="btn-secondary block">
                📝 Đăng tin ngay
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Failed */}
            <div className="text-8xl mb-6">❌</div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Thanh toán thất bại</h1>
            <p className="text-lg text-gray-600 mb-8">{result.message}</p>

            {result.orderId && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600">Mã đơn hàng: <strong>{result.orderId}</strong></p>
              </div>
            )}

            <div className="space-y-4">
              <Link href="/subscription" className="btn-primary block">
                🔄 Thử lại
              </Link>
              <Link href="/" className="btn-secondary block">
                🏠 Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-md">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Đang tải...</h2>
        </div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
