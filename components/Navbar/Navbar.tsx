"use client";

import { useEffect, useState } from "react";
import { Bell, User, LogOut, UserCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [userData, setUserData] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem("userData");
        if (stored) {
            setUserData(JSON.parse(stored));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userData");
        setUserData(null);
        setShowUserMenu(false);
        router.push("/");
    };

    return (
        <nav className="w-full bg-yellow-400 border-b border-gray-200 shadow-sm px-4 py-2 flex items-center justify-between">
            {/* --- Logo --- */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
                <span className="font-bold text-lg text-gray-800">EV</span>
            </div>

            {/* --- Search box --- */}
            <div className="flex items-center bg-white rounded-full px-3 py-1 w-[320px] md:w-[400px]">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm, khu vực..."
                    className="flex-1 outline-none bg-transparent text-sm text-gray-700"
                />
                <button className="bg-yellow-400 text-gray-800 font-medium px-3 py-1 rounded-full text-sm">
                    Tìm
                </button>
            </div>

            {/* --- Right icons --- */}
            <div className="flex items-center space-x-4 relative">
                {/* Notification */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotify(!showNotify)}
                        className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    >
                        <Bell className="w-5 h-5 text-gray-700" />
                    </button>

                    {showNotify && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-md p-3 z-50">
                            <p className="text-sm text-gray-600">🔔 Không có thông báo nào</p>
                        </div>
                    )}
                </div>

                {/* User / Login */}
                <div className="relative">
                    {!userData ? (
                        <button
                            onClick={() => router.push("/login")}
                            className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                        >
                            <LogIn className="w-5 h-5 text-gray-700" />
                            <span className="text-sm text-gray-700">Đăng nhập</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
                        >
                            <UserCircle className="w-5 h-5 text-gray-700" />
                            <span className="text-sm text-gray-800 font-medium">{userData.userName}</span>
                        </button>
                    )}

                    {/* Dropdown user */}
                    {showUserMenu && userData && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md overflow-hidden z-50">
                            <button
                                onClick={() => {
                                    setShowUserMenu(false);
                                    router.push("/profile");
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                                <User className="w-4 h-4" /> Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
