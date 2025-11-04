"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Phone,
    Mail,
    Calendar,
    MapPin,
    BadgeCheck,
    Crown,
} from "lucide-react";

interface Role {
    roleId: number;
    roleName: string;
}

interface Subscription {
    subId: number;
    subName: string;
    subDetails: string;
    subPrice: string;
    duration: number;
    priorityLevel: number;
    status: string;
}

interface UserProfile {
    userID: string;
    userName: string;
    userEmail: string;
    dob: string;
    role: Role;
    phone: string;
    subid: Subscription;
    userStatus: string;
    address: string | null;
    city: string | null;
    avatarUrl: string | null;
    verifiedCode: string | null;
}

interface Listing {
    listingId: string;
    title: string;
    price: number;
    imageUrls: string[];
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [showListings, setShowListings] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("userData");
        if (!stored) {
            router.push("/");
            return;
        }

        const { userId, token } = JSON.parse(stored);

        fetch(`http://localhost:8080/api/users/${userId}`, {
            // fetch(`https://mocki.io/v1/21423e7d-f4e8-40c5-98c1-969aa7a0ec0a`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setProfile(data))
            .catch((err) => console.error("Lỗi tải user profile:", err));
    }, [router]);

    // ✅ Gọi API lấy danh sách bài đăng của user
    const fetchUserListings = async () => {
        const stored = localStorage.getItem("userData");
        if (!stored) return alert("Bạn cần đăng nhập!");
        const { token } = JSON.parse(stored);

        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/listing/seller", {
                // const res = await fetch("https://mocki.io/v1/77c1921e-afc9-4c75-ab0b-4bf19ce48641", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Không thể tải bài đăng!");
            const data = await res.json();
            setListings(data);
            setShowListings(true);
        } catch (err: any) {
            alert(err.message || "Lỗi khi tải bài đăng!");
        } finally {
            setLoading(false);
        }
    };

    if (!profile)
        return <div className="p-6 text-gray-500">Đang tải thông tin người dùng...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-6 p-6">
            {/* --- CỘT TRÁI: Thông tin cá nhân --- */}
            <div className="lg:w-1/3 bg-white border rounded-2xl shadow-sm p-6 flex flex-col items-center">
                {/* Avatar */}
                <img
                    src={
                        profile.avatarUrl ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-orange-400 shadow mb-4 object-cover"
                />

                {/* Tên và trạng thái */}
                <h2 className="text-xl font-semibold text-gray-800">
                    {profile.userName}
                </h2>
                <p
                    className={`mt-1 text-sm font-medium ${profile.userStatus === "ACTIVE" ? "text-green-600" : "text-gray-500"
                        }`}
                >
                    {profile.userStatus === "ACTIVE"
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                </p>

                {/* Gói đăng ký */}
                <div className="mt-4 w-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl p-4 text-center shadow">
                    <div className="flex justify-center items-center gap-2 mb-1">
                        <Crown className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">{profile.subid.subName}</h3>
                    </div>
                    <p className="text-sm opacity-90">{profile.subid.subDetails}</p>
                    <p className="mt-1 text-xs opacity-80">
                        Thời hạn: {profile.subid.duration} ngày • Ưu tiên:{" "}
                        {profile.subid.priorityLevel}
                    </p>
                </div>

                {/* Thông tin cơ bản */}
                <div className="mt-6 space-y-3 w-full">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-5 h-5 text-orange-500" />
                        <span>{profile.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-5 h-5 text-orange-500" />
                        <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <span>{profile.dob}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span>{profile.city || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-5 h-5 text-orange-500" />
                        <span>Vai trò: {profile.role.roleName}</span>
                    </div>
                </div>

                {/* Nút thao tác */}
                <div className="mt-6 flex flex-col gap-2 w-full">
                    <button className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600">
                        ✏️ Chỉnh sửa trang cá nhân
                    </button>
                    <button className="border py-2 rounded-lg hover:bg-gray-100">
                        📤 Chia sẻ trang của bạn
                    </button>

                    {/* ✅ Nút mới: Quản lý bài đăng */}
                    <button
                        onClick={fetchUserListings}
                        className="border py-2 rounded-lg hover:bg-gray-100 text-orange-600 font-medium"
                    >
                        🛒 Quản lý bài đăng
                    </button>
                </div>

                {/* Xác thực */}
                <div className="mt-6 text-sm text-gray-600 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    {profile.verifiedCode ? "Đã xác thực" : "Chưa xác thực"}
                </div>
            </div>

            {/* --- CỘT PHẢI: Danh sách bài đăng --- */}
            <div className="flex-1 bg-white border rounded-2xl shadow-sm p-6">
                {loading ? (
                    <div className="text-center text-gray-500 py-10">
                        Đang tải bài đăng...
                    </div>
                ) : showListings ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                🛍️ Danh sách bài đăng ({listings.length})
                            </h2>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                                onClick={() => setShowListings(false)}
                            >
                                Ẩn danh sách
                            </button>
                        </div>

                        {listings.length === 0 ? (
                            <div className="text-gray-500 text-center py-10">
                                Bạn chưa có bài đăng nào.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((item) => (
                                    <div
                                        key={item.listingId}
                                        className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition group"
                                    >
                                        {/* Ảnh */}
                                        <div className="relative w-full h-48 overflow-hidden">
                                            <img
                                                src={item.imageUrls?.[0] || "/no-image.png"}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Nội dung */}
                                        <div className="p-4 flex flex-col justify-between h-[140px]">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-orange-600 font-bold mt-1 text-base">
                                                    {item.price.toLocaleString()} ₫
                                                </p>
                                            </div>

                                            {/* Nút chỉnh sửa */}
                                            <button
                                                onClick={() =>
                                                    router.push(`/edit-listing/${item.listingId}`)
                                                }
                                                className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-2 rounded-lg transition"
                                            >
                                                ✏️ Chỉnh sửa bài đăng
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 py-20">
                        <img
                            src="https://static.chotot.com/storage/chotot-icons/svg/no-ads.svg"
                            alt="no-ads"
                            className="w-24 h-24 opacity-70 mb-4"
                        />
                        <p className="text-lg">Bạn chưa có tin đăng nào</p>
                        <button
                            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                            onClick={fetchUserListings}
                        >
                            📄 XEM DANH SÁCH BÀI ĐĂNG
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
