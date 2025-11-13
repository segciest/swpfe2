'use client';

import { Leaf, Target, Shield, Award, TrendingUp, Users } from 'lucide-react';

export default function SubscriptionBanner() {
    return (
        <div className="w-full relative text-gray-900 py-12 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Background Image - Hợp tác công nghệ */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=800&fit=crop"
                    alt="Tech Collaboration"
                    className="w-full h-full object-cover opacity-50"
                />
                {/* Overlay trong suốt để thấy rõ ảnh */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-blue-50/40 to-purple-50/50"></div>
                {/* Pattern overlay cho depth */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            {/* Hiệu ứng nền động - pastel */}
            <div className="absolute inset-0 opacity-20 z-0">
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Tiêu đề chính */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Nâng Tầm Kinh Doanh Cùng Chúng Tôi
                    </h1>
                    <p className="text-xl text-gray-600">
                        Trách nhiệm - Sứ mệnh - Chuyên nghiệp - Bền vững
                    </p>
                </div>

                {/* Grid 3 cột - Giá trị cốt lõi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Trách nhiệm môi trường */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-500 p-3 rounded-full group-hover:scale-110 transition shadow-lg">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Trách Nhiệm Môi Trường</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Chúng tôi cam kết thúc đẩy giao thông xanh, giảm thiểu khí thải carbon, 
                            và xây dựng tương lai bền vững cho thế hệ mai sau thông qua việc 
                            phổ biến xe điện.
                        </p>
                    </div>

                    {/* Sứ mệnh kinh doanh */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-500 p-3 rounded-full group-hover:scale-110 transition shadow-lg">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Sứ Mệnh Kết Nối</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Kết nối người mua và người bán xe điện một cách minh bạch, 
                            tin cậy và hiệu quả. Tạo ra nền tảng thương mại điện tử 
                            hàng đầu cho ngành xe điện tại Việt Nam.
                        </p>
                    </div>

                    {/* Chuyên nghiệp */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-purple-500 p-3 rounded-full group-hover:scale-110 transition shadow-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Chuyên Nghiệp & Uy Tín</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Dịch vụ đẳng cấp với hệ thống xác minh nghiêm ngặt, 
                            bảo mật thông tin tuyệt đối, và hỗ trợ khách hàng 24/7 
                            từ đội ngũ chuyên nghiệp giàu kinh nghiệm.
                        </p>
                    </div>
                </div>

                {/* PHẦN CHẠY CHỮ - CHUYÊN NGHIỆP & NGHIÊM TÚC */}
                <div className="space-y-5 mt-8">
                    {/* Marquee Chính - Sang trọng, chuyên nghiệp */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl py-5 overflow-hidden shadow-xl border-2 border-blue-300">
                        {/* Hiệu ứng subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"></div>
                        
                        {/* Marquee chạy ngang */}
                        <div className="relative flex animate-marquee-professional whitespace-nowrap">
                            {[1, 2, 3].map((loop) => (
                                <div key={loop} className="flex items-center gap-12 px-12">
                                    <div className="flex items-center gap-3">
                                        <Award className="w-6 h-6 text-yellow-300" />
                                        <span className="text-white font-semibold text-lg tracking-wide">
                                            Cam Kết Chất Lượng Dịch Vụ
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-green-300" />
                                        <span className="text-white font-semibold text-lg tracking-wide">
                                            Tăng Trưởng Bền Vững
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-blue-200" />
                                        <span className="text-white font-semibold text-lg tracking-wide">
                                            Cộng Đồng 10,000+ Thành Viên
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Leaf className="w-6 h-6 text-emerald-300" />
                                        <span className="text-white font-semibold text-lg tracking-wide">
                                            Vì Môi Trường Xanh Sạch
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-cyan-300" />
                                        <span className="text-white font-semibold text-lg tracking-wide">
                                            Bảo Mật & An Toàn Tuyệt Đối
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Target className="w-6 h-6 text-purple-200" />
                                        <span className="text-white font-semibold text-lg tracking-wide">
                                            Nền Tảng Uy Tín #1 Việt Nam
                                        </span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hàng 2: Fade In/Out - Chuyên nghiệp */}
                    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl py-4 overflow-hidden shadow-lg border-2 border-indigo-300">
                        <div className="flex justify-center items-center">
                            <span className="text-white font-bold text-xl tracking-wider animate-fade-slide uppercase">
                                Dịch Vụ Uy Tín • Chất Lượng Hàng Đầu • Đối Tác Tin Cậy
                            </span>
                        </div>
                    </div>

                    {/* Hàng 3: Typing Effect - Tối giản, nghiêm túc */}
                    <div className="relative bg-white rounded-xl py-4 overflow-hidden shadow-lg border-2 border-gray-200">
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-gray-700 font-medium text-lg tracking-wide">
                                Hỗ Trợ Khách Hàng 24/7 • Phản Hồi Trong 5 Phút
                            </span>
                        </div>
                    </div>
                </div>

                {/* Số liệu thống kê */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-md">
                        <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                        <div className="text-gray-700 font-medium">Thành Viên Tin Dùng</div>
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200 shadow-md">
                        <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                        <div className="text-gray-700 font-medium">Giao Dịch Thành Công</div>
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-md">
                        <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                        <div className="text-gray-700 font-medium">Khách Hàng Hài Lòng</div>
                    </div>
                    <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-200 shadow-md">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                        <div className="text-gray-700 font-medium">Hỗ Trợ Không Ngừng</div>
                    </div>
                </div>
            </div>

            {/* CSS cho animations chuyên nghiệp */}
            <style jsx>{`
                /* 1. Marquee chuyên nghiệp - chạy ổn định */
                @keyframes marquee-professional {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-33.333%);
                    }
                }
                .animate-marquee-professional {
                    animation: marquee-professional 25s linear infinite;
                }
                .animate-marquee-professional:hover {
                    animation-play-state: paused;
                }

                /* 2. Fade Slide - Mượt mà */
                @keyframes fade-slide {
                    0%, 100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    50% {
                        opacity: 0.9;
                        transform: translateX(5px);
                    }
                }
                .animate-fade-slide {
                    animation: fade-slide 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
