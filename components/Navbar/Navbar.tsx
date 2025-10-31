// app/components/Navbar/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { ThemeToggleButton } from "@/app/components/ThemeToggleButton"; // <-- Sửa lại
// CẬP NHẬT CÁC ICON IMPORTS
import {
  User,
  LogOut,
  LogIn,
  UserCircle,
  Bolt,       // Icon cho Logo
  PlusCircle, // Icon cho nút "Đăng tin"
  Star        // Icon cho "Gói Ưu Đãi"
} from "lucide-react";

export default function Navbar() {
  const [userData, setUserData] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const handlePostClick = () => {
    if (userData) {
      router.push("/listings/create");
    } else {
      // ĐÃ SỬA:
      router.push("/login-register");
    }
  };

  return (
    <nav className="w-full bg-[#1a3a3a] text-white shadow-lg px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">

        {/* --- Phần 1: Logo (Left) --- */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Bolt className="w-8 h-8 text-green-400" />
            <span className="font-bold text-2xl">EV-Market</span>
          </Link>
        </div>

        {/* --- Phần 2: Nav Links (Center) --- */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          <Link href="/xe-dien" className="text-gray-200 hover:text-white transition-colors font-medium">
            Xe Điện
          </Link>
          <Link href="/pin-xe-dien" className="text-gray-200 hover:text-white transition-colors font-medium">
            Pin Xe Điện
          </Link>
        </div>

        {/* --- Phần 3: CTAs và User (Right) --- */}
        <div className="flex-1 flex items-center justify-end gap-3">
          
          {/* Nút Các Gói Ưu Đãi (NHẤN MẠNH) */}
          <Link
            href="/pricing"
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-full text-sm transition-colors"
          >
            <Star className="w-5 h-5" />
            <span>Các Gói Ưu Đãi</span>
          </Link>

          {/* Nút Đăng tin */}
          <button
            onClick={handlePostClick}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Đăng tin</span>
          </button>

          {/* THÊM NÚT DARK MODE VÀO ĐÂY */}
          <ThemeToggleButton />

          {/* User / Login */}
          {/* XÓA 'ml-2' ĐỂ KHOẢNG CÁCH ĐỒNG ĐỀU */}
          <div className="relative">
            {!userData ? (
              // Nút Đăng nhập
              <button
                // ĐÃ SỬA:
                onClick={() => router.push("/login-register")}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <LogIn className="w-5 h-5" />
                <span>Đăng Nhập</span>
              </button>
            ) : (
              // Menu người dùng
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <UserCircle className="w-8 h-8 text-gray-300 hover:text-white" />
                <span className="hidden md:block text-sm font-medium">{userData.userName}</span>
              </button>
            )}

            {/* Dropdown user */}
            {showUserMenu && userData && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 text-gray-800">
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