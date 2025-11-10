'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, PieChart, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, AlertCircle, Package, UserPlus } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho API stats
interface DashboardStats {
    // Users
    totalUsers: number;
    activeUsers: number;
    bannedUsers: number;
    pendingUsers: number;
    // Subscriptions
    freeUsers: number;
    basicUsers: number;
    standardUsers: number;
    premiumUsers: number;
    vipUsers: number;
    // Listings
    activeListings: number;
    pendingListings: number;
    bannedListings: number;
    // Reports
    pendingReports: number;
    resolvedReports: number;
    rejectedReports: number;
    // Revenue
    totalRevenue: number;
    monthlyRevenue: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminChart() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    
    // State cho các bộ lọc NÂNG CAO (theo Figma)
    const [timeFilter, setTimeFilter] = useState<'7 Ngày' | '30 Ngày' | 'Theo Quý' | '1 Năm' | 'Tùy Chỉnh'>('30 Ngày');
    const [quickFilter, setQuickFilter] = useState<'Hôm nay' | 'Tuần này' | 'Tháng này' | 'Quý này' | 'Năm này' | null>(null);
    const [category, setCategory] = useState('all');
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
    
    const [activeTab, setActiveTab] = useState<'revenue' | 'users' | 'analysis'>('revenue');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [revenueGrowthData, setRevenueGrowthData] = useState<any>(null);
    const [subscriptionGrowthData, setSubscriptionGrowthData] = useState<any>(null);

    // Lấy dữ liệu thống kê từ API
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const storedUserData = localStorage.getItem('userData');
                if (!storedUserData) {
                    throw new Error('Vui lòng đăng nhập với tài khoản Admin.');
                }
                const { token } = JSON.parse(storedUserData);

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const baseUrl = 'http://localhost:8080/api/admin/dashboard';
                
                // Thêm category filter nếu không phải "all"
                const categoryParam = category !== 'all' ? `?category=${category}` : '';

                // Gọi các endpoint riêng biệt theo backend
                const [usersRes, subscriptionsRes, listingsRes, reportsRes, revenueRes, revenueGrowthRes, subscriptionGrowthRes] = await Promise.all([
                    fetch(`${baseUrl}/users${categoryParam}`, { headers }).catch(() => null),
                    fetch(`${baseUrl}/subscriptions${categoryParam}`, { headers }).catch(() => null),
                    fetch(`${baseUrl}/listings${categoryParam}`, { headers }).catch(() => null),
                    fetch(`${baseUrl}/reports${categoryParam}`, { headers }).catch(() => null),
                    fetch(`${baseUrl}/revenue${categoryParam}`, { headers }).catch(() => null),
                    fetch(`${baseUrl}/revenue-growth${categoryParam}`, { headers }).catch(() => null),
                    fetch(`${baseUrl}/subscriptions-growth${categoryParam}`, { headers }).catch(() => null)
                ]);

                // Kiểm tra nếu tất cả requests đều fail
                if (!usersRes && !subscriptionsRes && !listingsRes && !reportsRes && !revenueRes) {
                    throw new Error('Không thể kết nối đến backend. Vui lòng kiểm tra server đang chạy tại http://localhost:8080');
                }

                // Kiểm tra authorization
                if (usersRes && usersRes.status === 401) {
                    throw new Error('Bạn không có quyền truy cập trang này.');
                }

                // Parse responses với fallback data
                const [usersData, subscriptionsData, listingsData, reportsData, revenueData, revenueGrowth, subscriptionGrowth] = await Promise.all([
                    usersRes?.ok ? usersRes.json() : { totalUsers: 0, activeUsers: 0, bannedUsers: 0, pendingUsers: 0 },
                    subscriptionsRes?.ok ? subscriptionsRes.json() : { freeUsers: 0, basicUsers: 0, standardUsers: 0, premiumUsers: 0, vipUsers: 0 },
                    listingsRes?.ok ? listingsRes.json() : { activeListings: 0, pendingListings: 0, bannedListings: 0 },
                    reportsRes?.ok ? reportsRes.json() : { pendingReports: 0, resolvedReports: 0, rejectedReports: 0 },
                    revenueRes?.ok ? revenueRes.json() : { totalRevenue: 0, monthlyRevenue: 0 },
                    revenueGrowthRes?.ok ? revenueGrowthRes.json() : { revenue: { weekly: [], monthly: [], yearly: [] } },
                    subscriptionGrowthRes?.ok ? subscriptionGrowthRes.json() : { subscriptions: { weekly: [], monthly: [], yearly: [] } }
                ]);

