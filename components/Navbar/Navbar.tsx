'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, UserCircle, LogOut, LogIn, PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { id: 1, name: 'Xe điện (Ô tô)' },
    { id: 2, name: 'Xe máy điện' },
    { id: 3, name: 'Pin xe điện' },
];

// Validate dữ liệu theo form input với đơn vị theo từng field
function InputWithUnit({
    placeholder,
    value,
    onChange,
    unit,
    type = "number",
}: {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unit: string;
    type?: string;
}) {
    return (
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={(e) => {
                    const val = e.target.value.replace(/[^\d.]/g, ""); // chỉ số hoặc dấu .
                    onChange({ ...e, target: { ...e.target, value: val } } as any);
                }}
                placeholder={placeholder}
                className="w-full pr-12 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute right-3 top-2.5 text-gray-500 text-sm select-none">
                {unit}
            </span>
        </div>
    );
}

export default function Navbar() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");



    // Common fields
    const [categoryId, setCategoryId] = useState<number>(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    // Shared technical fields
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [mileage, setMileage] = useState('');
    const [batteryCapacity, setBatteryCapacity] = useState('');
    const [voltage, setVoltage] = useState('');
    const [batteryLifeRemaining, setBatteryLifeRemaining] = useState('');
    const [warrantyInfo, setWarrantyInfo] = useState('');

    // Car only
    const [seats, setSeats] = useState('');
    // Battery only
    const [cycleCount, setCycleCount] = useState('');
    // Images
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Kiểm tra đăng nhập
    useEffect(() => {
        const stored = localStorage.getItem('userData');
        if (stored) {
            setUserData(JSON.parse(stored));
        }
    }, []);

    // Helper: xác định user có quyền admin/manager hay không
    const isAdminOrManager = (u: any) => {
        if (!u) return false;
        // common shapes: u.role === 'ADMIN' or u.role.roleName === 'ADMIN' or u.roles = [{roleName:'ADMIN'}]
        try {
            if (typeof u.role === 'string') {
                const r = u.role.toUpperCase();
                if (r === 'ADMIN' || r === 'MANAGER') return true;
            }
            if (u.role && typeof u.role === 'object') {
                const rn = (u.role.roleName || u.role.name || '').toString().toUpperCase();
                if (rn === 'ADMIN' || rn === 'MANAGER') return true;
            }
            if (Array.isArray(u.roles)) {
                for (const item of u.roles) {
                    const rn = (item.roleName || item.name || item).toString().toUpperCase();
                    if (rn === 'ADMIN' || rn === 'MANAGER') return true;
                }
            }
            if (Array.isArray(u.authorities)) {
                for (const a of u.authorities) {
                    if (String(a).toUpperCase().includes('ADMIN') || String(a).toUpperCase().includes('MANAGER')) return true;
                }
            }
        } catch (e) {
            // fallback false
        }
        return false;
    };

    // Event listener để mở modal từ Banner
    useEffect(() => {
        const handleOpenModal = () => {
            setShowCreateModal(true);
        };
        
        window.addEventListener('open-create-listing-modal', handleOpenModal);
        
        return () => {
            window.removeEventListener('open-create-listing-modal', handleOpenModal);
        };
    }, []);

    // ✅ Hàm gọi API tìm kiếm
    const handleSearch = async () => {
        if (!searchText.trim()) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/listing/search/title?title=${encodeURIComponent(searchText)}`
            );
            if (!res.ok) throw new Error("Không thể tìm kiếm");
            const data = await res.json();

            // 🔥 Gửi event chứa kết quả về cho trang chủ
            window.dispatchEvent(new CustomEvent("search-results", { detail: data }));
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
            alert("Không thể tải kết quả tìm kiếm!");
        }
    };


    // 🔔 Gọi API lấy danh sách thông báo khi mở menu thông báo
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userData || !showNotify) return;
            try {
                const res = await fetch(`http://localhost:8080/api/notifications/${userData.userId}`);
                if (!res.ok) throw new Error("Không thể tải thông báo");
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error("Lỗi khi tải thông báo:", err);
                setNotifications([]);
            }
        };
        fetchNotifications();
    }, [showNotify, userData]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setUserData(null);
        router.push('/');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (files.length + selectedFiles.length > 5) {
            alert('Tối đa 5 ảnh!');
            return;
        }

        setFiles([...files, ...selectedFiles]);
        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews((prev) => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) return alert('Vui lòng đăng nhập để đăng bài!');
        if (files.length === 0) return alert('Vui lòng chọn ít nhất 1 ảnh!');

        // Client-side validation
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) return alert('Giá phải là một số lớn hơn 0');

        if (year) {
            const yearNum = Number(year);
            if (isNaN(yearNum) || yearNum < 2010 || yearNum > 2025) return alert('Năm sản xuất phải nằm trong khoảng 2010 - 2025');
        }

        if (categoryId === 1 && seats) {
            const seatsNum = Number(seats);
            if (isNaN(seatsNum) || seatsNum < 2 || seatsNum > 7) return alert('Số chỗ hợp lệ: 2 - 7');
        }

        if (categoryId === 3 && cycleCount) {
            const cycleNum = Number(cycleCount);
            if (isNaN(cycleNum) || cycleNum < 0) return alert('Số chu kỳ không hợp lệ');
        }

        setLoading(true);
        try {
            const listingData: any = {
                title,
                description,
                price: priceNum,
                category: { categoryId },
                brand,
                model,
                year: year ? Number(year) : undefined,
                color,
                vehicleType,
                mileage: mileage ? String(mileage) : undefined,
                batteryCapacity,
                voltage,
                batteryLifeRemaining,
                warrantyInfo,
            };

            if (categoryId === 1) listingData.seats = seats ? Number(seats) : undefined;
            if (categoryId === 3) listingData.cycleCount = cycleCount ? Number(cycleCount) : undefined;

            const formData = new FormData();
            formData.append('listing', JSON.stringify(listingData));
            files.forEach((file) => formData.append('files', file));

            const token = userData?.token;
            const res = await fetch('http://localhost:8080/api/listing/create', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Đăng bài thất bại!');
            }
            alert('🎉 Đăng bài thành công, đang chờ duyệt!');
            setShowCreateModal(false);
            setFiles([]);
            setPreviews([]);
            setTitle('');
            setDescription('');
            setPrice('');
        } catch (err: any) {
            alert(err.message || 'Lỗi khi đăng bài');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* NAVBAR */}
            <nav className="w-full bg-yellow-400 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between relative">
                <div onClick={() => router.push('/')} className="font-bold text-lg text-gray-800 cursor-pointer">
                    ⚡ EV Shop
                </div>

                {/* Thanh tìm kiếm */}
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-[320px] md:w-[400px]">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài đăng..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-yellow-400 text-gray-800 font-medium px-3 py-1 rounded-full text-sm ml-2"
                    >
                        Tìm
                    </button>
                </div>


                <div className="flex items-center gap-4 relative">
                    {/* Thông báo */}
                    {userData && (
                        <button
                            onClick={() => setShowNotify(!showNotify)}
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                        >
                            <Bell className="w-5 h-5 text-gray-700" />
                        </button>
                    )}

                    {/* MENU THÔNG BÁO */}
                    {showNotify && (
                        <div className="absolute right-20 top-12 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                            <div className="px-4 py-2 border-b font-semibold text-gray-800 flex justify-between items-center">
                                🔔 Thông báo
                                <button
                                    onClick={() => setShowNotify(false)}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    Đóng
                                </button>
                            </div>

                            {notifications.length === 0 ? (
                                <div className="p-4 text-sm text-gray-600 text-center">
                                    Hiện chưa có thông báo mới.
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {notifications.map((noti) => (
                                        <li key={noti.notificationId} className="p-3 hover:bg-gray-50">
                                            <p className="text-sm text-gray-800">{noti.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(noti.createdTime).toLocaleString('vi-VN')}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Đăng bài */}
                    {userData && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                        >
                            <PlusCircle className="w-5 h-5 text-gray-700" />
                            <span className="text-sm text-gray-800 font-medium">Đăng bài</span>
                        </button>
                    )}

                    {/* 🌟 Gói đăng ký */}
                    <button
                        onClick={() => router.push('/subscription')}
                        className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                    >
                        <span className="text-sm text-gray-800 font-medium">🌟 Gói đăng ký</span>
                    </button>

                    {/* User */}
                    {!userData ? (
                        <button
                            onClick={() => router.push('/login-register')}
                            className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                        >
                            <LogIn className="w-5 h-5 text-gray-700" />
                            <span className="text-sm text-gray-700">Đăng nhập</span>
                        </button>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                            >
                                <UserCircle className="w-5 h-5 text-gray-700" />
                                <span className="text-sm font-medium">{userData.userName}</span>
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden z-50">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                isAdminOrManager(userData) ? '/admin' : '/profile'
                                            )
                                        }
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        {isAdminOrManager(userData) ? 'Admin Dashboard' : 'Hồ sơ'}
                                    </button>

                                    <button
                                        onClick={() =>
                                            router.push(
                                                '/payment-history'
                                            )
                                        }
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Lịch sử giao dịch
                                    </button>

                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/favorites`
                                            )
                                        }
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Bài đăng yêu thích
                                    </button>

                                    {isAdminOrManager(userData) && (
                                        <button
                                            onClick={() => router.push('/admin/chart')}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Admin chart
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* MODAL ĐĂNG BÀI */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="bg-white rounded-2xl w-[720px] p-8 relative shadow-xl my-10"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-black"
                            >
                                <X size={22} />
                            </button>

                            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                                📝 Đăng tin mới
                            </h2>

                            {/* Form đăng bài */}
                            {/* Modal cũ */}
                            {/* <form onSubmit={handleSubmit} className="space-y-4">
                                Danh mục
                                <div className="flex justify-center gap-3 mb-4">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategoryId(cat.id)}
                                            className={`px-4 py-2 rounded-full font-medium border transition ${categoryId === cat.id
                                                ? 'bg-yellow-400 border-yellow-500 text-gray-900 shadow'
                                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                Các trường
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
                                    <input placeholder="Giá (VNĐ)" value={price} onChange={(e) => setPrice(e.target.value)} className="input" />
                                    <input placeholder="Thương hiệu" value={brand} onChange={(e) => setBrand(e.target.value)} className="input" />
                                    <input placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} className="input" />
                                    <input placeholder="Năm SX" value={year} onChange={(e) => setYear(e.target.value)} className="input" />
                                    <input placeholder="Màu sắc" value={color} onChange={(e) => setColor(e.target.value)} className="input" />
                                    <input placeholder="Loại xe / pin" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="input" />
                                    {categoryId === 1 && (
                                        <input placeholder="Số chỗ ngồi" value={seats} onChange={(e) => setSeats(e.target.value)} className="input" />
                                    )}
                                    {categoryId === 3 && (
                                        <input placeholder="Số chu kỳ sạc" value={cycleCount} onChange={(e) => setCycleCount(e.target.value)} className="input" />
                                    )}
                                    <input placeholder="Dung lượng pin (kWh/Ah)" value={batteryCapacity} onChange={(e) => setBatteryCapacity(e.target.value)} className="input" />
                                    <input placeholder="Điện áp (V)" value={voltage} onChange={(e) => setVoltage(e.target.value)} className="input" />
                                    <input placeholder="Pin còn lại (VD: 90%)" value={batteryLifeRemaining} onChange={(e) => setBatteryLifeRemaining(e.target.value)} className="input" />
                                    <input placeholder="Bảo hành" value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} className="input" />
                                </div>

                                <textarea
                                    placeholder="Mô tả chi tiết..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input h-24"
                                />

                                Ảnh
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">📸 Hình ảnh sản phẩm (tối đa 5 ảnh)</p>
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="input" />
                                    {previews.length > 0 && (
                                        <div className="grid grid-cols-5 gap-2 mt-3">
                                            {previews.map((preview, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`preview-${idx}`}
                                                        className="w-full h-20 object-cover rounded border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 hidden group-hover:flex items-center justify-center"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 rounded-lg mt-3 transition"
                                >
                                    {loading ? 'Đang đăng...' : '🚀 Đăng tin'}
                                </button>
                            </form> */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Tiêu đề & mô tả */}
                                <input
                                    type="text"
                                    placeholder="Tiêu đề bài đăng"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400"
                                />

                                <textarea
                                    placeholder="Mô tả chi tiết sản phẩm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400"
                                    rows={3}
                                />

                                {/* Giá và danh mục */}
                                <div className="grid grid-cols-2 gap-4">
                                    <InputWithUnit
                                        placeholder="Giá bán"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        unit="VNĐ"
                                    />

                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(Number(e.target.value))}
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        <option value={1}>Xe điện (Ô tô)</option>
                                        <option value={2}>Xe điện (Xe máy)</option>
                                        <option value={3}>Pin xe điện</option>
                                    </select>
                                </div>

                                {/* Thông tin cơ bản */}
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Thương hiệu"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Model"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                    <InputWithUnit
                                        placeholder="Năm sản xuất"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        unit=""
                                    />
                                    <input
                                        type="text"
                                        placeholder="Màu sắc"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>

                                {/* Các thông số kỹ thuật có đơn vị */}
                                <div className="grid grid-cols-2 gap-4">
                                    <InputWithUnit
                                        placeholder="Dung lượng pin"
                                        value={batteryCapacity}
                                        onChange={(e) => setBatteryCapacity(e.target.value)}
                                        unit="kWh"
                                    />

                                    <InputWithUnit
                                        placeholder="Điện áp"
                                        value={voltage}
                                        onChange={(e) => setVoltage(e.target.value)}
                                        unit="V"
                                    />

                                    <InputWithUnit
                                        placeholder="Pin còn lại"
                                        value={batteryLifeRemaining}
                                        onChange={(e) => setBatteryLifeRemaining(e.target.value)}
                                        unit="%"
                                    />

                                    <InputWithUnit
                                        placeholder="Quãng đường đã đi"
                                        value={mileage}
                                        onChange={(e) => setMileage(e.target.value)}
                                        unit="Km"
                                    />
                                </div>

                                {/* Thông tin bảo hành */}
                                <input
                                    type="text"
                                    placeholder="Thông tin bảo hành (VD: 12 tháng)"
                                    value={warrantyInfo}
                                    onChange={(e) => setWarrantyInfo(e.target.value)}
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                />

                                {/* Theo danh mục */}
                                {categoryId === 1 && (
                                    <InputWithUnit
                                        placeholder="Số chỗ ngồi"
                                        value={seats}
                                        onChange={(e) => setSeats(e.target.value)}
                                        unit="chỗ"
                                    />
                                )}
                                {categoryId === 3 && (
                                    <InputWithUnit
                                        placeholder="Số chu kỳ sạc"
                                        value={cycleCount}
                                        onChange={(e) => setCycleCount(e.target.value)}
                                        unit="lần"
                                    />
                                )}

                                {/* Ảnh sản phẩm */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Hình ảnh (tối đa 5)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setFiles(Array.from(e.target.files || []))}
                                        className="w-full text-sm"
                                    />
                                </div>

                                {/* Nút hành động */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md"
                                    >
                                        {loading ? 'Đang đăng...' : 'Đăng bài'}
                                    </button>
                                </div>
                            </form>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}