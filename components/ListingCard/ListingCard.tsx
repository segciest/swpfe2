'use client';
import { useRouter } from "next/navigation";

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
  return (
    <div
      onClick={() => router.push(`/listing/${listing.listingId}`)}
      className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4"
    >
      <img
        src={listing.imageUrls[0] || '/no-image.png'}
        alt={listing.title}
        className="w-full h-48 object-cover rounded-xl"
      />
      <div className="mt-3">
        <h3 className="text-lg font-semibold">{listing.title}</h3>
        <p className="text-gray-500 text-sm">{listing.categoryName}</p>
        <p className="text-blue-600 font-bold mt-2">
          {listing.price.toLocaleString()} đ
        </p>
      </div>
    </div>
  );
}
