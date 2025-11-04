'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Loader2, AlertCircle } from 'lucide-react';

interface FavoriteListing {
  listingId?: string;  // UUID từ database
  id?: string;         // Backup nếu API trả về id
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  image_url?: string;  // Backup nếu API dùng snake_case
  category?: string;
  categoryName?: string; // Backup nếu API dùng categoryName
  createdAt?: string;
  isFavorite?: boolean;
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const stored = localStorage.getItem('userData');
    if (!stored) {
      router.push('/login-register');
      return;
    }
    setUserData(JSON.parse(stored));
  }, [router]);

  useEffect(() => {
    if (!userData) return;

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/api/favorite/user`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        });

        if (!res.ok) {
          throw new Error('Không thể tải danh sách yêu thích');
        }

        const data = await res.json();
        console.log('📌 Favorites data from API:', data);
        setFavorites(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userData]);

  const handleRemoveFavorite = async (listing: FavoriteListing) => {
    if (!userData) return;
    
    const listingId = listing.listingId || listing.id;
    if (!listingId) return;

    try {
      const res = await fetch(`http://localhost:8080/api/favorite/remove`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listingId })
      });

      if (!res.ok) {
        throw new Error('Không thể xóa khỏi yêu thích');
      }

      // Cập nhật danh sách
      setFavorites(favorites.filter(item => (item.listingId || item.id) !== listingId));
    } catch (err) {
      console.error('Lỗi khi xóa yêu thích:', err);
    }
  };

  const handleViewListing = (listing: FavoriteListing) => {
    const listingId = listing.listingId || listing.id;
    if (listingId) {
      router.push(`/listing/${listingId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            Bài Đăng Yêu Thích
          </h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} bài đăng đã lưu
          </p>
        </div>

        {/* Danh sách yêu thích */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Chưa có bài đăng yêu thích
            </h2>
            <p className="text-gray-500 mb-6">
              Khám phá và lưu các bài đăng bạn yêu thích
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Khám phá ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((listing, index) => {
              const uniqueKey = listing.listingId || listing.id || `listing-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                {/* Hình ảnh */}
                <div className="relative h-48 bg-gray-200">
                  {(listing.imageUrl || listing.image_url) ? (
                    <img
                      src={listing.imageUrl || listing.image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Không có ảnh
                    </div>
                  )}
                  {/* Nút xóa yêu thích */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(listing);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </button>
                </div>

                {/* Nội dung */}
                <div className="p-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                    {listing.category || listing.categoryName || 'N/A'}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">
                      {listing.price?.toLocaleString('vi-VN') || '0'} VNĐ
                    </span>
                    <button
                      onClick={() => handleViewListing(listing)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
