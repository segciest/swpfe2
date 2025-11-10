'use client';
import React, { useState } from 'react';

interface OtpFormProps {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function OtpForm({ setStep, setMessage }: OtpFormProps) {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async () => {
        const token = localStorage.getItem('resetToken');
        if (!token) return setMessage('Thiếu token! Vui lòng gửi lại OTP.');

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/verify-reset-otp?otp=' + otp, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setStep(3);
            } else {
                setMessage(data.message || 'OTP không hợp lệ.');
            }
        } catch {
            setMessage('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <input
                type="text"
                placeholder="Nhập mã OTP"
                className="w-full border p-2 rounded-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 disabled:opacity-50"
            >
                {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
            </button>
        </div>
    );
}
