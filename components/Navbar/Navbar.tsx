'use client';

import { useState, useEffect } from 'react';
import { Bell, UserCircle, LogOut, LogIn, PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 1, name: 'Xe điện' },
    { id: 2, name: 'Xe máy điện' },
    { id: 3, name: 'Pin xe điện' },
];

export default function Navbar() {
    const router = useRouter();

    // State quản lý người dùng
    const [userData, setUserData] = useState<any | null>(null);
    const [isClient, setIsClient] = useState(false);

    // UI state
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showNotify, setShowNotify] = useState(false);

    // Form state (đăng bài)
    const [categoryId, setCategoryId] = useState<number>(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [seats, setSeats] = useState('');
    const [mileage, setMileage] = useState('');
    const [batteryCapacity, setBatteryCapacity] = useState('');
    const [cycleCount, setCycleCount] = useState('');
    const [warrantyInfo, setWarrantyInfo] = useState('');
    const [voltage, setVoltage] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ Kiểm tra localStorage khi component mount
    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem('userData');
        if (stored) setUserData(JSON.parse(stored));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        setUserData(null);
        setShowUserMenu(false);
        router.push('/');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (files.length + selectedFiles.length > 5) {
            alert('Tối đa 5 ảnh!');
            return;
        }
        setFiles([...files, ...selectedFiles]);

        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userData) {
            alert('Vui lòng đăng nhập để đăng bài!');
            return;
        }
        if (files.length === 0) {
            alert('Vui lòng chọn ít nhất 1 ảnh!');
            return;
        }

        setLoading(true);
        try {
            const listingData: any = {
                title,
                description,
                price: Number(price),
                categoryId,
                brand,
                model,
                year: year ? Number(year) : undefined,
                color,
            };

            if (categoryId === 1 || categoryId === 2) {
                if (seats) listingData.seats = Number(seats);
                if (mileage) listingData.mileage = Number(mileage);
                if (batteryCapacity) listingData.batteryCapacity = batteryCapacity;
                if (warrantyInfo) listingData.warrantyInfo = warrantyInfo;
            } else if (categoryId === 3) {
                if (cycleCount) listingData.cycleCount = Number(cycleCount);
                if (voltage) listingData.voltage = Number(voltage);
                if (batteryCapacity) listingData.batteryCapacity = batteryCapacity;
                if (warrantyInfo) listingData.warrantyInfo = warrantyInfo;
            }

            const formData = new FormData();
            formData.append('listing', new Blob([JSON.stringify(listingData)], { type: 'application/json' }));
            files.forEach(file => formData.append('files', file));

            const res = await fetch('http://localhost:8080/api/listing/create', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Đăng bài thất bại!');
            alert('🎉 Đăng bài thành công!');
            setShowCreateModal(false);
            setFiles([]);
            setPreviews([]);
            setTitle('');
            setDescription('');
            setPrice('');
        } catch (error: any) {
            alert(error.message || 'Đăng bài thất bại!');
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null; // ✅ tránh lỗi SSR khi truy cập localStorage

    return (
        <>
            {/* --- Navbar --- */}
            <nav className="w-full bg-yellow-400 border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between relative">
                {/* Logo */}
                <div
                    onClick={() => router.push('/')}
                    className="font-bold text-lg text-gray-800 cursor-pointer"
                >
                    EV Shop
                </div>

                {/* Search */}
                <div className="flex items-center bg-white rounded-full px-3 py-1 w-[320px] md:w-[400px]">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="flex-1 outline-none bg-transparent text-sm text-gray-700"
                    />
                    <button className="bg-yellow-400 text-gray-800 font-medium px-3 py-1 rounded-full text-sm">
                        Tìm
                    </button>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4 relative">
                    {/* 🔔 Notification (chỉ hiện khi user login) */}
                    {userData && (
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowNotify(!showNotify);
                                    setShowUserMenu(false);
                                }}
                                className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            >
                                <Bell className="w-5 h-5 text-gray-700" />
                            </button>

                            <AnimatePresence>
                                {showNotify && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-md p-3 z-[999]"
                                    >
                                        <p className="text-sm text-gray-700">
                                            Bạn chưa có thông báo nào
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* ➕ Đăng bài (chỉ hiện khi user login) */}
                    {userData && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                        >
                            <PlusCircle className="w-5 h-5 text-gray-700" />
                            <span className="text-sm text-gray-800 font-medium">Đăng bài</span>
                        </button>
                    )}

                    {/* 👤 User menu / Đăng nhập */}
                    {!userData ? (
                        <button
                            onClick={() => router.push('/login')}
                            className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                        >
                            <LogIn className="w-5 h-5 text-gray-700" />
                            <span className="text-sm text-gray-700">Đăng nhập</span>
                        </button>
                    ) : (
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowUserMenu(!showUserMenu);
                                    setShowNotify(false);
                                }}
                                className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                            >
                                <UserCircle className="w-5 h-5 text-gray-700" />
                                <span className="text-sm font-medium">{userData.userName}</span>
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden z-[999]"
                                    >
                                        <button
                                            onClick={() => router.push('/profile')}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Hồ sơ
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" /> Đăng xuất
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- Modal đăng bài --- */}
            <AnimatePresence>
                {showCreateModal && userData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 overflow-auto pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl w-[600px] p-6 relative shadow-lg my-10 pointer-events-auto"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-3 right-3 text-gray-600 hover:text-black"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold mb-4">Đăng tin mới</h2>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(Number(e.target.value))}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Tiêu đề"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                    required
                                />

                                <textarea
                                    placeholder="Mô tả chi tiết"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                    required
                                />

                                <input
                                    type="number"
                                    placeholder="Giá (VNĐ)"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                    required
                                />

                                {categoryId !== 3 && (
                                    <>
                                        <input
                                            type="number"
                                            placeholder="Số chỗ ngồi"
                                            value={seats}
                                            onChange={(e) => setSeats(e.target.value)}
                                            className="border rounded-lg px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Quãng đường đã đi (km)"
                                            value={mileage}
                                            onChange={(e) => setMileage(e.target.value)}
                                            className="border rounded-lg px-3 py-2 text-sm"
                                        />
                                    </>
                                )}

                                {categoryId === 3 && (
                                    <>
                                        <input
                                            type="number"
                                            placeholder="Số chu kỳ sạc"
                                            value={cycleCount}
                                            onChange={(e) => setCycleCount(e.target.value)}
                                            className="border rounded-lg px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Điện áp (V)"
                                            value={voltage}
                                            onChange={(e) => setVoltage(e.target.value)}
                                            className="border rounded-lg px-3 py-2 text-sm"
                                        />
                                    </>
                                )}

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                />

                                {previews.length > 0 && (
                                    <div className="grid grid-cols-5 gap-2 mt-2">
                                        {previews.map((preview, idx) => (
                                            <div key={idx} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`preview-${idx}`}
                                                    className="w-full h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 rounded-lg mt-3 transition"
                                >
                                    {loading ? 'Đang đăng...' : 'Đăng tin'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
