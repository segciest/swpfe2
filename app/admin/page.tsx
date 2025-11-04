'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Eye, Loader2, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'listings' | 'reports'>('listings');
    const [listings, setListings] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
    const router = useRouter();

    // ✅ Kiểm tra quyền truy cập admin
    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (!stored) {
            router.push('/');
            return;
        }

        try {
            const userData = JSON.parse(stored);
            const role = userData.role?.roleName || userData.role;
            if (role !== 'ADMIN' && role !== 'MANAGER') {
                alert('🚫 Bạn không có quyền truy cập trang này!');
                router.push('/');
            }
        } catch {
            router.push('/');
        }
    }, [router]);

    // 🚀 Lấy danh sách bài cần duyệt
    const fetchListings = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userData') || '{}').token;
            const res = await fetch('http://localhost:8080/api/listing/pending', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setListings(data);
        } catch (err: any) {
            alert(err.message || 'Lỗi khi tải danh sách bài đăng!');
        } finally {
            setLoading(false);
        }
    };

    // 🚨 Lấy danh sách báo cáo
    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('userData') || '{}').token;
            const res = await fetch('http://localhost:8080/api/report', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setReports(data);
        } catch (err: any) {
            alert(err.message || 'Lỗi khi tải danh sách báo cáo!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        activeTab === 'listings' ? fetchListings() : fetchReports();
    }, [activeTab]);

    // ✅ Duyệt bài
    const handleVerify = async (id: string) => {
        if (!confirm('Xác nhận duyệt bài này?')) return;
        try {
            const token = JSON.parse(localStorage.getItem('userData') || '{}').token;
            const res = await fetch(`http://localhost:8080/api/listing/approve/${id}`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error(await res.text());
            alert('✅ Duyệt thành công!');
            fetchListings();
        } catch (err: any) {
            alert(err.message || 'Không thể duyệt bài!');
        }
    };

    // ❌ Từ chối bài
    const handleDeny = async (id: string) => {
        if (!confirm('Bạn có chắc muốn từ chối bài đăng này?')) return;
        try {
            const token = JSON.parse(localStorage.getItem('userData') || '{}').token;
            const res = await fetch(`http://localhost:8080/api/listing/reject/${id}`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (!res.ok) throw new Error(await res.text());
            alert('❌ Từ chối thành công!');
            fetchListings();
        } catch (err: any) {
            alert(err.message || 'Không thể từ chối!');
        }
    };

    // ✅ Duyệt / từ chối báo cáo
    const handleReportAction = async (id: number, status: 'RESOLVED' | 'REJECTED') => {
        if (!confirm(`Xác nhận ${status === 'RESOLVED' ? 'duyệt (đã xử lý)' : 'từ chối'} báo cáo này?`)) return;
        try {
            const token = JSON.parse(localStorage.getItem('userData') || '{}').token;
            const res = await fetch(
                `http://localhost:8080/api/report/status/${id}?status=${status}`,
                { method: 'PUT', headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (!res.ok) throw new Error(await res.text());
            alert(status === 'RESOLVED' ? '✅ Báo cáo đã được xử lý!' : '🚫 Báo cáo đã bị từ chối!');
            fetchReports();
        } catch (err: any) {
            alert(err.message || 'Không thể cập nhật trạng thái báo cáo!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'listings'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'hover:bg-gray-200'
                            }`}
                    >
                        Duyệt bài đăng
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === 'reports'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'hover:bg-gray-200'
                            }`}
                    >
                        Duyệt báo cáo
                    </button>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                {activeTab === 'listings' ? (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">
                            Danh sách bài đăng cần duyệt
                        </h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ) : listings.length === 0 ? (
                            <p className="text-gray-600 text-center mt-20">
                                Không có bài đăng nào cần duyệt.
                            </p>
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
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.description}
                                            </p>
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
                                                        onClick={() =>
                                                            handleVerify(item.listingId)
                                                        }
                                                        className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                                                    >
                                                        <CheckCircle size={16} /> Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeny(item.listingId)
                                                        }
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
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">
                            Danh sách báo cáo người dùng
                        </h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ) : reports.length === 0 ? (
                            <p className="text-gray-600 text-center mt-20">
                                Không có báo cáo nào.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reports.map((r) => (
                                    <div
                                        key={r.reportId}
                                        className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="text-red-500" />
                                                <h3 className="font-semibold text-gray-800">
                                                    Báo cáo #{r.reportId}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-1">
                                                <strong>Người báo cáo:</strong> {r.reporterName || 'Ẩn danh'}
                                            </p>
                                            <p className="text-sm text-gray-700 mb-1">
                                                <strong>Email:</strong> {r.reporterEmail}
                                            </p>
                                            <p className="text-sm text-gray-700 mb-1">
                                                <strong>Bài đăng:</strong> {r.listingTitle || 'Không xác định'}
                                            </p>
                                            <p className="text-sm text-gray-700 mb-2">
                                                <strong>Lý do:</strong> {r.reason}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Ngày: {new Date(r.createdAt).toLocaleString('vi-VN')}
                                            </p>
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={() =>
                                                    handleReportAction(r.reportId, 'RESOLVED')
                                                }
                                                className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                                            >
                                                <CheckCircle size={16} /> Duyệt
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleReportAction(r.reportId, 'REJECTED')
                                                }
                                                className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                                            >
                                                <XCircle size={16} /> Từ chối
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modal chi tiết bài đăng */}
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
                        <p className="text-gray-700 whitespace-pre-line mb-2">
                            {selected.description}
                        </p>
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
