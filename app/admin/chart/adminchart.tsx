'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Pie, PieChart, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, CreditCard, AlertCircle } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho API stats
interface DashboardStats {
  totalRevenue: number;
  activeListings: number;
  totalUsers: number;
  totalPendingListing: number;
  totalActiveUsers?: number;
  bannedUser?: number;
  totalBannedListing?: number;
}

// Dữ liệu giả cho biểu đồ (Vì API không cung cấp dữ liệu theo thời gian)
const generateMockChartData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    return {
      name: days === 365 ? (2023 - (days - 1 - i)).toString() : `${date.getDate()}/${date.getMonth() + 1}`,
      "Doanh thu": Math.floor(Math.random() * 5000000 + 1000000),
      "Gói bán": Math.floor(Math.random() * 100 + 10),
    };
  });
};

const mockData7Days = generateMockChartData(7);
const mockData30Days = generateMockChartData(30);

// Dữ liệu phân tích theo loại gói
const packageAnalysisData = [
  { name: 'Gói Basic', value: 45, revenue: 22500000 },
  { name: 'Gói Standard', value: 30, revenue: 45000000 },
  { name: 'Gói Premium', value: 15, revenue: 52500000 },
  { name: 'Gói VIP', value: 10, revenue: 80000000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminChart() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState(mockData30Days);
  const [timeFilter, setTimeFilter] = useState<'7 Ngày' | '30 Ngày' | '1 Năm'>('30 Ngày');
  const [activeTab, setActiveTab] = useState<'report' | 'analysis'>('report');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const res = await fetch('http://localhost:8080/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error('Bạn không có quyền truy cập trang này.');
          }
          throw new Error('Không thể tải dữ liệu.');
        }

        const data: DashboardStats = await res.json();
        setStats(data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Cập nhật dữ liệu biểu đồ khi filter thay đổi
  useEffect(() => {
    if (timeFilter === '7 Ngày') {
      setChartData(mockData7Days);
    } else if (timeFilter === '30 Ngày') {
      setChartData(mockData30Days);
    } else if (timeFilter === '1 Năm') {
      const yearData = Array.from({ length: 12 }, (_, i) => ({
        name: `T${i + 1}`,
        "Doanh thu": Math.floor(Math.random() * 50000000 + 10000000),
        "Gói bán": Math.floor(Math.random() * 1000 + 100),
      }));
      setChartData(yearData);
    }
  }, [timeFilter]);

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
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'report'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 Báo Cáo Doanh Thu
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'analysis'
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
            <div className="flex gap-2 mb-6">
              {(['7 Ngày', '30 Ngày', '1 Năm'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors 
                    ${timeFilter === filter 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

        {/* 4 THẺ THỐNG KÊ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng Doanh Thu Gói"
            value={`${formatCurrency(stats?.totalRevenue)} VNĐ`}
            percentageChange="Từ bán gói đăng tin" 
            icon={<DollarSign className="w-6 h-6 text-green-500" />}
          />
          <StatCard
            title="Tin Đang Chờ Duyệt"
            value={formatCurrency(stats?.totalPendingListing)}
            percentageChange="Tin cần xét duyệt"
            icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
          />
          <StatCard
            title="Tin Đang Hoạt Động"
            value={formatCurrency(stats?.activeListings)}
            percentageChange="Tin đã được duyệt"
            icon={<CreditCard className="w-6 h-6 text-purple-500" />}
          />
          <StatCard
            title="Tổng Người Dùng"
            value={formatCurrency(stats?.totalUsers)}
            percentageChange="Người dùng đăng ký"
            icon={<Users className="w-6 h-6 text-orange-500" />}
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
                <h2 className="text-xl font-bold text-gray-800 mb-4">Doanh Thu Theo Loại Gói</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={packageAnalysisData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {packageAnalysisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Xu hướng doanh thu */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Xu Hướng Doanh Thu 30 Ngày</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData30Days}>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Chi Tiết Doanh Thu Theo Gói</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại Gói</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số Lượng Bán</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ Lệ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh Thu</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packageAnalysisData.map((pkg, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="font-medium text-gray-900">{pkg.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {pkg.value} gói
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                          {pkg.value}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                          {pkg.revenue.toLocaleString('vi-VN')} VNĐ
                        </td>
                      </tr>
                    ))}
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
