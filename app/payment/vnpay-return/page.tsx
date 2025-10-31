// app/payment/vnpay-return/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Đang xử lý kết quả...');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');

    if (vnp_TxnRef) {
      setOrderId(vnp_TxnRef);
    }

    // Kiểm tra kết quả trả về
    if (vnp_ResponseCode === '00') {
      setStatus('success');
      setMessage('Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
      // Lưu ý: Không cập nhật CSDL ở đây. Chờ IPN (Bước 4)
    } else {
      setStatus('failed');
      setMessage('Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
    }
    
  }, [searchParams]);

  const renderIcon = () => {
    if (status === 'loading') {
      return <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />;
    }
    if (status === 'success') {
      return <CheckCircle className="w-16 h-16 text-green-500" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          {renderIcon()}
        </div>
        <h1 className={`text-2xl font-bold mb-4 
          ${status === 'success' ? 'text-green-600' : ''}
          ${status === 'failed' ? 'text-red-600' : ''}
        `}>
          {status === 'success' ? 'Thanh toán thành công' : 
           status === 'failed' ? 'Thanh toán thất bại' : 'Đang xử lý'}
        </h1>
        <p className="text-gray-600 mb-4">{message}</p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">Mã đơn hàng: {orderId}</p>
        )}
        <Link href="/">
          <span className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Quay về trang chủ
          </span>
        </Link>
      </div>
    </div>
  );
}

// Component cha dùng Suspense
export default function VNPayReturnPage() {
  return (
    <Suspense fallback={<div>Đang tải kết quả...</div>}>
      <PaymentResultContent />
    </Suspense>
  );
}