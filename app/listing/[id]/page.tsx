import { getListingDetail } from "@/lib/getListingDetail";

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getListingDetail(id);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* --- PHẦN TRÊN --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-sm">
                {/* --- CỘT TRÁI: ẢNH --- */}
                <div>
                    <div className="relative">
                        <img
                            src={data.image || "/no-image.png"}
                            alt={data.title}
                            className="rounded-xl w-full h-[420px] object-cover"
                        />
                    </div>

                    {/* thumbnail nhỏ */}
                    <div className="flex gap-3 mt-4 overflow-x-auto">
                        {[data.image, ...(data.imageUrls || [])].map((img: string, i: number) => (
                            <img
                                key={i}
                                src={img || "/no-image.png"}
                                alt={`thumb-${i}`}
                                className="w-20 h-20 rounded-lg border hover:scale-105 transition"
                            />
                        ))}
                    </div>
                </div>

                {/* --- CỘT PHẢI: THÔNG TIN --- */}
                <div>
                    <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
                    <p className="text-gray-500 mb-2">
                        {data.brand} {data.model ? `- ${data.model}` : ""} • {data.year}
                    </p>

                    <p className="text-3xl font-bold text-red-600 mb-3">
                        {data.price.toLocaleString()} đ
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <span>📍 Cmt8, TP.HCM</span>•<span>Đăng {new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Thanh giá thị trường giả lập */}
                    {/* <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-600 mb-4">
                        <p className="font-semibold mb-2">Khoảng giá thị trường</p>
                        <div className="flex items-center justify-between">
                            <span>12.9tr</span>
                            <div className="relative flex-1 mx-2 h-2 bg-gray-200 rounded-full">
                                <div className="absolute left-[55%] top-[-3px] w-4 h-4 bg-blue-500 rounded-full"></div>
                            </div>
                            <span>15.7tr</span>
                        </div>
                    </div> */}

                    {/* Nút liên hệ */}
                    <div className="flex gap-3 mb-6">
                        <button className="flex-1 border border-gray-300 py-3 rounded-lg font-medium">
                            Hiện số 090690****
                        </button>
                        <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-semibold">
                            💬 Chat
                        </button>
                    </div>

                    {/* Thông tin người bán */}
                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-300 flex items-center justify-center font-bold text-gray-700">
                                {data.seller.userName[0]}
                            </div>
                            <div>
                                <p className="font-medium">{data.seller.userName}</p>
                                <p className="text-sm text-gray-500">Hoạt động 2 giờ trước</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm">⭐ 5 (1 đánh giá)</p>
                            <button className="text-blue-600 text-sm">Xem trang</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PHẦN DƯỚI: MÔ TẢ + BÌNH LUẬN --- */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MÔ TẢ */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-3">Mô tả chi tiết</h2>
                    <div
                        className="prose max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: data.content }}
                    />
                </div>

                {/* BÌNH LUẬN */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-bold mb-3">Bình luận</h2>
                    <p className="text-gray-500 text-sm">Chưa có bình luận nào.</p>
                </div>
            </div>
        </div>
    );
}
