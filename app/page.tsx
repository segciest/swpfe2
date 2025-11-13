"use client";
import { useEffect, useState } from "react";
import { getListings } from "@/lib/getListing";
import ListingCard from "@/components/ListingCard/ListingCard";
import FilterBar from "@/components/FilterBar/FilterBar";

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [original, setOriginal] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [searchMode, setSearchMode] = useState(false);

  // ✅ Lấy danh sách ban đầu
  useEffect(() => {
    getListings()
      .then((data) => {
        setListings(data);
        setOriginal(data);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách:", err));
  }, []);

  // ✅ Nghe sự kiện tìm kiếm từ Navbar
  useEffect(() => {
    const handleSearch = (e: any) => {
      setListings(e.detail);
      setSearchMode(true);
    };
    window.addEventListener("search-results", handleSearch);
    return () => window.removeEventListener("search-results", handleSearch);
  }, []);

  const displayed =
    filter === "All" ? listings : listings.filter((l) => l.categoryName === filter);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {searchMode ? "Kết quả tìm kiếm" : "Danh sách bài đăng"}
      </h1>

      {!searchMode && (
        <FilterBar selected={filter} onChange={setFilter} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.length > 0 ? (
          displayed.map((item) => (
            <ListingCard key={item.listingId} listing={item} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            Không có bài đăng nào phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
