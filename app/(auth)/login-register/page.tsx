"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

// --- COMPONENT ĐĂNG NHẬP ---
const SignInForm = () => {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [remember, setRemember] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Lưu thông tin user vào localStorage để Navbar cập nhật
            // API của bạn CẦN trả về userName
            const stored = { token: data.token, userId: data.userId, userName: data.userName || data.email }; 
            localStorage.setItem('userData', JSON.stringify(stored));

            setMessage('Đăng nhập thành công!');
            router.push('/'); // Chuyển về trang chủ
            
            // Trigger Navbar tự cập nhật
            window.dispatchEvent(new Event("storage"));
            router.refresh(); 
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Áp dụng style Tailwind trực tiếp
        <div className="bg-white p-8 w-full h-full flex flex-col justify-center text-center">
            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Đăng Nhập</h1>
                <span className="text-sm text-gray-500 mb-4 block">sử dụng tài khoản của bạn</span>
                
                {/* Input styles */}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />

                <label className="flex items-center justify-start gap-2 mt-3 text-sm cursor-pointer text-gray-600">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Ghi nhớ tôi</span>
                </label>

                {/* Button styles */}
                <button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-300 uppercase text-sm tracking-wider mt-4 disabled:bg-gray-400" 
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
                {message && <p className="text-red-500 text-sm mt-3">{message}</p>}
            </form>
        </div>
    );
};

// --- COMPONENT ĐĂNG KÝ ---
// Props interface để nhận hàm từ component cha
interface SignUpFormProps {
    onRegisterSuccess: () => void;
}

const SignUpForm = ({ onRegisterSuccess }: SignUpFormProps) => {
    const [form, setForm] = useState({
        userName: '',
        userEmail: '',
        userPassword: '',
        phone: '',
        dob: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            setMessage('Đăng ký thành công! Đang chuyển sang đăng nhập...');
            
            // Gọi hàm onRegisterSuccess sau 2 giây
            setTimeout(() => {
                onRegisterSuccess();
            }, 2000);

        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Áp dụng style Tailwind trực tiếp
        <div className="bg-white p-8 w-full h-full flex flex-col justify-center text-center">
            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Tạo Tài Khoản</h1>
                <span className="text-sm text-gray-500 mb-4 block">sử dụng email để đăng ký</span>
                
                {/* Input styles */}
                <input
                    type="text"
                    name="userName"
                    placeholder="Họ và tên"
                    value={form.userName}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="email"
                    name="userEmail"
                    placeholder="Email"
                    value={form.userEmail}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="password"
                    name="userPassword"
                    placeholder="Mật khẩu"
                    value={form.userPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                    type="text"
                    name="dob"
                    placeholder="Ngày sinh (YYYY-MM-DD)"
                    value={form.dob}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
                />
                
                {/* Button styles */}
                <button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition-colors duration-300 uppercase text-sm tracking-wider mt-4 disabled:bg-gray-400" 
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
                {/* Hiển thị message: màu xanh nếu thành công, đỏ nếu lỗi */}
                {message && (
                    <p className={`text-sm mt-3 ${message.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};


// --- COMPONENT CHÍNH CỦA TRANG ---
export default function LoginPage() {
    const [isSignUpActive, setIsSignUpActive] = useState(false);

    // Hàm này được truyền xuống SignUpForm
    const handleRegisterSuccess = () => {
        setIsSignUpActive(false); // Tự động chuyển về tab đăng nhập
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-100 py-12">
            <div 
                className={`bg-white rounded-2xl shadow-2xl relative overflow-hidden w-full max-w-4xl min-h-[550px]`}
                id="auth-container"
            >
                {/* Form Đăng ký */}
                <div 
                    className={`flex items-center justify-center absolute top-0 h-full transition-all duration-700 ease-in-out ${
                        isSignUpActive ? 'left-0 w-1/2 opacity-100 z-20' : 'left-0 w-1/2 opacity-0 z-10'
                    }`}
                >
                    {/* Truyền hàm callback xuống */}
                    <SignUpForm onRegisterSuccess={handleRegisterSuccess} />
                </div>

                {/* Form Đăng nhập */}
                <div 
                    className={`flex items-center justify-center absolute top-0 h-full transition-all duration-700 ease-in-out ${
                        isSignUpActive ? 'left-1/2 w-1/2 opacity-0 z-10' : 'left-1/2 w-1/2 opacity-100 z-20'
                    }`}
                >
                    <SignInForm />
                </div>

                {/* Lớp Overlay trượt */}
                <div 
                    className={`absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 ${
                        isSignUpActive ? 'translate-x-full' : 'translate-x-0'
                    }`}
                >
                    <div 
                        className={`bg-gradient-to-r from-green-500 to-green-700 text-white relative h-full w-[200%] transition-transform duration-700 ease-in-out ${
                            isSignUpActive ? '-translate-x-1/2' : 'translate-x-0'
                        }`}
                    >
                        {/* Panel Overlay Đăng nhập (HIỂN THỊ BÊN TRÁI) */}
                        <div 
                            className={`absolute top-0 flex flex-col items-center justify-center text-center p-10 h-full w-1/2 transition-all duration-700 ease-in-out ${
                                isSignUpActive ? 'opacity-0' : 'opacity-100'
                            }`}
                            style={{ left: 0 }} /* SỬA TỪ right: 0 */
                        >
                            <h1 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h1>
                            <p className="text-lg mb-6">Đăng nhập để tiếp tục kết nối với chúng tôi</p>
                            <button 
                                className="btn ghost" /* Class này lấy từ globals.css */
                                onClick={() => setIsSignUpActive(true)}
                            >
                                Đăng Ký
                            </button>
                        </div>

                        {/* Panel Overlay Đăng ký (HIỂN THỊ BÊN PHẢI) */}
                        <div 
                            className={`absolute top-0 flex flex-col items-center justify-center text-center p-10 h-full w-1/2 transition-all duration-700 ease-in-out ${ /* SỬA LỖI w-1.2 */
                                isSignUpActive ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ right: 0 }} /* SỬA TỪ left: 0 */
                        >
                            <h1 className="text-3xl font-bold mb-4">Xin chào!</h1>
                            <p className="text-lg mb-6">Chưa có tài khoản? Đăng ký ngay để bắt đầu</p>
                            <button 
                                className="btn ghost" /* Class này lấy từ globals.css */
                                onClick={() => setIsSignUpActive(false)}
                            >
                                Đăng Nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

