"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Listing {
    title: string;
    description: string;
    brand: string;
    model: string;
    color: string;
    year: number;
    seats: number;
    vehicleType: string;
    mileage: string;
    batteryCapacity: string;
    capacity: string;
    voltage: string;
    cycleCount: number;
    batteryLifeRemaining: string;
    price: number;
}

export default function EditListingPage({
    params,
}: {
    params: { id: string };
}) {
    const router = useRouter();
    const { id } = params;
    const [form, setForm] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ✅ Lấy thông tin bài đăng hiện tại
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/listing/${id}`);
                // const res = await fetch(`https://mocki.io/v1/4c203627-22ae-43e2-9645-b9db37be5a1e`);
                const data = await res.json();
                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    brand: data.brand || "",
                    model: data.model || "",
                    color: data.color || "",
                    year: data.year || new Date().getFullYear(),
                    seats: data.seats || 0,
                    vehicleType: data.vehicleType || "",
                    mileage: data.mileage || "",
                    batteryCapacity: data.batteryCapacity || "",
                    capacity: data.capacity || "",
                    voltage: data.voltage || "",
                    cycleCount: data.cycleCount || 0,
                    batteryLifeRemaining: data.batteryLifeRemaining || "",
                    price: data.price || 0,
                });
            } catch (e) {
                alert("Không thể tải thông tin bài đăng!");
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    // ✅ Cập nhật form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    // ✅ Gửi yêu cầu cập nhật
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        const stored = localStorage.getItem("userData");
        if (!stored) return alert("Bạn cần đăng nhập!");
        const { token } = JSON.parse(stored);

        try {
            setSaving(true);
            const res = await fetch(`http://localhost:8080/api/listing/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Cập nhật thất bại!");
            const result = await res.json();
            alert(result.message || "Cập nhật thành công!");
            router.push(`/listing/${id}`);
        } catch (err: any) {
            alert(err.message || "Đã xảy ra lỗi khi cập nhật!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;
    if (!form) return <div className="p-6 text-gray-500">Không tìm thấy bài đăng.</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm mt-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">✏️ Chỉnh sửa bài đăng</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột trái */}
                <div className="space-y-4">
                    <Input label="Tiêu đề" name="title" value={form.title} onChange={handleChange} required />
                    <Input label="Hãng xe / Pin" name="brand" value={form.brand} onChange={handleChange} />
                    <Input label="Dòng xe / Model" name="model" value={form.model} onChange={handleChange} />
                    <Input label="Màu sắc" name="color" value={form.color} onChange={handleChange} />
                    <Input label="Năm sản xuất" name="year" type="number" value={form.year} onChange={handleChange} />
                    <Input label="Số chỗ ngồi" name="seats" type="number" value={form.seats} onChange={handleChange} />
                    <Input label="Loại phương tiện" name="vehicleType" value={form.vehicleType} onChange={handleChange} />
                    <Input label="Quãng đường đã chạy" name="mileage" value={form.mileage} onChange={handleChange} />
                </div>

                {/* Cột phải */}
                <div className="space-y-4">
                    <Input label="Dung lượng pin" name="batteryCapacity" value={form.batteryCapacity} onChange={handleChange} />
                    <Input label="Công suất" name="capacity" value={form.capacity} onChange={handleChange} />
                    <Input label="Điện áp" name="voltage" value={form.voltage} onChange={handleChange} />
                    <Input label="Số chu kỳ sạc" name="cycleCount" type="number" value={form.cycleCount} onChange={handleChange} />
                    <Input label="Tuổi thọ pin còn lại" name="batteryLifeRemaining" value={form.batteryLifeRemaining} onChange={handleChange} />
                    <Input label="Giá bán (₫)" name="price" type="number" value={form.price} onChange={handleChange} />
                </div>

                {/* Mô tả */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        rows={6}
                        placeholder="Nhập mô tả chi tiết..."
                    />
                </div>

                {/* Nút lưu */}
                <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 py-3 rounded-lg text-white font-semibold transition ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                            }`}
                    >
                        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Input({
    label,
    name,
    value,
    type = "text",
    onChange,
    required = false,
}: {
    label: string;
    name: string;
    value: any;
    type?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
        </div>
    );
}
