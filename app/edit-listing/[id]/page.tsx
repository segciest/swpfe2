"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [form, setForm] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ✅ Fetch listing data
    useEffect(() => {
        if (!id) {
            alert("Không tìm thấy ID bài đăng!");
            router.push("/profile");
            return;
        }

        const stored = localStorage.getItem("userData");
        if (!stored) {
            alert("Bạn cần đăng nhập!");
            router.push("/");
            return;
        }

        const { token } = JSON.parse(stored);

        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/listing/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Không thể lấy dữ liệu bài đăng!");

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
            } catch (e: any) {
                alert(e.message || "Lỗi khi tải bài đăng");
                router.push("/profile");
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id, router]);

    // ✅ Form change
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    // ✅ Submit update
    const handleSubmit = async (e: any) => {
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

            alert("✅ Cập nhật thành công!");
            router.push(`/profile`);
        } catch (err: any) {
            alert(err.message || "Có lỗi xảy ra!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;
    if (!form) return <div className="p-6 text-gray-500">❌ Không tìm thấy bài đăng</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm mt-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">✏️ Chỉnh sửa bài đăng</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-4">
                    <Input label="Tiêu đề" name="title" value={form.title} onChange={handleChange} required />
                    <Input label="Hãng xe / Pin" name="brand" value={form.brand} onChange={handleChange} />
                    <Input label="Model" name="model" value={form.model} onChange={handleChange} />
                    <Input label="Màu" name="color" value={form.color} onChange={handleChange} />
                    <Input label="Năm" type="number" name="year" value={form.year} onChange={handleChange} />
                    <Input label="Số chỗ" type="number" name="seats" value={form.seats} onChange={handleChange} />
                    <Input label="Loại xe" name="vehicleType" value={form.vehicleType} onChange={handleChange} />
                    <Input label="Quãng đường" name="mileage" value={form.mileage} onChange={handleChange} />
                </div>

                {/* Right */}
                <div className="space-y-4">
                    <Input label="Dung lượng pin" name="batteryCapacity" value={form.batteryCapacity} onChange={handleChange} />
                    <Input label="Công suất" name="capacity" value={form.capacity} onChange={handleChange} />
                    <Input label="Điện áp" name="voltage" value={form.voltage} onChange={handleChange} />
                    <Input label="Chu kỳ sạc" type="number" name="cycleCount" value={form.cycleCount} onChange={handleChange} />
                    <Input label="Tuổi thọ pin" name="batteryLifeRemaining" value={form.batteryLifeRemaining} onChange={handleChange} />
                    <Input label="Giá bán (₫)" type="number" name="price" value={form.price} onChange={handleChange} />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        rows={6}
                        placeholder="Mô tả chi tiết..."
                    />
                </div>

                {/* Save */}
                <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 py-3 rounded-lg text-white font-semibold transition ${saving ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
                            }`}
                    >
                        {saving ? "Đang lưu..." : "💾 Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Input({ label, name, value, type = "text", onChange, required = false }: any) {
    return (
        <div>
            <label className="block mb-1 font-medium">{label}</label>
            <input
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                className="w-full border rounded-lg p-3"
            />
        </div>
    );
}
