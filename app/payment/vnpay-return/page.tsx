'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VNPayReturnPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // VNPay redirects here with params
    // Redirect to callback page with all query params
    const params = new URLSearchParams(searchParams.toString());
    window.location.href = `/payment/callback?${params.toString()}`;
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-md">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Đang xử lý thanh toán...</h2>
        <p className="text-gray-500 mt-2">Vui lòng đợi</p>
      </div>
    </div>
  );
}