                console.log('� Dashboard Data Loaded Successfully');
                console.log('📅 Monthly Revenue:', revenueData.monthlyRevenue);
                console.log('📈 Revenue Growth:', revenueGrowth);
                console.log('📊 Subscription Growth:', subscriptionGrowth);

                // Lưu growth data để dùng cho chart
                // setRevenueGrowthData(revenueGrowth.revenue || {});
                setRevenueGrowthData(revenueGrowth.revenue ?? revenueGrowth ?? {});

                setSubscriptionGrowthData(subscriptionGrowth.subscriptions || {});

                // Xử lý monthlyRevenue nếu là array
                let monthlyRevenueValue = 0;
                if (Array.isArray(revenueData.monthlyRevenue)) {
                    // Lấy tháng hiện tại (tháng cuối cùng trong array)
                    const currentMonth = revenueData.monthlyRevenue[revenueData.monthlyRevenue.length - 1];
                    monthlyRevenueValue = currentMonth?.value || currentMonth?.revenue || 0;
                } else if (typeof revenueData.monthlyRevenue === 'number') {
                    monthlyRevenueValue = revenueData.monthlyRevenue;
                }

                // Gộp dữ liệu từ các endpoint
                setStats({
                    // Users
                    totalUsers: usersData.totalUsers || 0,
                    activeUsers: usersData.activeUsers || 0,
                    bannedUsers: usersData.bannedUsers || 0,
                    pendingUsers: usersData.pendingUsers || 0,
                    // Subscriptions
                    freeUsers: subscriptionsData.freeUsers || 0,
                    basicUsers: subscriptionsData.basicUsers || 0,
                    standardUsers: subscriptionsData.standardUsers || 0,
                    premiumUsers: subscriptionsData.premiumUsers || 0,
                    vipUsers: subscriptionsData.vipUsers || 0,
                    // Listings
                    activeListings: listingsData.activeListings || 0,
                    pendingListings: listingsData.pendingListings || 0,
                    bannedListings: listingsData.bannedListings || 0,
                    // Reports
                    pendingReports: reportsData.pendingReports || 0,
                    resolvedReports: reportsData.resolvedReports || 0,
                    rejectedReports: reportsData.rejectedReports || 0,
                    // Revenue
                    totalRevenue: revenueData.totalRevenue || 0,
                    monthlyRevenue: monthlyRevenueValue
                });

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
                setError(errorMessage);
                console.error('❌ Error fetching dashboard data:', err);
                console.warn('⚠️ Đang sử dụng dữ liệu mặc định. Backend cần được khởi động tại http://localhost:8080');
                
