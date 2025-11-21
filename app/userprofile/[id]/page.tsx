"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, User, Phone, Mail, MapPin, Crown, Calendar } from "lucide-react";

export default function UserProfilePage() {
    const { id } = useParams();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Lấy token từ localStorage
    const getToken = () =>
        JSON.parse(localStorage.getItem("userData") || "{}")?.token;

    // Fetch user theo ID
    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8080/api/users/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });

            if (!res.ok) throw new Error("Không thể tải dữ liệu người dùng!");

            const data = await res.json();
            setUser(data);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchUser();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!user) {
        return <p className="text-center mt-20 text-gray-500">Không tìm thấy người dùng.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-12 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">

                {/* Avatar + Tên */}
                <div className="flex flex-col items-center">
                    <img
                        src={user.avatarUrl || "/default-avatar.png"}
                        alt="avatar"
                        className="w-32 h-32 rounded-full object-cover border shadow"
                    />
                    <h1 className="text-2xl font-bold mt-4 text-gray-800">
                        {user.userName}
                    </h1>
                    <p className="text-gray-500">{user.role?.roleName}</p>
                </div>

                {/* Thông tin cá nhân */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                            <User size={18} /> Thông tin cơ bản
                        </h2>
                        <p className="text-gray-700 flex items-center gap-2">
                            <Mail size={16} /> {user.userEmail}
                        </p>
                        <p className="text-gray-700 flex items-center gap-2 mt-2">
                            <Phone size={16} /> {user.phone || "Không có"}
                        </p>
                        <p className="text-gray-700 flex items-center gap-2 mt-2">
                            <Calendar size={16} /> {user.dob || "Không có"}
                        </p>
                        <p className="text-gray-700 flex items-center gap-2 mt-2">
                            <MapPin size={16} /> {user.address || "Không có"}, {user.city || ""}
                        </p>
                        <p className="mt-3 text-gray-700">
                            <strong>Trạng thái: </strong>
                            <span
                                className={
                                    user.userStatus === "BANNED"
                                        ? "text-red-600 font-semibold"
                                        : "text-green-600 font-semibold"
                                }
                            >
                                {user.userStatus}
                            </span>
                        </p>
                    </div>

                    {/* Thông tin gói đăng ký */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                            <Crown size={18} /> Gói đăng ký
                        </h2>

                        {user.subid ? (
                            <>
                                <p className="text-gray-700">
                                    <strong>Tên gói:</strong> {user.subid.subName}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Chi tiết:</strong> {user.subid.subDetails}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Giá:</strong>{" "}
                                    {Number(user.subid.subPrice).toLocaleString()}₫
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Mức ưu tiên:</strong> {user.subid.priorityLevel}
                                </p>
                                <p className="text-gray-700 mt-2">
                                    <strong>Thời hạn:</strong> {user.subid.duration} ngày
                                </p>
                            </>
                        ) : (
                            <p className="text-gray-600 italic">Không có gói đăng ký</p>
                        )}
                    </div>
                </div>

                {/* Nút quay lại */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
