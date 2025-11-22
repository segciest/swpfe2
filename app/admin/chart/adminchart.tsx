'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, PieChart, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, CreditCard, AlertCircle, TrendingUp } from 'lucide-react';

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
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [timeFilter, setTimeFilter] = useState<'7 Ngày' | '30 Ngày' | 'Tùy Chỉnh'>('30 Ngày');
    const [activeTab, setActiveTab] = useState<'report' | 'analysis'>('report');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [revenueGrowthData, setRevenueGrowthData] = useState<any>(null);
    const [subscriptionGrowthData, setSubscriptionGrowthData] = useState<any>(null);
    const [quarterlyData, setQuarterlyData] = useState<any[]>([]);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

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

                // Gọi các endpoint riêng biệt theo backend
                const [usersRes, subscriptionsRes, listingsRes, reportsRes, revenueRes, revenueGrowthRes, subscriptionGrowthRes, quarterlyRes] = await Promise.all([
                    fetch(`${baseUrl}/users`, { headers }),
                    fetch(`${baseUrl}/subscriptions`, { headers }),
                    fetch(`${baseUrl}/listings`, { headers }),
                    fetch(`${baseUrl}/reports`, { headers }),
                    fetch(`${baseUrl}/revenue`, { headers }),
                    fetch(`${baseUrl}/revenue-growth`, { headers }),
                    fetch(`${baseUrl}/subscriptions-growth`, { headers }),
                    fetch(`${baseUrl}/quarterly-revenue`, { headers })
                ]);

                if (!usersRes.ok || !subscriptionsRes.ok || !listingsRes.ok || !reportsRes.ok || !revenueRes.ok) {
                    if (usersRes.status === 401 || subscriptionsRes.status === 401) {
                        throw new Error('Bạn không có quyền truy cập trang này.');
                    }
                    throw new Error('Không thể tải dữ liệu từ backend.');
                }

                const [usersData, subscriptionsData, listingsData, reportsData, revenueData, revenueGrowth, subscriptionGrowth, quarterlyDataResponse] = await Promise.all([
                    usersRes.json(),
                    subscriptionsRes.json(),
                    listingsRes.json(),
                    reportsRes.json(),
                    revenueRes.json(),
                    revenueGrowthRes.json(),
                    subscriptionGrowthRes.json(),
                    quarterlyRes.ok ? quarterlyRes.json() : { quarters: [] }
                ]);

                console.log('📊 Revenue Data:', revenueData);
                console.log('💰 Total Revenue:', revenueData.totalRevenue);
                console.log('📅 Monthly Revenue:', revenueData.monthlyRevenue);
                console.log('📈 Revenue Growth:', revenueGrowth);
                console.log('📊 Subscription Growth:', subscriptionGrowth);

                // Lưu growth data để dùng cho chart
                // setRevenueGrowthData(revenueGrowth.revenue || {});
                setRevenueGrowthData(revenueGrowth.revenue ?? revenueGrowth ?? {});

                setSubscriptionGrowthData(subscriptionGrowth.subscriptions || {});

                // Set quarterly data từ API
                setQuarterlyData(quarterlyDataResponse.quarters || []);

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
                setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
                console.error('❌ Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    // Function để lấy dữ liệu theo custom date range
    const fetchCustomDateData = async () => {
        if (!customStartDate || !customEndDate) {
            alert('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc!');
            return;
        }

        try {
            const storedUserData = localStorage.getItem('userData');
            if (!storedUserData) return;
            const { token } = JSON.parse(storedUserData);

            const response = await fetch(
                `http://localhost:8080/api/admin/dashboard/custom-range?startDate=${customStartDate}&endDate=${customEndDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const customData = await response.json();
                setChartData(customData.chartData || []);
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu custom:', error);
        }
    };

    // Cập nhật dữ liệu biểu đồ khi filter thay đổi hoặc khi có dữ liệu từ API
    useEffect(() => {
        if (!revenueGrowthData || !subscriptionGrowthData) {
            // Nếu chưa có dữ liệu thật, không làm gì
            return;
        }

        let revenueArray: any[] = [];

        if (timeFilter === '7 Ngày') {
            revenueArray = revenueGrowthData.weekly || [];
        } else if (timeFilter === '30 Ngày') {
            revenueArray = revenueGrowthData.monthly || [];
        }
        // else if (timeFilter === 'Theo Quý') {
        //     // Sử dụng quarterly data thật từ API
        //     const quarterData = quarterlyData.map((quarter: any) => ({
        //         name: `Q${quarter.quarter}`,
        //         "Doanh thu": quarter.revenue || 0,
        //         quarter: quarter.quarter,
        //         year: quarter.year
        //     }));
        //     setChartData(quarterData);
        //     return;
        // } 
        else if (timeFilter === 'Tùy Chỉnh') {
            setShowCustomDatePicker(true);
            return;
        }

        // Tạo dữ liệu chart từ revenue data
        const combinedData = revenueArray.map((revenue: any, index: number) => {
            return {
                name: revenue.week || revenue.month || revenue.year || `${index + 1}`,
                "Doanh thu": revenue.amount || 0,
            };
        });

        setChartData(combinedData);
    }, [timeFilter, revenueGrowthData, subscriptionGrowthData, quarterlyData]);

    // Hàm định dạng số tiền
    const formatCurrency = (value: number | undefined | null) => {
        if (value === undefined || value === null) return '0';
        return value.toLocaleString('vi-VN');
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Đã xảy ra lỗi</h2>
                    <p className="text-gray-700">{error}</p>
                    <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
                        Về trang chủ
                    </Link>
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
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Biểu Đồ Doanh Thu</h1>

                {/* TAB NAVIGATION */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'report'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        📊 Báo Cáo Doanh Thu
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'analysis'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        📈 Phân Tích Doanh Thu
                    </button>
                </div>

                {/* TAB: BÁO CÁO DOANH THU */}
                {activeTab === 'report' && (
                    <>
                        {/* BỘ LỌC THỜI GIAN */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(['7 Ngày', '30 Ngày', 'Tùy Chỉnh'] as const).map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => {
                                        setTimeFilter(filter);
                                        if (filter !== 'Tùy Chỉnh') {
                                            setShowCustomDatePicker(false);
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm
                    ${timeFilter === filter
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* CUSTOM DATE PICKER */}
                        {showCustomDatePicker && (
                            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-3">Tùy chỉnh khoảng thời gian</h4>
                                <div className="flex gap-4 items-end">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Từ ngày:</label>
                                        <input
                                            type="date"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Đến ngày:</label>
                                        <input
                                            type="date"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={fetchCustomDateData}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* THỐNG KÊ THEO QUÝ THẬT */}
                        {/* {timeFilter === 'Theo Quý' && quarterlyData.length > 0 && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">📅 Thống Kê Theo Quý ({new Date().getFullYear()})</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {quarterlyData.map((quarter, index) => {
                                        const prevRevenue = index > 0 ? quarterlyData[index - 1].revenue : 0;
                                        const growthPercent = prevRevenue > 0 
                                            ? ((quarter.revenue - prevRevenue) / prevRevenue * 100).toFixed(1)
                                            : '0';
                                        
                                        return (
                                            <div key={quarter.quarter} className="bg-white p-4 rounded-lg shadow-sm">
                                                <h4 className="font-semibold text-gray-600 mb-2">Quý {quarter.quarter} (Q{quarter.quarter})</h4>
                                                <div className="text-2xl font-bold text-blue-600 mb-1">
                                                    {formatCurrency(quarter.revenue)} VNĐ
                                                </div>
                                                <div className={`text-sm ${
                                                    parseFloat(growthPercent) >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {parseFloat(growthPercent) >= 0 ? '+' : ''}{growthPercent}% vs Q{index > 0 ? index : 'trước'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 p-3 bg-white rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tổng doanh thu năm {new Date().getFullYear()}:</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {formatCurrency(quarterlyData.reduce((sum, q) => sum + q.revenue, 0))} VNĐ
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-gray-600">Trung bình mỗi quý:</span>
                                        <span className="text-lg font-semibold text-blue-600">
                                            {formatCurrency(Math.round(quarterlyData.reduce((sum, q) => sum + q.revenue, 0) / quarterlyData.length))} VNĐ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )} */}

                        {/* THẺ THỐNG KÊ - Tổng quan */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Thống Kê Tổng Quan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                            <StatCard
                                title="Tổng Doanh Thu"
                                value={`${formatCurrency(stats?.totalRevenue)} VNĐ`}
                                percentageChange={`Tháng này: ${formatCurrency(stats?.monthlyRevenue)} VNĐ`}
                                icon={<DollarSign className="w-6 h-6 text-green-500" />}
                            />
                            <StatCard
                                title="Tổng Người Dùng"
                                value={formatCurrency(stats?.totalUsers)}
                                percentageChange="Tất cả người dùng"
                                icon={<Users className="w-6 h-6 text-blue-500" />}
                            />
                            <StatCard
                                title="Tổng Tin Đăng"
                                value={formatCurrency((stats?.activeListings || 0) + (stats?.pendingListings || 0) + (stats?.bannedListings || 0))}
                                percentageChange="Tất cả tin đăng"
                                icon={<ShoppingCart className="w-6 h-6 text-purple-500" />}
                            />
                            <StatCard
                                title="Tổng Report"
                                value={formatCurrency((stats?.pendingReports || 0) + (stats?.resolvedReports || 0) + (stats?.rejectedReports || 0))}
                                percentageChange="Tất cả report"
                                icon={<AlertCircle className="w-6 h-6 text-orange-500" />}
                            />
                            <StatCard
                                title="Tăng Trưởng"
                                value="+12%"
                                percentageChange="So với tháng trước"
                                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                            />
                            <StatCard
                                title="Chuyển Đổi"
                                value="3.2%"
                                percentageChange="Tỷ lệ chuyển đổi"
                                icon={<CreditCard className="w-6 h-6 text-purple-600" />}
                            />
                        </div>

                        {/* Thống kê Người Dùng */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">👥 Thống Kê Người Dùng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                            <StatCard
                                title="Đang Hoạt Động"
                                value={formatCurrency(stats?.activeUsers)}
                                percentageChange="Active users"
                                icon={<Users className="w-6 h-6 text-green-500" />}
                            />
                            <StatCard
                                title="Chờ Duyệt"
                                value={formatCurrency(stats?.pendingUsers)}
                                percentageChange="Pending users"
                                icon={<Users className="w-6 h-6 text-yellow-500" />}
                            />
                            <StatCard
                                title="Bị Khóa"
                                value={formatCurrency(stats?.bannedUsers)}
                                percentageChange="Banned users"
                                icon={<Users className="w-6 h-6 text-red-500" />}
                            />
                            <StatCard
                                title="Tỷ Lệ Hoạt Động"
                                value={`${stats?.totalUsers && stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%`}
                                percentageChange="Active rate"
                                icon={<Users className="w-6 h-6 text-blue-500" />}
                            />
                            <StatCard
                                title="Mới Hôm Nay"
                                value="+24"
                                percentageChange="Người dùng mới"
                                icon={<Users className="w-6 h-6 text-green-600" />}
                            />
                            <StatCard
                                title="Online"
                                value={`${Math.round((stats?.activeUsers || 0) * 0.15)}`}
                                percentageChange="Đang trực tuyến"
                                icon={<Users className="w-6 h-6 text-indigo-500" />}
                            />
                        </div>

                        {/* Thống kê Gói Đăng Ký */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">💎 Thống Kê Gói Đăng Ký</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                            <StatCard
                                title="Free"
                                value={formatCurrency(stats?.freeUsers)}
                                percentageChange="Gói miễn phí"
                                icon={<CreditCard className="w-6 h-6 text-gray-400" />}
                            />
                            <StatCard
                                title="Basic"
                                value={formatCurrency(stats?.basicUsers)}
                                percentageChange="Gói cơ bản"
                                icon={<CreditCard className="w-6 h-6 text-blue-400" />}
                            />
                            <StatCard
                                title="Standard"
                                value={formatCurrency(stats?.standardUsers)}
                                percentageChange="Gói tiêu chuẩn"
                                icon={<CreditCard className="w-6 h-6 text-green-400" />}
                            />
                            <StatCard
                                title="Premium"
                                value={formatCurrency(stats?.premiumUsers)}
                                percentageChange="Gói cao cấp"
                                icon={<CreditCard className="w-6 h-6 text-purple-400" />}
                            />
                            <StatCard
                                title="VIP"
                                value={formatCurrency(stats?.vipUsers)}
                                percentageChange="Gói VIP"
                                icon={<CreditCard className="w-6 h-6 text-yellow-400" />}
                            />
                        </div>

                        {/* Thống kê Tin Đăng */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">📝 Thống Kê Tin Đăng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                title="Đang Hoạt Động"
                                value={formatCurrency(stats?.activeListings)}
                                percentageChange="Active listings"
                                icon={<ShoppingCart className="w-6 h-6 text-green-500" />}
                            />
                            <StatCard
                                title="Chờ Duyệt"
                                value={formatCurrency(stats?.pendingListings)}
                                percentageChange="Pending listings"
                                icon={<ShoppingCart className="w-6 h-6 text-yellow-500" />}
                            />
                            <StatCard
                                title="Bị Khóa"
                                value={formatCurrency(stats?.bannedListings)}
                                percentageChange="Banned listings"
                                icon={<ShoppingCart className="w-6 h-6 text-red-500" />}
                            />
                            <StatCard
                                title="Hôm Nay"
                                value="+8"
                                percentageChange="Tin đăng mới"
                                icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
                            />
                        </div>

                        {/* Thống kê Report */}
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">🚨 Thống Kê Report</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                title="Chờ Xử Lý"
                                value={formatCurrency(stats?.pendingReports)}
                                percentageChange="Pending reports"
                                icon={<AlertCircle className="w-6 h-6 text-yellow-500" />}
                            />
                            <StatCard
                                title="Đã Xử Lý"
                                value={formatCurrency(stats?.resolvedReports)}
                                percentageChange="Resolved reports"
                                icon={<AlertCircle className="w-6 h-6 text-green-500" />}
                            />
                            <StatCard
                                title="Từ Chối"
                                value={formatCurrency(stats?.rejectedReports)}
                                percentageChange="Rejected reports"
                                icon={<AlertCircle className="w-6 h-6 text-red-500" />}
                            />
                            <StatCard
                                title="Hôm Nay"
                                value="+3"
                                percentageChange="Report mới"
                                icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
                            />
                        </div>

                        {/* BIỂU ĐỒ DOANH THU */}
                        <div className="bg-white p-6 rounded-lg shadow-lg h-[450px]">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Biểu Đồ Doanh Thu Gói Đăng Tin</h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
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
                                        formatter={(value: number) =>
                                            `${value.toLocaleString('vi-VN')} ${value > 1000 ? 'VNĐ' : 'gói'}`
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
                                    <Bar dataKey="Doanh thu" fill="#facc15" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Gói bán" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}

                {/* TAB: PHÂN TÍCH DOANH THU */}
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
}

function StatCard({ title, value, percentageChange, icon }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mb-2">{value}</p>
                <p className="text-xs text-green-500">{percentageChange}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
                {icon}
            </div>
        </div>
    );
}