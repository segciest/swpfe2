export async function searchListings(query: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/listing/search?keyword=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Không thể tìm kiếm bài đăng");
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    return [];
  }
}