                // Set default data để tránh crash
                setStats({
                    totalUsers: 0,
                    activeUsers: 0,
                    bannedUsers: 0,
                    pendingUsers: 0,
                    freeUsers: 0,
                    basicUsers: 0,
                    standardUsers: 0,
                    premiumUsers: 0,
                    vipUsers: 0,
                    activeListings: 0,
                    pendingListings: 0,
                    bannedListings: 0,
                    pendingReports: 0,
                    resolvedReports: 0,
                    rejectedReports: 0,
                    totalRevenue: 0,
                    monthlyRevenue: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [category]); // Re-fetch data khi category thay đổi

    // Apply quick filter khi data đã load
    useEffect(() => {
        if (quickFilter && customDateRange.start && customDateRange.end) {
            filterDataByDateRange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quickFilter, customDateRange]);

    // Cập nhật dữ liệu biểu đồ khi filter thay đổi hoặc khi có dữ liệu từ API
    useEffect(() => {
        if (!revenueGrowthData || !subscriptionGrowthData) {
            // Nếu chưa có dữ liệu thật, không làm gì
            return;
        }

        let revenueArray: any[] = [];
        let subscriptionArray: any[] = [];

        if (timeFilter === '7 Ngày') {
            revenueArray = revenueGrowthData.weekly || [];
            subscriptionArray = subscriptionGrowthData.weekly || [];
        } else if (timeFilter === '30 Ngày') {
            revenueArray = revenueGrowthData.monthly || [];
            subscriptionArray = subscriptionGrowthData.monthly || [];
        } else if (timeFilter === 'Theo Quý') {
            // Group monthly data thành quarterly (3 tháng/quý)
            const monthly = revenueGrowthData.monthly || [];
            revenueArray = monthly; // Tạm thời dùng monthly, backend cần API quarterly
            subscriptionArray = subscriptionGrowthData.monthly || [];
        } else if (timeFilter === '1 Năm') {
            revenueArray = revenueGrowthData.yearly || [];
            subscriptionArray = subscriptionGrowthData.yearly || [];
        } else if (timeFilter === 'Tùy Chỉnh') {
            // TODO: Implement custom date range với API
            revenueArray = revenueGrowthData.monthly || [];
            subscriptionArray = subscriptionGrowthData.monthly || [];
        }

        const combinedData = revenueArray.map((revenue: any, index: number) => {
            const subscription = subscriptionArray[index] || {};
            return {
                name: revenue.week || revenue.month || revenue.year || `${index + 1}`,
                "Doanh thu": revenue.amount || 0,
                "Đơn hàng": subscription.count || subscription.value || 0
            };
        });

        setChartData(combinedData);
    }, [timeFilter, quickFilter, category, customDateRange, revenueGrowthData, subscriptionGrowthData]);

    // Hàm xử lý filter
    const handleTimeFilter = (filter: '7 Ngày' | '30 Ngày'| 'Theo Quý' | '1 Năm' | 'Tùy Chỉnh') => {
        setTimeFilter(filter);
        setShowCustomDate(filter === 'Tùy Chỉnh');
        setQuickFilter(null); // Reset quick filter
        
        // Reset custom date range khi không phải Tùy Chỉnh
        if (filter !== 'Tùy Chỉnh') {
            setCustomDateRange({ start: '', end: '' });
        }
    };

    const handleQuickFilter = (filter: 'Hôm nay' | 'Tuần này' | 'Tháng này' | 'Quý này' | 'Năm này') => {
        setQuickFilter(filter);
        setTimeFilter('Tùy Chỉnh');
        setShowCustomDate(false);
        
        const today = new Date();
        let startDate = new Date();
        let endDate = new Date();
        
        switch (filter) {
            case 'Hôm nay':
                startDate = new Date(today.setHours(0, 0, 0, 0));
                endDate = new Date(today.setHours(23, 59, 59, 999));
                break;
                
            case 'Tuần này':
                // Tìm ngày đầu tuần (Thứ 2)
                const dayOfWeek = today.getDay();
                const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startDate = new Date(today);
                startDate.setDate(today.getDate() + daysToMonday);
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
                
            case 'Tháng này':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
                
            case 'Quý này':
                const currentQuarter = Math.floor(today.getMonth() / 3);
                startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
                endDate = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0, 23, 59, 59, 999);
                break;
                
            case 'Năm này':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;
        }
        
        // Format dates to YYYY-MM-DD cho input date
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        setCustomDateRange({
            start: formatDate(startDate),
            end: formatDate(endDate)
        });
        
        console.log(`📅 Quick Filter [${filter}]:`, {
            start: formatDate(startDate),
            end: formatDate(endDate)
        });
    };

    const handleApplyCustomDate = async () => {
        if (!customDateRange.start || !customDateRange.end) {
            alert('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc');
            return;
        }
        
        if (new Date(customDateRange.start) > new Date(customDateRange.end)) {
            alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
            return;
        }
        
        console.log('🔍 Applying custom date range:', customDateRange);
        
        try {
            const storedUserData = localStorage.getItem('userData');
            if (!storedUserData) {
                throw new Error('Vui lòng đăng nhập với tài khoản Admin.');
            }
            const { token } = JSON.parse(storedUserData);

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const baseUrl = 'http://localhost:8080/api/admin/dashboard';
            
            // Gọi API với custom date range
            const [revenueGrowthRes, subscriptionGrowthRes] = await Promise.all([
                fetch(`${baseUrl}/revenue-growth?start=${customDateRange.start}&end=${customDateRange.end}`, { headers }),
                fetch(`${baseUrl}/subscriptions-growth?start=${customDateRange.start}&end=${customDateRange.end}`, { headers })
            ]);

            if (revenueGrowthRes.ok && subscriptionGrowthRes.ok) {
                const [revenueGrowth, subscriptionGrowth] = await Promise.all([
                    revenueGrowthRes.json(),
                    subscriptionGrowthRes.json()
                ]);

                setRevenueGrowthData(revenueGrowth.revenue ?? revenueGrowth ?? {});
                setSubscriptionGrowthData(subscriptionGrowth.subscriptions ?? subscriptionGrowth ?? {});
                
                console.log('✅ Custom date data loaded successfully');
            } else {
                console.warn('⚠️ Custom date API not available, using default data');
                // Fallback: filter dữ liệu hiện tại theo date range
                filterDataByDateRange();
            }
        } catch (error) {
            console.error('❌ Error fetching custom date data:', error);
            // Fallback: filter dữ liệu hiện tại
            filterDataByDateRange();
        }
    };
    
    // Hàm filter data theo date range (fallback khi API không có)
    const filterDataByDateRange = () => {
        if (!revenueGrowthData || !customDateRange.start || !customDateRange.end) return;
        
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        
        // Filter monthly data trong range
        const filteredRevenue = (revenueGrowthData.monthly || []).filter((item: any) => {
            if (!item.month) return false;
            const itemDate = new Date(item.month);
            return itemDate >= startDate && itemDate <= endDate;
        });
        
        const filteredSubscriptions = (subscriptionGrowthData.monthly || []).filter((item: any) => {
            if (!item.month) return false;
            const itemDate = new Date(item.month);
            return itemDate >= startDate && itemDate <= endDate;
        });
        
        // Update chart data
        const combinedData = filteredRevenue.map((revenue: any, index: number) => {
            const subscription = filteredSubscriptions[index] || {};
            return {
                name: revenue.month || `${index + 1}`,
                "Doanh thu": revenue.amount || 0,
                "Đơn hàng": subscription.count || subscription.value || 0
            };
        });
        
        setChartData(combinedData);
        console.log('📊 Filtered chart data:', combinedData.length, 'items');
    };

    // Hàm định dạng số tiền
    const formatCurrency = (value: number | undefined | null) => {
        if (value === undefined || value === null) return '0';
        return value.toLocaleString('vi-VN');
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Không thể kết nối Backend</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                        <p className="text-sm text-gray-700 font-semibold mb-2">💡 Hướng dẫn khắc phục:</p>
                        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                            <li>Kiểm tra backend đang chạy tại <code className="bg-gray-100 px-1 rounded">localhost:8080</code></li>
                            <li>Đảm bảo bạn đã đăng nhập với tài khoản Admin</li>
                            <li>Kiểm tra các API endpoints đã được implement</li>
                        </ol>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Thử lại
                        </button>
                        <Link href="/" className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition inline-block">
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* NỘI DUNG CHÍNH */}
            <main className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Bộ Lọc Nâng Cao</h1>

                {/* TAB NAVIGATION - Theo Figma */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            activeTab === 'revenue'
                                ? 'bg-yellow-400 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Biểu Đồ Doanh Thu
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            activeTab === 'users'
                                ? 'bg-yellow-400 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Thống Kê Người Dùng
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            activeTab === 'analysis'
                                ? 'bg-yellow-400 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Biểu Đồ Phân Tích
                    </button>
                </div>

                {/* BỘ LỌC NÂNG CAO - Theo Figma */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Khoảng thời gian</h2>
                    
                    {/* Lọc thời gian chính */}
                    <div className="flex gap-2 mb-6">
                        {(['7 Ngày', '30 Ngày', 'Theo Quý', '1 Năm', 'Tùy Chỉnh'] as const).map(filter => (
                            <button
                                key={filter}
                                onClick={() => handleTimeFilter(filter)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                                    timeFilter === filter
                                        ? 'bg-yellow-400 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Date Picker cho Tùy Chỉnh */}
                    {showCustomDate && (
                        <div className="mb-6 border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chọn tùy chỉnh thời gian khoảng
                            </label>
                            <div className="flex items-center gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                                    <input
                                        type="date"
                                        value={customDateRange.start}
                                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                                    <input
                                        type="date"
                                        value={customDateRange.end}
                                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={handleApplyCustomDate}
                                    className="mt-5 px-6 py-2 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                                >
                                    Áp Dụng
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lọc theo danh mục */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lọc theo danh mục
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent min-w-[250px]"
                        >
                            <option value="all">Tất cả danh mục</option>
                            <option value="xe-dien">Xe Điện</option>
                            <option value="pin">Pin Xe Điện</option>
                            <option value="sac-xe">Sạc Xe</option>
                            <option value="goi-dang-tin">Gói Đăng Tin</option>
                        </select>
                    </div>

                    {/* Bộ lọc nhanh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bộ lọc nhanh
                        </label>
                        <div className="flex gap-2">
                            {(['Hôm nay', 'Tuần này', 'Tháng này', 'Quý này', 'Năm này'] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => handleQuickFilter(filter)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        quickFilter === filter
                                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* TAB: BIỂU ĐỒ DOANH THU */}
                {activeTab === 'revenue' && (
                    <>
                        {/* Thống kê header - theo Figma */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-600">
                                Thống kê cho: <span className="font-semibold text-gray-800">Tất cả danh mục • Tùy chỉnh</span>
                            </p>
                        </div>

                        {/* 4 THẺ THỐNG KÊ CHÍNH - Theo Figma Design */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Đơn Hàng Mới"
                                value={formatCurrency(stats?.pendingListings)}
                                percentageChange={`+ ${stats?.pendingListings ? Math.round((stats.pendingListings / (stats.activeListings + stats.pendingListings)) * 100) : 0} % so với kỳ trước`}
                                icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
                                iconBg="bg-blue-100"
                            />
                            <StatCard
                                title="Sản Phẩm Bán"
                                value={formatCurrency(stats?.activeListings)}
                                percentageChange={`+ ${stats?.activeListings ? Math.round((stats.activeListings / ((stats.activeListings + stats.bannedListings) || 1)) * 100) : 0} % so với kỳ trước`}
                                icon={<Package className="w-6 h-6 text-purple-500" />}
                                iconBg="bg-purple-100"
                            />
                            <StatCard
                                title="Khách Hàng Mới"
                                value={formatCurrency((stats?.pendingUsers || 0) + (stats?.activeUsers || 0))}
                                percentageChange={`+ ${stats?.totalUsers ? Math.round(((stats.activeUsers) / stats.totalUsers) * 100) : 0} % so với kỳ trước`}
                                icon={<UserPlus className="w-6 h-6 text-orange-500" />}
                                iconBg="bg-orange-100"
                            />
                            <StatCard
                                title="Tổng Doanh Thu"
                                value={`${formatCurrency(stats?.totalRevenue)} VNĐ`}
                                percentageChange={`+ 23 % so với kỳ trước`}
                                icon={<DollarSign className="w-6 h-6 text-green-500" />}
                                iconBg="bg-green-100"
                            />
                        </div>

                        {/* KPIs - Hàng 2 - Theo Figma */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Doanh thu trung bình/đơn</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {formatCurrency(
                                                stats?.activeListings && stats.activeListings > 0
                                                    ? Math.round(stats.totalRevenue / stats.activeListings)
                                                    : 200000
                                            )} VNĐ
                                        </p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <DollarSign className="w-6 h-6 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Sản phẩm/đơn hàng</p>
                                        <p className="text-2xl font-bold text-gray-800">2.6</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Tỷ lệ khách hàng mới</p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {stats?.totalUsers ? Math.round(((stats.activeUsers + stats.pendingUsers) / stats.totalUsers) * 100) : 71.2}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-pink-100 rounded-full">
                                        <Users className="w-6 h-6 text-pink-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BIỂU ĐỒ DOANH THU */}
                        <div className="bg-white p-6 rounded-lg shadow-lg h-[450px]">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Biểu Đồ Doanh Thu (Theo {timeFilter})</h2>
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }} barSize={60} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#6b7280"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        tickFormatter={(value) =>
                                            value > 1000000 ? `${value / 1000000}M` : `${value / 1000}K`
                                        }
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) =>
                                            `${value.toLocaleString('vi-VN')} ${name === 'Doanh thu' ? 'VNĐ' : 'đơn'}`
                                        }
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '20px',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}
                                        iconType="rect"
                                    />
                                    <Bar dataKey="Doanh thu" fill="#facc15" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Đơn hàng" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {/* TAB: THỐNG KÊ NGƯỜI DÙNG */}
                {activeTab === 'users' && (
                    <>
                        {/* KPI Cards - Người dùng */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Tổng Người Dùng"
                                value={formatCurrency((stats?.totalUsers || 0))}
                                percentageChange="+12%"
                                icon={<Users className="w-6 h-6 text-blue-600" />}
                                iconBg="bg-blue-100"
                            />
                            <StatCard
                                title="Người Dùng Hoạt Động"
                                value={formatCurrency((stats?.activeUsers || 0))}
                                percentageChange="+8%"
                                icon={<Users className="w-6 h-6 text-green-600" />}
                                iconBg="bg-green-100"
                            />
                            <StatCard
                                title="Người Dùng Mới"
                                value={formatCurrency((stats?.pendingUsers || 0))}
                                percentageChange="+15%"
                                icon={<UserPlus className="w-6 h-6 text-purple-600" />}
                                iconBg="bg-purple-100"
                            />
                            <StatCard
                                title="Người Dùng Bị Cấm"
                                value={formatCurrency((stats?.bannedUsers || 0))}
                                percentageChange="-5%"
                                icon={<AlertCircle className="w-6 h-6 text-red-600" />}
                                iconBg="bg-red-100"
                            />
                        </div>

                        {/* Tỉ lệ phần trăm người dùng */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tỉ Lệ Người Dùng Mới</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Người dùng mới đăng ký</span>
                                    <span className="text-sm font-bold text-purple-600">
                                        {stats?.totalUsers ? ((stats.pendingUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${stats?.totalUsers ? (stats.pendingUsers / stats.totalUsers) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {formatCurrency(stats?.pendingUsers || 0)} / {formatCurrency(stats?.totalUsers || 0)} người dùng
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tỉ Lệ Vi Phạm</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Người dùng bị cấm</span>
                                    <span className="text-sm font-bold text-red-600">
                                        {stats?.totalUsers ? ((stats.bannedUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-red-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${stats?.totalUsers ? (stats.bannedUsers / stats.totalUsers) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {formatCurrency(stats?.bannedUsers || 0)} / {formatCurrency(stats?.totalUsers || 0)} người dùng
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tỉ Lệ Hoạt Động</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Người dùng đang hoạt động</span>
                                    <span className="text-sm font-bold text-green-600">
                                        {stats?.totalUsers ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${stats?.totalUsers ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {formatCurrency(stats?.activeUsers || 0)} / {formatCurrency(stats?.totalUsers || 0)} người dùng
                                </p>
                            </div>
                        </div>

                        {/* Biểu đồ và thống kê chi tiết */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Biểu đồ tròn phân bổ người dùng */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Phân Bổ Người Dùng</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Hoạt động', value: stats?.activeUsers || 0, fill: '#10b981' },
                                                { name: 'Mới đăng ký', value: stats?.pendingUsers || 0, fill: '#8b5cf6' },
                                                { name: 'Bị cấm', value: stats?.bannedUsers || 0, fill: '#ef4444' }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {[
                                                { name: 'Hoạt động', value: stats?.activeUsers || 0, fill: '#10b981' },
                                                { name: 'Mới đăng ký', value: stats?.pendingUsers || 0, fill: '#8b5cf6' },
                                                { name: 'Bị cấm', value: stats?.bannedUsers || 0, fill: '#ef4444' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Thống kê gói đăng tin */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Phân Bổ Gói Đăng Tin</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Free', value: stats?.freeUsers || 0, fill: '#9ca3af' },
                                                { name: 'Basic', value: stats?.basicUsers || 0, fill: '#3b82f6' },
                                                { name: 'Standard', value: stats?.standardUsers || 0, fill: '#facc15' },
                                                { name: 'Premium', value: stats?.premiumUsers || 0, fill: '#f97316' },
                                                { name: 'VIP', value: stats?.vipUsers || 0, fill: '#8b5cf6' }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }: any) => (percent && percent > 0) ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {[
                                                { name: 'Free', value: stats?.freeUsers || 0, fill: '#9ca3af' },
                                                { name: 'Basic', value: stats?.basicUsers || 0, fill: '#3b82f6' },
                                                { name: 'Standard', value: stats?.standardUsers || 0, fill: '#facc15' },
                                                { name: 'Premium', value: stats?.premiumUsers || 0, fill: '#f97316' },
                                                { name: 'VIP', value: stats?.vipUsers || 0, fill: '#8b5cf6' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bảng thống kê chi tiết */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Chi Tiết Người Dùng Theo Gói</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỉ Lệ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-900">Free</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stats?.freeUsers || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stats?.totalUsers ? ((stats.freeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    Miễn phí
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-900">Basic</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stats?.basicUsers || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stats?.totalUsers ? ((stats.basicUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    Trả phí
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-900">Standard</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stats?.standardUsers || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stats?.totalUsers ? ((stats.standardUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Trả phí
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-900">Premium</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stats?.premiumUsers || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stats?.totalUsers ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                    Trả phí
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                                                    <span className="text-sm font-medium text-gray-900">VIP</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(stats?.vipUsers || 0)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {stats?.totalUsers ? ((stats.vipUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    Cao cấp
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* TAB: BIỂU ĐỒ PHÂN TÍCH */}
                {activeTab === 'analysis' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Phân tích theo loại gói */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Phân Bố Gói Đăng Ký</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Free', value: stats?.freeUsers || 0, color: '#9ca3af' },
                                                { name: 'Basic', value: stats?.basicUsers || 0, color: '#3b82f6' },
                                                { name: 'Standard', value: stats?.standardUsers || 0, color: '#10b981' },
                                                { name: 'Premium', value: stats?.premiumUsers || 0, color: '#f59e0b' },
                                                { name: 'VIP', value: stats?.vipUsers || 0, color: '#ef4444' }
                                            ]}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            // label={(entry) => entry.value > 0 ? `${entry.name}: ${entry.value}` : ''}
                                            label={({ name, value }) => (value as number) > 0 ? `${name}: ${value}` : ''}

                                        >
                                            {[
                                                { name: 'Free', value: stats?.freeUsers || 0, color: '#9ca3af' },
                                                { name: 'Basic', value: stats?.basicUsers || 0, color: '#3b82f6' },
                                                { name: 'Standard', value: stats?.standardUsers || 0, color: '#10b981' },
                                                { name: 'Premium', value: stats?.premiumUsers || 0, color: '#f59e0b' },
                                                { name: 'VIP', value: stats?.vipUsers || 0, color: '#ef4444' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${value} người dùng`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Xu hướng doanh thu */}
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Xu Hướng Doanh Thu (Dữ liệu thực)</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="name" stroke="#6b7280" />
                                        <YAxis
                                            stroke="#6b7280"
                                            tickFormatter={(value) =>
                                                value > 1000000 ? `${value / 1000000}M` : `${value / 1000}K`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value: number) => `${value.toLocaleString('vi-VN')} VNĐ`}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="Doanh thu" stroke="#10b981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bảng chi tiết theo gói */}
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Chi Tiết Người Dùng Theo Gói</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại Gói</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Người Dùng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ Lệ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {[
                                            { name: 'Free', count: stats?.freeUsers || 0, color: '#9ca3af' },
                                            { name: 'Basic', count: stats?.basicUsers || 0, color: '#3b82f6' },
                                            { name: 'Standard', count: stats?.standardUsers || 0, color: '#10b981' },
                                            { name: 'Premium', count: stats?.premiumUsers || 0, color: '#f59e0b' },
                                            { name: 'VIP', count: stats?.vipUsers || 0, color: '#ef4444' }
                                        ].map((pkg, index) => {
                                            const totalUsers = (stats?.freeUsers || 0) + (stats?.basicUsers || 0) + (stats?.standardUsers || 0) + (stats?.premiumUsers || 0) + (stats?.vipUsers || 0);
                                            const percentage = totalUsers > 0 ? Math.round((pkg.count / totalUsers) * 100) : 0;
                                            return (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: pkg.color }}></div>
                                                            <span className="font-medium text-gray-900">Gói {pkg.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {pkg.count} người dùng
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {percentage}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </main>
        </div>
    );
}

// Component Thẻ Thống Kê
interface StatCardProps {
    title: string;
    value: string;
    percentageChange: string;
    icon: React.ReactNode;
    iconBg?: string; // Optional background color cho icon
}

function StatCard({ title, value, percentageChange, icon, iconBg = 'bg-gray-100' }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mb-2">{value}</p>
                {percentageChange && (
                    <p className="text-xs text-green-500">{percentageChange}</p>
                )}
            </div>
            <div className={`p-3 rounded-full ${iconBg}`}>
                {icon}
            </div>
        </div>
    );
}