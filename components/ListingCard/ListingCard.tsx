'use client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, Flag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Listing {
  listingId: string;
  title: string;
  price: number;
  categoryName: string;
  description: string;
  imageUrls: string[];
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(true);

  // Kiểm tra xem bài đăng có trong danh sách yêu thích không
  useEffect(() => {
    const checkIfLiked = async () => {
      const userData = localStorage.getItem("userData");
      if (!userData) {
        setCheckingFavorite(false);
        return;
      }

      const { token } = JSON.parse(userData);
      try {
        const res = await fetch(`http://localhost:8080/api/favorite/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const favorites = await res.json();
          const isLiked = favorites.some((fav: any) => 
            fav.listingId === listing.listingId || fav.id === listing.listingId
          );
          setLiked(isLiked);
        }
      } catch (err) {
        console.error("Error checking favorite status:", err);
      } finally {
        setCheckingFavorite(false);
      }
    };

    checkIfLiked();
  }, [listing.listingId]);

  // ❤️ Toggle yêu thích
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const userData = localStorage.getItem("userData");
    if (!userData) {
      alert("Vui lòng đăng nhập để yêu thích bài đăng!");
      return;
    }

    const { token } = JSON.parse(userData);
    
    // Optimistic update - cập nhật UI ngay lập tức
    const previousLiked = liked;
    setLiked(!liked);
    
    try {
      const res = await fetch(
        `http://localhost:8080/api/favorite/toggle?listingId=${listing.listingId}`,
        { 
          method: "POST", 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      if (res.status === 401) {
        alert("Token không hợp lệ hoặc đã hết hạn!");
        setLiked(previousLiked); // Revert
        return;
      }

      if (!res.ok) {
        throw new Error("Không thể cập nhật yêu thích");
      }

      console.log(`✅ ${!previousLiked ? 'Đã thêm vào' : 'Đã xóa khỏi'} yêu thích`);
    } catch (err) {
      console.error("Lỗi khi toggle yêu thích:", err);
      alert("Không thể cập nhật danh sách yêu thích!");
      setLiked(previousLiked); // Revert on error
    }
  };

  // 🚩 Mở modal report
  const handleOpenReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const userData = localStorage.getItem("userData");
    if (!userData) {
      alert("Vui lòng đăng nhập để báo cáo bài đăng!");
      return;
    }
    setShowReportModal(true);
  };

  // 🚩 Gửi report
  const handleSubmitReport = async () => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      alert("Vui lòng đăng nhập!");
      return;
    }

    const { token } = JSON.parse(userData);
    if (!reportReason.trim()) {
      alert("Vui lòng nhập lý do báo cáo!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing.listingId,
          reason: reportReason.trim(),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Không thể gửi báo cáo!");
      }

      setReported(true);
      setShowReportModal(false);
      setReportReason("");
      alert("✅ Báo cáo thành công! Quản trị viên sẽ xem xét bài đăng này.");
    } catch (err) {
      console.error("Lỗi khi gửi báo cáo:", err);
      alert("❌ Gửi báo cáo thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Thẻ bài đăng */}
      <div
        onClick={() => router.push(`/listing/${listing.listingId}`)}
        className="group relative bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col items-center text-center p-6"
      >
        {/* Ảnh */}
        <div className="relative w-full flex justify-center">
          <img
            src={listing.imageUrls?.[0] || "/no-image.png"}
            alt={listing.title}
            className="w-4/5 h-48 object-contain transition-transform duration-300 group-hover:scale-105"
          />

          {/* ❤️ + 🚩 */}
          <div className="absolute top-2 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={handleToggleFavorite}
              disabled={checkingFavorite}
              className={`p-1.5 rounded-full shadow hover:scale-110 transition ${
                liked 
                  ? "bg-red-50 text-red-500" 
                  : "bg-white text-gray-700"
              }`}
              title={liked ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              <Heart 
                size={18} 
                fill={liked ? "currentColor" : "none"}
                className={liked ? "text-red-500" : ""}
              />
            </button>

            <button
              onClick={handleOpenReport}
              disabled={reported}
              className={`p-1.5 rounded-full bg-white shadow hover:scale-110 transition ${reported ? "text-yellow-500" : "text-gray-700"
                }`}
            >
              <Flag size={18} fill={reported ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col items-center mt-4">
          <h3 className="text-xl font-semibold text-gray-900">{listing.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{listing.categoryName}</p>
          <p className="text-lg font-bold text-blue-600 mt-2">
            {listing.price.toLocaleString()} ₫
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/listing/${listing.listingId}`);
            }}
            className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* 🔔 Modal báo cáo */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-[400px] p-6 shadow-lg relative"
            >
              <button
                onClick={() => setShowReportModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🚩 Báo cáo bài đăng
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Vui lòng nhập lý do bạn muốn báo cáo bài đăng này:
              </p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={4}
                className="w-full border rounded-lg p-2 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
                placeholder="Nhập lý do báo cáo..."
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg"
                >
                  {loading ? "Đang gửi..." : "Gửi báo cáo"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
