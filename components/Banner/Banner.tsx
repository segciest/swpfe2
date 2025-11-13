'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Shield } from 'lucide-react';

const HERO_IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=600&fit=crop',
        title: 'Xe Điện Thông Minh',
        subtitle: 'Khám phá dòng xe điện hiện đại nhất'
    },
    {
        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=600&fit=crop',
        title: 'Công Nghệ Xanh',
        subtitle: 'Thân thiện với môi trường, tiết kiệm chi phí'
    },
     {
        url: 'https://tse3.mm.bing.net/th/id/OIP.-0r9W0cIkujxst9Kb36qSQHaJQ?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        title: 'Công Xuất Lớn',
        subtitle: 'Đảm bảo cho chặng đường dài, tăng trải nghiệm !'
    },
      {
        url: 'https://i.pinimg.com/736x/b3/9a/66/b39a66a20f8bf8dc6c4044a4bef39838.jpg',
        title: 'Công Xuất Lớn',
        subtitle: 'Đảm bảo cho chặng đường dài, tăng trải nghiệm !'
    },
    {
        url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=600&fit=crop',
        title: 'Tương Lai Di Chuyển',
        subtitle: 'Trải nghiệm phương tiện giao thông tương lai'
    }
];

export default function Banner() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Auto slide
    useEffect(() => {
        if (!isAutoPlay) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlay]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
        setIsAutoPlay(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
        setIsAutoPlay(false);
    };

    // Hàm mở modal đăng tin từ Navbar
    const handleOpenCreateModal = () => {
        // Dispatch event để Navbar bắt và mở modal
        window.dispatchEvent(new CustomEvent('open-create-listing-modal'));
    };

    return (
        <div className="w-full bg-gradient-to-b from-yellow-50 to-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Main Banner với Hero Image Slideshow */}
                <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-6 group">
                    {/* Hero Images */}
                    {HERO_IMAGES.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                            
                            {/* Text content */}
                            <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-20">
                                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                    {image.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md">
                                    {image.subtitle}
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => router.push('/subscription')}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-full transition shadow-lg hover:shadow-xl"
                                    >
                                        Khám phá ngay
                                    </button>
                                    <button
                                        onClick={handleOpenCreateModal}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-3 rounded-full transition border-2 border-white"
                                    >
                                        Đăng tin miễn phí
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {HERO_IMAGES.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentSlide(index);
                                    setIsAutoPlay(false);
                                }}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    index === currentSlide
                                        ? 'bg-yellow-400 w-8'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Banner nhỏ - Giới thiệu gói đăng tin */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gói Cơ Bản */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-2 border-gray-200 hover:border-yellow-400">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Zap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Gói Cơ Bản</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Đăng tin miễn phí với các tính năng cơ bản
                        </p>
                        <ul className="space-y-2 mb-6 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> 5 bài đăng/tháng
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Hiển thị 7 ngày
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Hỗ trợ 24/7
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                        >
                            Bắt đầu ngay
                        </button>
                    </div>

                    {/* Gói Nâng Cao */}
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:scale-105 relative">
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PHỔ BIẾN
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white p-3 rounded-full">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Gói Nâng Cao</h3>
                        </div>
                        <p className="text-white mb-4">
                            Tăng khả năng hiển thị và bán hàng nhanh chóng
                        </p>
                        <ul className="space-y-2 mb-6 text-sm text-white">
                            <li className="flex items-center gap-2">
                                <span className="font-bold">✓</span> 20 bài đăng/tháng
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="font-bold">✓</span> Hiển thị 30 ngày
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="font-bold">✓</span> Ưu tiên lên TOP
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="font-bold">✓</span> Badge VIP
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="w-full bg-white hover:bg-gray-100 text-orange-600 font-semibold py-2 rounded-lg transition shadow-md"
                        >
                            🌟 Nâng cấp ngay
                        </button>
                    </div>

                    {/* Gói Premium */}
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-2 border-gray-200 hover:border-purple-400">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Gói Premium</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Gói cao cấp dành cho người bán chuyên nghiệp
                        </p>
                        <ul className="space-y-2 mb-6 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Không giới hạn bài đăng
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Hiển thị vĩnh viễn
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Lên TOP trang chủ
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Hỗ trợ ưu tiên
                            </li>
                        </ul>
                        <button
                            onClick={() => router.push('/subscription')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                        >
                            Nâng cấp ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
