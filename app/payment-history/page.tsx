"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentItem {
    paymentId: number;
    userSubscription: {
        subscriptionId: { subName: string; duration: number };
        user: { userName: string; userEmail: string };
        startDate: string;
        endDate: string;
    };
    amount: number;
    method: string;
    transactionCode: string;
    orderInfo: string;
    createDate: string;
    status: string;
}

export default function PaymentHistoryPage() {
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const fetchPayments = async () => {
        const stored = localStorage.getItem("userData");
        if (!stored) {
            router.push("/");
            return;
        }

        const { token } = JSON.parse(stored);

        try {
            const res = await fetch("http://localhost:8080/api/payment/user/all", {
                // const res = await fetch("https://mocki.io/v1/eb320c0e-fbb5-494d-bc7d-1f91dba589c9", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setPayments(data);
        } catch {
            alert("Không thể tải lịch sử giao dịch");
        } finally {
            setLoading(false);
        }
    };

    const cancelPayment = async (paymentId: number) => {
        if (!confirm(`Bạn có chắc muốn hủy giao dịch #${paymentId}?`)) return;

        const stored = localStorage.getItem("userData");
        if (!stored) return;
        const { token } = JSON.parse(stored);

        try {
            setCancellingId(paymentId);

            const res = await fetch(`http://localhost:8080/api/payment/cancel/${paymentId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            const msg = await res.text();

            if (!res.ok) {
                alert(msg);
                return;
            }

            alert("✅ Hủy giao dịch thành công!");
            fetchPayments();
        } finally {
            setCancellingId(null);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    if (loading) return <div className="p-6">⏳ Đang tải dữ liệu...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">📜 Lịch sử giao dịch</h1>

            {payments.length === 0 ? (
                <p className="text-gray-500 text-center py-20">Không có giao dịch nào.</p>
            ) : (
                <div className="space-y-3">
                    {payments.map((p) => {
                        const badge =
                            p.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : p.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700";

                        return (
                            <div
                                key={p.paymentId}
                                className="
          p-4 rounded-2xl bg-white 
          shadow-[0px_4px_12px_rgba(0,0,0,0.06)]
          hover:shadow-[0px_6px_16px_rgba(0,0,0,0.1)]
          transition-all duration-200 
          border border-gray-100
          flex justify-between items-center
        "
                            >
                                {/* LEFT */}
                                <div className="space-y-1">
                                    <p className="text-base font-bold text-[#a50064] flex items-center gap-2">
                                        <span className="text-lg">💎</span>
                                        {p.userSubscription.subscriptionId.subName}
                                    </p>

                                    <p className="text-[13px] text-gray-700 flex items-center gap-1">
                                        👤 {p.userSubscription.user.userName}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Mã GD: <span className="font-medium">{p.transactionCode}</span>
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(p.createDate).toLocaleString("vi-VN")}
                                    </p>

                                    <span
                                        className={`inline-block text-[11px] px-2 py-[3px] rounded-full font-medium ${badge}`}
                                    >
                                        {p.status}
                                    </span>
                                </div>

                                {/* RIGHT */}
                                <div className="text-right min-w-[90px] flex flex-col items-end gap-2">
                                    <p className="text-sm font-bold text-[#d60074]">
                                        {p.amount.toLocaleString()} ₫
                                    </p>

                                    <button
                                        onClick={() => cancelPayment(p.paymentId)}
                                        disabled={cancellingId === p.paymentId}
                                        className="
              text-xs px-3 py-[6px] rounded-full font-semibold text-white
              bg-gradient-to-br from-[#d60074] to-[#a50064]
              hover:opacity-90
              disabled:bg-gray-300 disabled:text-gray-600
              shadow-sm hover:shadow-md transition
            "
                                    >
                                        {cancellingId === p.paymentId ? "Đang hủy…" : "Hủy"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            )}
        </div>
    );
}
