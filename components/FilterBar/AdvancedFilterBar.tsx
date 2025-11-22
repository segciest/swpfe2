'use client';
import { useState } from "react";

interface AdvancedFilterBarProps {
    onFilter: (type: string, params: any) => void;
}
export default function AdvancedFilterBar({ onFilter }: AdvancedFilterBarProps) {
    const [brand, setBrand] = useState("");
    const [yearStart, setYearStart] = useState("");
    const [yearEnd, setYearEnd] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSearchBrand = () => {
        if (!brand.trim()) return alert("Nhập brand!");
        onFilter("brand", { brand });
    };

    const handleFilterYear = () => {
        if (!yearStart || !yearEnd) return alert("Nhập đủ năm!");
        onFilter("year", { start: yearStart, end: yearEnd });
    };

    const handleFilterPrice = () => {
        if (!minPrice || !maxPrice) return alert("Nhập đủ giá!");
        onFilter("price", { min: minPrice, max: maxPrice });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow mb-6 space-y-4">
            {/* Brand */}
            <div className="flex gap-3">
                <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Tìm theo brand..."
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={handleSearchBrand}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Tìm
                </button>
            </div>

            {/* Year Range */}
            <div className="flex gap-3">
                <input
                    type="number"
                    value={yearStart}
                    onChange={(e) => setYearStart(e.target.value)}
                    placeholder="Năm bắt đầu"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="number"
                    value={yearEnd}
                    onChange={(e) => setYearEnd(e.target.value)}
                    placeholder="Năm kết thúc"
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={handleFilterYear}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Lọc
                </button>
            </div>

            {/* Price Range */}
            <div className="flex gap-3">
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Giá thấp nhất"
                    className="border p-2 rounded w-full"
                />
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Giá cao nhất"
                    className="border p-2 rounded w-full"
                />
                <button
                    onClick={handleFilterPrice}
                    className="px-4 py-2 bg-orange-600 text-white rounded"
                >
                    Lọc
                </button>
            </div>
        </div>
    );
}
