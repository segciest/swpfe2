'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    // Gọi API lấy danh sách bài pending
    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/listing/pending');
            if (!res.ok) throw new Error('Lỗi khi tải dữ liệu!');
            const data = await res.json();
            setListings(data);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleVerify = async (id: string) => {
        if (!confirm('Xác nhận duyệt bài này?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/listing/approve/${id}`, {
                method: 'PUT',
            });
            if (!res.ok) throw new Error('Không thể duyệt bài!');
            alert('✅ Duyệt thành công!');
            fetchListings();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeny = async (id: string) => {
        if (!confirm('Bạn có chắc muốn từ chối bài đăng này?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/listing/reject/${id}`, {
                method: 'PUT',
            });
            if (!res.ok) throw new Error('Không thể từ chối!');
            alert('❌ Từ chối thành công!');
            fetchListings();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
                <nav className="space-y-2">
                    <button className="w-full text-left px-4 py-2 rounded-md bg-yellow-100 text-yellow-800 font-medium">
                        Duyệt bài đăng
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-200">
                        Duyệt tài khoản
                    </button>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Danh sách bài đăng cần duyệt</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                    </div>
                ) : listings.length === 0 ? (
                    <p className="text-gray-600 text-center mt-20">Không có bài đăng nào cần duyệt.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((item) => (
                            <div
                                key={item.listingId}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                <img
                                    src={item.imageUrls?.[0] || '/no-image.png'}
                                    alt={item.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                    <p className="text-yellow-700 font-bold mt-2">
                                        {item.price?.toLocaleString()} VNĐ
                                    </p>

                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            onClick={() => setSelected(item)}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            <Eye size={16} /> Chi tiết
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerify(item.listingId)}
                                                className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                                            >
                                                <CheckCircle size={16} /> Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleDeny(item.listingId)}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                                            >
                                                <XCircle size={16} /> Từ chối
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal xem chi tiết */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] rounded-xl p-6 relative shadow-lg max-h-[80vh] overflow-auto">
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-3 right-4 text-gray-600 hover:text-black"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
                        <img
                            src={selected.imageUrls?.[0] || '/no-image.png'}
                            alt="Ảnh"
                            className="w-full h-60 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-700 whitespace-pre-line mb-2">{selected.description}</p>
                        <p className="text-yellow-700 font-semibold mb-2">
                            Giá: {selected.price?.toLocaleString()} VNĐ
                        </p>
                        <p className="text-sm text-gray-500">
                            Thương hiệu: {selected.brand || 'Không có'} — Màu: {selected.color || 'N/A'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
