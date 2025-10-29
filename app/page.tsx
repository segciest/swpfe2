'use client';
import { useEffect, useState } from "react";
import { getListings } from "@/lib/getListing";
import ListingCard from "@/components/ListingCard/ListingCard";
import FilterBar from "@/components/FilterBar/FilterBar";

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getListings().then(setListings).catch(console.error);
  }, []);

  const filtered = filter === "All" ? listings : listings.filter((l: any) => l.categoryName === filter);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Danh sách bài đăng</h1>
      <FilterBar selected={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item: any) => (
          <ListingCard key={item.listingId} listing={item} />
        ))}
      </div>
    </div>
  );
}
