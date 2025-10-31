// app/components/HomePageListings.tsx

'use client'; // Đây là Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getActiveListings } from '@/utils/api'; // <-- Dùng @/utils/
import { getToken } from '@/utils/auth';     // <-- Dùng hàm đúng
import type { Listing, User } from '@/utils/types';  // <-- Dùng @/utils/

// Giả sử getToken() trả về User hoặc null
function getCurrentUser(): User | null {
  const userOrToken = getToken(); 
  // TODO: Bạn cần logic để chuyển đổi token thành User nếu cần
  // Tạm thời, chúng ta giả sử getToken() trả về User | null
  if (typeof userOrToken === 'object' && userOrToken !== null) {
    return userOrToken as User;
  }
  return null;
}

export function HomePageListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'xe-dien' | 'pin'>('all');

  useEffect(() => {
    setUser(getCurrentUser());
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      const listings = await getActiveListings(0, 8); // Chỉ lấy 8 tin
      setListings(Array.isArray(listings) ? listings : []);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    if (filter === 'xe-dien') return listing.categoryName?.includes('Car') || listing.categoryName?.includes('Electric');
    if (filter === 'pin') return listing.categoryName?.includes('Battery') || listing.categoryName?.includes('Pin');
    return true;
  });

  return (
    // Component này không cần div bọc ngoài, nó sẽ khớp vào <section>
    <>
      {/* Filter Tabs - Đã thêm class dark: */}
      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter('xe-dien')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'xe-dien' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
          }`}
        >
          🚗 Xe điện
        </button>
        <button
          onClick={() => setFilter('pin')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            filter === 'pin' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
          }`}
        >
          🔋 Pin
        </button>
      </div>

      {/* Listings Grid - Đã thêm class dark: */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Đang tải tin đăng...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.listingId} listing={listing} showContact={user !== null} />
            ))}
          </div>
          
          {filteredListings.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/search" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-full text-md transition-colors">
                Xem tất cả →
              </Link>
            </div>
          )}
        </>
      )}

      {filteredListings.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Không có tin đăng nào.</p>
        </div>
      )}
    </>
  );
}

// Listing Card Component - Đã thêm class dark:
function ListingCard({ listing, showContact }: { listing: Listing; showContact: boolean }) {
  const imageUrl = listing.imageUrls?.[0] || '/placeholder.jpg';
  
  return (
    <Link 
      href={`/posts/${listing.listingId}`} 
      className="bg-slate-800 dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all"
    >
      <div className="relative h-48 bg-gray-700">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
        />
        <div className="absolute top-2 right-2">
          <span className="badge-success">{listing.status}</span>
        </div>
      </div>

      <div className="p-4"> 
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white">{listing.title}</h3>
        
        <div className="text-2xl font-bold text-green-400 mb-2">
          {listing.price?.toLocaleString('vi-VN')} đ
        </div>

        <div className="text-sm text-gray-400 space-y-1 h-16"> {/* Giới hạn chiều cao */}
          <p className="line-clamp-2">{listing.description}</p>
          <p>📦 {listing.categoryName}</p>
        </div>

        <div className="mt-4 text-xs text-gray-500 border-t border-slate-700 pt-2">
          {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </Link>
  );
}