// app/components/HomePageListings.tsx

'use client'; // Đây là Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveListings } from '@/utils/api'; // Import từ utils/
import type { Listing } from '@/utils/types';    // Import từ utils/
// Import ListingCard mới từ thư mục gốc 'components'
import ListingCard from '@/components/ListingCard/ListingCard';

export function HomePageListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'xe-dien' | 'pin'>('all');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const listingsData = await getActiveListings(0, 8); 
      setListings(Array.isArray(listingsData) ? listingsData : []);
      
      // BƯỚC 1: CONSOLE LOG ĐỂ GỠ LỖI
      // Mở F12 (Developer Tools) trên trình duyệt, chọn tab "Console"
      // Bạn sẽ thấy dữ liệu API trả về. Hãy kiểm tra xem 'categoryName' là gì.
      console.log('Đã tải listings (kiểm tra categoryName):', listingsData);
      
    } catch (error) {
      console.error('Failed to load listings:', error);
      setListings([]); 
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 2: SỬA LOGIC LỌC TIN ĐĂNG
  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true; // Nếu là "Tất cả", hiện tất cả
    
    // Lấy categoryName, chuyển về chữ thường để dễ so sánh
    const category = listing.categoryName?.toLowerCase() || '';
    
    if (filter === 'xe-dien') {
      // Tìm kiếm rộng hơn cho "Xe" (ví dụ: "xe máy", "electric car", "ô tô điện")
      return category.includes('xe') || category.includes('car') || category.includes('electric');
    }
    if (filter === 'pin') {
      // Tìm kiếm rộng hơn cho "Pin"
      return category.includes('pin') || category.includes('battery');
    }
    return false;
  });

  return (
    <>
      {/* BƯỚC 3: SỬA STYLE NÚT CHO NỀN TRẮNG */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' // Nút active
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Nút inactive (nền sáng)
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('xe-dien')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'xe-dien' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🚗 Xe điện
        </button>
        <button
          onClick={() => setFilter('pin')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'pin' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔋 Pin
        </button>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-500">Đang tải tin đăng...</p>
        </div>
      ) : (
        <>
          {/* Chỉ hiển thị lưới nếu có tin đăng */}
          {filteredListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Sử dụng ListingCard mới */}
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.listingId} listing={listing} />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link href="/search" 
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full text-md transition-colors">
                  Xem tất cả →
                </Link>
              </div>
            </>
          ) : (
            // Hiển thị thông báo nếu không có tin đăng (giống hình của bạn)
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Không có tin đăng nào phù hợp.</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

