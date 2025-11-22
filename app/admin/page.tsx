'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Eye, Loader2, AlertTriangle, Pencil } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'subscriptions' | 'users'>('listings');
    const [listings, setListings] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [editForm, setEditForm] = useState({
        subName: "",
        subDetails: "",
        subPrice: "",
        duration: 0,
        priorityLevel: 0,
        status: "ACTIVE"
    });


    const router = useRouter();
    // Lấy role từ localStorage
    const stored = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
    const userData = stored ? JSON.parse(stored) : null;
    const role = userData?.role?.roleName || userData?.role || '';

    // ✅ Kiểm tra quyền truy cập
    useEffect(() => {
        if (!userData || (role !== 'ADMIN' && role !== 'MODERATOR')) {
            alert('🚫 Bạn không có quyền truy cập trang này!');
            router.push('/');
        }
    }, [router, role, userData]);

    // get token
    const getToken = () => JSON.parse(localStorage.getItem('userData') || '{}').token;

    // 🚀 Lấy danh sách bài cần duyệt
    const fetchListings = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/listing/pending', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            setListings(await res.json());
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
            const res = await fetch('http://localhost:8080/api/report/pending', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            setReports(await res.json());
        } catch (err: any) {
            alert(err.message || 'Lỗi khi tải danh sách báo cáo!');
        } finally {
            setLoading(false);
        }
    };

    // 🧾 Lấy danh sách gói đăng ký
    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/subscription', {
                // const res = await fetch('https://mocki.io/v1/07e7bd8a-194b-4172-a058-9aa3cb495fb1', {

                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            setSubscriptions(await res.json());
        } catch (err: any) {
            alert(err.message || 'Không thể tải danh sách gói đăng ký!');
        } finally {
            setLoading(false);
        }
    };

    // 👤 Lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/users/list", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            // const res = await fetch("https://mocki.io/v1/00b22952-75d7-465d-b542-0a1a85d5f761", {
            //     headers: { Authorization: `Bearer ${getToken()}` },
            // });
            if (!res.ok) throw new Error(await res.text());
            setUsers(await res.json());
        } catch (err: any) {
            alert(err.message || "Không tải được danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };


    // Tự động tải dữ liệu theo tab
    useEffect(() => {
        if (activeTab === 'listings') fetchListings();
        else if (activeTab === 'reports') fetchReports();
        else if (activeTab === 'subscriptions') fetchSubscriptions();
        else if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    // ✅ Duyệt bài
    const handleVerify = async (id: string) => {
        if (!confirm('Xác nhận duyệt bài này?')) return;
        try {
            const res = await fetch(`http://localhost:8080/api/listing/approve/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
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

        const reason = window.prompt('Nhập lý do từ chối (sẽ gửi cho người đăng):', 'Nội dung không phù hợp');
        if (reason === null) return; // user cancelled

        try {
            const res = await fetch(`http://localhost:8080/api/listing/reject/${id}?reason=${encodeURIComponent(reason)}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(await res.text());
            alert('❌ Từ chối thành công! Lý do đã được gửi tới người dùng.');
            fetchListings();
        } catch (err: any) {
            alert(err.message || 'Không thể từ chối!');
        }
    };

    // ✅ Duyệt / từ chối báo cáo
    const handleReportAction = async (id: number, status: 'RESOLVED' | 'REJECTED') => {
        // Confirm first
        if (!confirm(`Xác nhận ${status === 'RESOLVED' ? 'duyệt (đã xử lý)' : 'từ chối'} báo cáo này?`)) return;

        try {
            const token = getToken();

            if (status === 'REJECTED') {
                // Keep existing behavior for reject: update report status to REJECTED
                const res = await fetch(`http://localhost:8080/api/report/status/${id}?status=${status}`, {
                    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(await res.text());
                alert('🚫 Báo cáo đã bị từ chối!');
                fetchReports();
                return;
            }

            // For RESOLVED, ask admin which action to perform
            // Offer three choices: ban listing, ban user, or just resolve
            const input = window.prompt(
                'Chọn hành động cho báo cáo:\n1 - Banned listing (khóa bài đăng)\n2 - Banned user (khóa tài khoản người bán)\n3 - Chỉ đánh dấu đã xử lý (Resolve only)\nNhập 1, 2 hoặc 3',
                '1'
            );
            if (!input) return;

            const choice = input.trim();
            if (choice === '3') {
                // Just resolve via existing status endpoint
                const res = await fetch(`http://localhost:8080/api/report/status/${id}?status=RESOLVED`, {
                    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(await res.text());
                alert('✅ Báo cáo đã được đánh dấu là đã xử lý (Resolved)');
                fetchReports();
                return;
            }

            // Map choice to actionType expected by backend handleReport endpoint
            if (choice === '1' || choice === '2') {
                const actionType = choice === '1' ? 'bannedlisting' : 'banneduser';
                const handleRes = await fetch(`http://localhost:8080/api/report/handle/${id}?actionType=${encodeURIComponent(actionType)}`, {
                    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
                });
                if (!handleRes.ok) throw new Error(await handleRes.text());
                alert('✅ Báo cáo đã được xử lý: ' + actionType);
                fetchReports();
                return;
            }

            // option 4 (ban both) removed — admins can perform actions separately if needed

            // if user typed the action string directly, accept common variants
            const lower = choice.toLowerCase();
            if (lower.includes('ban') && lower.includes('list')) {
                const handleRes = await fetch(`http://localhost:8080/api/report/handle/${id}?actionType=bannedlisting`, {
                    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
                });
                if (!handleRes.ok) throw new Error(await handleRes.text());
                alert('✅ Báo cáo đã được xử lý: bannedlisting');
                fetchReports();
                return;
            }
            if (lower.includes('ban') && lower.includes('user')) {
                const handleRes = await fetch(`http://localhost:8080/api/report/handle/${id}?actionType=banneduser`, {
                    method: 'PUT', headers: { Authorization: `Bearer ${token}` }
                });
                if (!handleRes.ok) throw new Error(await handleRes.text());
                alert('✅ Báo cáo đã được xử lý: banneduser');
                fetchReports();
                return;
            }

            alert('Hành động không hợp lệ. Hủy.');
        } catch (err: any) {
            alert(err.message || 'Không thể cập nhật trạng thái báo cáo!');
        }
    };

    // 🚫 Ban user
    const handleBanUser = async (id: string) => {
        if (!confirm("Bạn có chắc muốn BAN user này?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/users/ban/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (!res.ok) throw new Error(await res.text());
            alert("🚫 User đã bị BAN!");
            fetchUsers();
        } catch (err: any) {
            alert(err.message || "Không thể ban user!");
        }
    };


    // 💾 Cập nhật gói đăng ký
    const handleUpdateSubscription = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/subscription/updateSub/${selected.subId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify(editForm)
                }
            );

            if (!res.ok) throw new Error(await res.text());

            alert("✔ Cập nhật gói đăng ký thành công!");
            setSelected(null);
            fetchSubscriptions();
        } catch (err: any) {
            alert(err.message || "Không thể cập nhật gói đăng ký!");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
                <nav className="space-y-2">
                    {[
                        { key: 'listings', label: 'Duyệt bài đăng' },
                        { key: 'reports', label: 'Duyệt báo cáo' },
                        { key: 'subscriptions', label: 'Quản lý gói đăng ký' },
                        { key: 'users', label: 'Quản lý người dùng' }   // 👈 Thêm tab mới
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as any)}
                            className={`w-full text-left px-4 py-2 rounded-md font-medium ${activeTab === key ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-gray-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

            </aside>

            {/* Main content */}
            <main className="flex-1 p-8">
                {/* --- DUYỆT BÀI --- */}
                {activeTab === 'listings' && (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Danh sách bài đăng cần duyệt</h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ) : listings.length === 0 ? (
                            <p className="text-gray-600 text-center mt-20">Không có bài đăng nào cần duyệt.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* mapp listing */}
                                {listings.map((item) => (
                                    <div key={item.listingId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                                        <img src={item.imageUrls?.[0] || '/no-image.png'} alt={item.title} className="w-full h-40 object-cover" />
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                            <p className="text-yellow-700 font-bold mt-2">{item.price?.toLocaleString()} VNĐ</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <button
                                                    onClick={() => setSelected(item)}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    <Eye size={16} /> Chi tiết
                                                </button>
                                                <div className="flex gap-2">
                                                    {role === 'ADMIN' && (
                                                        <button
                                                            onClick={() => handleVerify(item.listingId)}
                                                            className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                                                        >
                                                            <CheckCircle size={16} /> Duyệt
                                                        </button>
                                                    )}
                                                    {role === 'ADMIN' && (
                                                        <button
                                                            onClick={() => handleDeny(item.listingId)}
                                                            className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                                                        >
                                                            <XCircle size={16} /> Từ chối
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* --- DUYỆT BÁO CÁO --- */}
                {activeTab === 'reports' && (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Danh sách báo cáo người dùng</h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ) : reports.length === 0 ? (
                            <p className="text-gray-600 text-center mt-20">Không có báo cáo nào.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reports.map((r) => (
                                    <div key={r.reportId} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="text-red-500" />
                                                <h3 className="font-semibold text-gray-800">Báo cáo #{r.reportId}</h3>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-1"><strong>Người báo cáo:</strong> {r.reporterName || 'Ẩn danh'}</p>
                                            <p className="text-sm text-gray-700 mb-1"><strong>Email:</strong> {r.reporterEmail}</p>
                                            <p className="text-sm text-gray-700 mb-1"><strong>Bài đăng:</strong> {r.listingTitle || 'Không xác định'}</p>
                                            <p className="text-sm text-gray-700 mb-2"><strong>Lý do:</strong> {r.reason}</p>
                                            <p className="text-xs text-gray-500">Ngày: {new Date(r.createdAt).toLocaleString('vi-VN')}</p>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            {/* 👁️ Nút Xem bài đăng */}
                                            {r.listingId && (
                                                <button
                                                    onClick={() => window.open(`/listing/${r.listingId}`, '_blank')}
                                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md"
                                                >
                                                    <Eye size={16} /> Xem bài đăng
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleReportAction(r.reportId, 'RESOLVED')}
                                                className="flex items-center gap-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                                            >
                                                <CheckCircle size={16} /> Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleReportAction(r.reportId, 'REJECTED')}
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

                {/* --- QUẢN LÝ NGƯỜI DÙNG --- */}
                {activeTab === 'users' && (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý người dùng</h1>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ) : users.length === 0 ? (
                            <p className="text-gray-600 text-center mt-20">Không có người dùng nào.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {users.map((u) => (
                                    <div key={u.userID} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">

                                        <div className="flex items-center gap-3 mb-3">
                                            <img
                                                src={u.avatarUrl || "/default-avatar.png"}
                                                className="w-14 h-14 rounded-full object-cover border"
                                                alt="avatar"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {u.userName || "Không tên"}
                                                </h3>
                                                <p className="text-sm text-gray-600">{u.userEmail}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-1">
                                            <strong>Role:</strong> {u.role?.roleName}
                                        </p>

                                        <p className="text-sm text-gray-700 mb-1">
                                            <strong>Phone:</strong> {u.phone || "Không có"}
                                        </p>

                                        <p className="text-sm text-gray-700 mb-1">
                                            <strong>Gói đăng ký:</strong> {u.subid?.subName || "Free/None"}
                                        </p>

                                        <p className="text-sm text-gray-700 mb-1">
                                            <strong>Trạng thái:</strong>
                                            <span
                                                className={
                                                    u.userStatus === "BANNED"
                                                        ? "text-red-600 font-semibold"
                                                        : "text-green-600 font-semibold"
                                                }
                                            >
                                                {u.userStatus}
                                            </span>
                                        </p>

                                        <div className="flex justify-end gap-2 mt-4">
                                            {/* 👁 Xem hồ sơ */}
                                            <button
                                                onClick={() => router.push(`/userprofile/${u.userID}`)}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md"
                                            >
                                                <Eye size={16} /> Profile
                                            </button>

                                            {/* 🔨 Ban user */}
                                            {u.userStatus !== "BANNED" && (
                                                <button
                                                    onClick={() => handleBanUser(u.userID)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                                                >
                                                    <XCircle size={16} /> Ban
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </>
                )}




                {/* --- QUẢN LÝ GÓI ĐĂNG KÝ --- */}
                {activeTab === 'subscriptions' && (
                    <>
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý gói đăng ký</h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                            </div>
                        ) : subscriptions.length === 0 ? (
                            <p className="text-gray-600 text-center mt-20">Không có gói đăng ký nào.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {subscriptions.map((s) => (
                                    <div key={s.subId} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
                                        <h3 className="text-lg font-semibold text-gray-800">{s.subName}</h3>
                                        <p className="text-sm text-gray-600 mb-2">Giá: {Number(s.subPrice).toLocaleString()} VNĐ</p>
                                        <p className="text-sm text-gray-600 mb-2">Thời hạn: {s.duration} ngày</p>
                                        <p className="text-sm text-gray-600 mb-2">Ưu tiên: {s.priorityLevel}</p>
                                        <p className="text-sm text-gray-500 line-clamp-3 mb-3">{s.subDetails}</p>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => { setSelected(s); setEditForm({ subName: s.subName || '', subDetails: s.subDetails || '', subPrice: String(s.subPrice || ''), duration: s.duration || 0, priorityLevel: s.priorityLevel || 0, status: s.status || 'ACTIVE' }); }}
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md"
                                            >
                                                <Pencil size={14} /> Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!confirm('Bạn có chắc muốn xóa gói này?')) return;
                                                    fetch(`http://localhost:8080/api/subscription/${s.subId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
                                                        .then(async (res) => {
                                                            if (!res.ok) throw new Error(await res.text());
                                                            alert('Xóa thành công');
                                                            fetchSubscriptions();
                                                        })
                                                        .catch((err) => alert(err.message || 'Không thể xóa gói'));
                                                }}
                                                className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                                            >
                                                <XCircle size={14} /> Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {selected && activeTab === 'subscriptions' && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white w-[500px] rounded-xl p-6 relative shadow-lg">
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-3 right-4 text-gray-600 hover:text-black"
                            >
                                ✕
                            </button>

                            <h2 className="text-xl font-bold mb-4">
                                Chỉnh sửa gói: {selected.subName}
                            </h2>

                            <div className="space-y-4">

                                <div>
                                    <label className="font-medium">Tên gói</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        value={editForm.subName}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, subName: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Chi tiết</label>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        value={editForm.subDetails}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, subDetails: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Giá (VNĐ)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        type="text"
                                        value={editForm.subPrice}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, subPrice: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Thời hạn (ngày)</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        type="number"
                                        value={editForm.duration}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                duration: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Mức ưu tiên</label>
                                    <input
                                        className="w-full p-2 border rounded"
                                        type="number"
                                        value={editForm.priorityLevel}
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                priorityLevel: Number(e.target.value),
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Trạng thái</label>
                                    <select
                                        className="w-full p-2 border rounded"
                                        value={editForm.status}
                                        onChange={(e) =>
                                            setEditForm({ ...editForm, status: e.target.value })
                                        }
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleUpdateSubscription}
                                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                )}

            </main>

            {/* --- Modal chi tiết bài đăng --- */}
            {/* Modal cũ */}
            {/* {selected && activeTab === 'listings' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] rounded-xl p-6 relative shadow-lg max-h-[80vh] overflow-auto">
                        <button onClick={() => setSelected(null)} className="absolute top-3 right-4 text-gray-600 hover:text-black">✕</button>
                        <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
                        <img src={selected.imageUrls?.[0] || '/no-image.png'} alt="Ảnh" className="w-full h-60 object-cover rounded-lg mb-4" />
                        <p className="text-gray-700 whitespace-pre-line mb-2">{selected.description}</p>
                        <p className="text-yellow-700 font-semibold mb-2">Giá: {selected.price?.toLocaleString()} VNĐ</p>
                        <p className="text-sm text-gray-500">
                            Thương hiệu: {selected.brand || 'Không có'} — Màu: {selected.color || 'N/A'}
                        </p>
                    </div>
                </div>
            )} */}
            {selected && activeTab === 'listings' && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[600px] rounded-xl p-6 relative shadow-lg max-h-[80vh] overflow-auto">
                        <button onClick={() => setSelected(null)} className="absolute top-3 right-4 text-gray-600 hover:text-black">✕</button>
                        <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
                        <img src={selected.imageUrls?.[0] || '/no-image.png'} alt="Ảnh" className="w-full h-60 object-cover rounded-lg mb-4" />
                        <p className="text-gray-700 whitespace-pre-line mb-2">{selected.description}</p>
                        <p className="text-yellow-700 font-semibold mb-2">Giá: {selected.price?.toLocaleString()} VNĐ</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Thương hiệu: {selected.brand || 'Không có'} — Màu: {selected.color || 'N/A'}
                        </p>

                        {/* ✅ Nút xem bài đăng */}
                        <button
                            onClick={() => window.open(`/listing/${selected.listingId}`, '_blank')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
                        >
                            👁️ Xem bài đăng
                        </button>
                    </div>
                </div>
            )}


            {/* single edit modal for subscriptions is above; removed duplicate info modal */}
        </div>
    );
}
