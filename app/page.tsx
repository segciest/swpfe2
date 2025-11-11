'use client';
import { useEffect, useState } from "react";
import { getListings } from "@/lib/getListing";
import ListingCard from "@/components/ListingCard/ListingCard";
import FilterBar from "@/components/FilterBar/FilterBar";
import Navbar from "@/components/Navbar/Navbar";

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  useEffect(() => {
    getListings().then(setListings).catch(console.error);
  }, []);

  const displayed = searchResults
    ? searchResults
    : filter === "All"
      ? listings
      : listings.filter((l) => l.categoryName === filter);

  return (
    <div>
      <Navbar onSearch={setSearchResults} /> {/* 🔍 Thêm vào đây */}
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {searchResults ? "Kết quả tìm kiếm" : "Danh sách bài đăng"}
        </h1>
        {!searchResults && <FilterBar selected={filter} onChange={setFilter} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((item) => (
            <ListingCard key={item.listingId} listing={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
