"use client";
import { useEffect } from "react";

import { useState } from "react";

export default function ListingDetailClient({ data }: { data: any }) {
    const [mainImage, setMainImage] = useState(data.imageUrls?.[0] || "/no-image.png");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("userData");
        setIsLoggedIn(!!user);
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* --- PHẦN TRÊN --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-sm">
                {/* --- CỘT TRÁI: ẢNH --- */}
                <div>
                    <div className="relative">
                        <img
                            src={mainImage}
                            alt={data.title}
                            className="rounded-xl w-full h-[420px] object-cover transition-all duration-300"
                        />
                    </div>

                    {/* thumbnail nhỏ (nếu có nhiều ảnh) */}
                    {data.imageUrls?.length > 0 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto">
                            {data.imageUrls.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img || "/no-image.png"}
                                    alt={`thumb-${i}`}
                                    onClick={() => setMainImage(img)} // 👉 đổi ảnh chính khi click
                                    className={`w-20 h-20 rounded-lg border cursor-pointer hover:scale-105 transition 
                    ${mainImage === img ? "ring-2 ring-yellow-500" : ""}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- CỘT PHẢI: THÔNG TIN CHI TIẾT --- */}
                <div>
                    <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                    <p className="text-gray-500 mb-2">
                        {data.brand} {data.model ? `- ${data.model}` : ""} • {data.year}
                    </p>

                    <p className="text-3xl font-bold text-red-600 mb-3">
                        {data.price ? data.price.toLocaleString("vi-VN") + " ₫" : "Liên hệ"}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <span>📍 TP.HCM</span>
                        <span>•</span>
                        <span>Đăng {new Date(data.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>

                    {/* Thông số nhanh */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-2 border">
                        {data.color && <p><strong>Màu sắc:</strong> {data.color}</p>}
                        {data.seats && <p><strong>Số chỗ:</strong> {data.seats}</p>}
                        {data.mileage && <p><strong>Quãng đường:</strong> {data.mileage}</p>}
                        {data.batteryCapacity && <p><strong>Dung lượng pin:</strong> {data.batteryCapacity}</p>}
                        {data.cycleCount && <p><strong>Chu kỳ sạc:</strong> {data.cycleCount}</p>}
                        {data.voltage && <p><strong>Điện áp:</strong> {data.voltage}</p>}
                        {data.capacity && <p><strong>Công suất:</strong> {data.capacity}</p>}
                        {data.warrantyInfo && <p><strong>Bảo hành:</strong> {data.warrantyInfo} Tháng</p>}
                        {data.batteryLifeRemaining && (
                            <p><strong>Tuổi thọ pin còn lại:</strong> {data.batteryLifeRemaining}</p>
                        )}
                        <p><strong>Loại xe:</strong> {data.category?.categoryName || "Không xác định"}</p>
                    </div>

                    {/* Nút liên hệ */}
                    <div className="flex gap-3 mb-6">
                        <button
                            className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setShowLoginPopup(true);
                                    return;
                                }
                                // Nếu đã đăng nhập, thực hiện gọi
                                window.location.href = `tel:${data.seller?.phone}`;
                            }}
                        >
                            ☎️ Gọi {isLoggedIn ? (data?.sellerPhone || "ẩn") : "**** *** ***"}
                        </button>
                        {/* <button
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-semibold"
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setShowLoginPopup(true);
                                    return;
                                }

                                alert("Đi tới chat (logic chat ở đây)");
                            }}
                        >
                            💬 Chat
                        </button> */}

                    </div>

                    {/* Thông tin người bán */}
                    {data.sellerName && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center font-bold text-gray-700">
                                    {data.sellerName}
                                </div>
                                <div>
                                    <p className="font-medium">{data.sellerName}</p>
                                    <p className="text-sm text-gray-500">{data.seller.subid?.subName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">⭐ 5.0 (1 đánh giá)</p>
                                <button
                                    onClick={() => alert("Đi tới trang người bán")}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Xem trang
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PHẦN DƯỚI: MÔ TẢ + BÌNH LUẬN --- */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MÔ TẢ CHI TIẾT */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-3">Mô tả chi tiết</h2>
                    {data.content ? (
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: data.content }}
                        />
                    ) : (
                        <p className="text-gray-500 italic">Chưa có mô tả chi tiết.</p>
                    )}
                </div>

                {/* BÌNH LUẬN */}
                {/* <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-3">Bình luận</h2>
                    <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
                </div> */}
            </div>

            {/* --- POPUP MODAL */}
            {showLoginPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Bạn cần đăng nhập</h3>
                        <p className="text-gray-600 mb-4">
                            Vui lòng đăng nhập để xem số điện thoại hoặc chat với người bán.
                        </p>

                        <button
                            onClick={() => window.location.href = "/login-register"}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-lg font-semibold mb-2"
                        >
                            Đăng nhập ngay
                        </button>
                        <button
                            onClick={() => setShowLoginPopup(false)}
                            className="w-full border py-2 rounded-lg font-medium"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
