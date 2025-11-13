'use client';
import React, { useState } from 'react';

interface ResetFormProps {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ResetForm({ setStep, setMessage }: ResetFormProps) {
    const [newPass, setNewPass] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        const token = localStorage.getItem('resetToken');
        if (!token) return setMessage('Thiếu token!');

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/users/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`,
                },
                body: new URLSearchParams({ newPass }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                localStorage.removeItem('resetToken');
                setStep(4);
            } else {
                setMessage(data.message || 'Không thể đặt lại mật khẩu.');
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
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="w-full border p-2 rounded-lg"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
            />
            <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 disabled:opacity-50"
            >
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
        </div>
    );
}
