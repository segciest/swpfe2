'use client';
import React, { useState } from 'react';

interface EmailFormProps {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function EmailForm({ setStep, setMessage }: EmailFormProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/users/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('resetToken', data.resetToken);
                setMessage(data.message);
                setStep(2);
            } else {
                setMessage(data.message || 'Lỗi gửi OTP');
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
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full border p-2 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Đang gửi...' : 'Gửi OTP'}
            </button>
        </div>
    );
}
