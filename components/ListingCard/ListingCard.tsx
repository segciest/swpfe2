'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Flag } from "lucide-react";

interface Listing {
  listingId: string;
  title: string;
  price: number;
  categoryName: string;
  description: string;
  imageUrls: string[];
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div
      onClick={() => router.push(`/listing/${listing.listingId}`)}
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col items-center text-center p-6"
    >
      {/* Ảnh sản phẩm */}
      <div className="relative w-full flex justify-center">
        <img
          src={listing.imageUrls[0] || '/no-image.png'}
          alt={listing.title}
          className="w-4/5 h-48 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* ❤️ Tim + 🚩 Flag */}
        <div className="absolute top-2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`p-1.5 rounded-full bg-white shadow hover:scale-110 transition ${liked ? "text-red-500" : "text-gray-700"
              }`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setReported(!reported);
            }}
            className={`p-1.5 rounded-full bg-white shadow hover:scale-110 transition ${reported ? "text-yellow-500" : "text-gray-700"
              }`}
          >
            <Flag size={18} fill={reported ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Nội dung */}
      <div className="flex flex-col items-center mt-4">
        <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{listing.categoryName}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">
          {listing.price.toLocaleString()} đ
        </p>

        {/* Nút xem chi tiết */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/listing/${listing.listingId}`);
          }}
          className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          Tìm hiểu thêm
        </button>
      </div>
    </div>
  );
}
