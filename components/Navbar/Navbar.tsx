// components/Navbar/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  LogIn,
  UserCircle,
  Bolt,
  PlusCircle,
  Star,
  Crown,
} from "lucide-react";
// KHÔNG CẦN ThemeToggleButton

export default function Navbar() {
  const [userData, setUserData] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Logic kiểm tra user
    const checkUserData = () => {
      const stored = localStorage.getItem("userData");
      if (stored) {
        setUserData(JSON.parse(stored));
      } else {
        setUserData(null);
      }
    };
    checkUserData();
    // Thêm listener để cập nhật Navbar nếu đăng nhập/đăng xuất ở tab khác
    window.addEventListener('storage', checkUserData);
    return () => {
      window.removeEventListener('storage', checkUserData);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null); 
    setShowUserMenu(false);
    // Gửi tín hiệu storage để các tab khác (nếu có) cũng cập nhật
    window.dispatchEvent(new Event("storage")); 
    router.push("/");
  };

  const handlePostClick = () => {
    if (userData) {
      router.push("/listings/create");
    } else {
      router.push("/login-register");
    }
  };

  return (
    // GIAO DIỆN MỚI: Nền gradient vàng, chữ đen
    <nav className={`
      w-full shadow-sm px-6 py-4 
      bg-gradient-to-r from-yellow-300 to-yellow-600 text-gray-900
    `}>
      <div className="container mx-auto flex items-center justify-between">

        {/* --- Phần 1: Logo (Left) --- */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo màu xanh lá đậm */}
            <Bolt className="w-8 h-8 text-green-800" />
            <span className="font-bold text-2xl text-green-900">EV-Market</span>
          </Link>
        </div>

        {/* --- Phần 2: Nav Links (Center) --- */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <Link href="/xe-dien" className="font-medium text-gray-800 hover:text-black transition-colors">
            Xe Điện
          </Link>
          <Link href="/pin-xe-dien" className="font-medium text-gray-800 hover:text-black transition-colors">
            Pin Xe Điện
          </Link>
        </div>

        {/* --- Phần 3: CTAs và User (Right) --- */}
        <div className="flex-1 flex items-center justify-end gap-3">
          
          {/* Nút Các Gói Ưu Đãi (Màu xanh dương) */}
          <Link
            href="/subscription" // Trỏ đến trang subscription
            className={`
              flex items-center gap-2 font-bold px-4 py-2 rounded-full text-sm transition-colors
              bg-blue-600 hover:bg-blue-700 text-white
            `}
          >
            <Crown className="w-5 h-5" />
            <span>Các Gói Ưu Đãi</span>
          </Link>

          {/* Nút Đăng tin (Màu cam) */}
          <button
            onClick={handlePostClick}
            className={`
              flex items-center gap-2 font-medium px-4 py-2 rounded-full text-sm transition-colors
              bg-orange-500 hover:bg-orange-600 text-white
            `}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Đăng tin</span>
          </button>

          {/* KHÔNG CÒN NÚT THEME */}

          {/* User / Login (Style cho nền vàng) */}
          <div className="relative ml-2"> 
            {!userData ? (
              <button
                onClick={() => router.push("/login-register")}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  bg-black/10 hover:bg-black/20 text-gray-800
                `}
              >
                <LogIn className="w-5 h-5" />
                <span>Đăng Nhập</span>
              </button>
            ) : (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <UserCircle className="w-8 h-8 text-gray-800 hover:opacity-80" />
                <span className="hidden md:block text-sm font-medium text-gray-800">{userData?.userName || 'User'}</span> 
              </button>
            )}

            {/* Dropdown user (vẫn nền trắng) */}
            {showUserMenu && userData && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 text-gray-800 border border-gray-200">
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Hồ sơ
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

