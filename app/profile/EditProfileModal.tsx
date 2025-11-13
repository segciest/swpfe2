'use client';
import React, { useState } from 'react';

interface EditProfileModalProps {
    profile: any;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditProfileModal({ profile, onClose, onUpdated }: EditProfileModalProps) {
    const [userName, setUserName] = useState(profile.userName || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [city, setCity] = useState(profile.city || '');
    const [address, setAddress] = useState(profile.address || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const stored = localStorage.getItem('userData');
        if (!stored) return alert('Bạn cần đăng nhập!');
        const { token } = JSON.parse(stored);

        const body = { userName, phone, city, address };

        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (res.ok) {
                alert('✅ Cập nhật thông tin thành công!');
                onUpdated(); // Reload lại profile
                onClose();
            } else {
                alert('❌ ' + (data.message || 'Không thể cập nhật thông tin.'));
            }
        } catch (err: any) {
            alert('⚠️ Lỗi khi cập nhật: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 text-center">✏️ Chỉnh sửa thông tin cá nhân</h2>

                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Họ và tên"
                    className="border w-full p-2 rounded-lg"
                />

                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại"
                    className="border w-full p-2 rounded-lg"
                />

                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Tỉnh / Thành phố"
                    className="border w-full p-2 rounded-lg"
                />

                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Địa chỉ chi tiết"
                    className="border w-full p-2 rounded-lg"
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-100">
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
