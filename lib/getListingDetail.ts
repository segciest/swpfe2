export async function getListingDetail(id: string) {
  const res = await fetch(`http://localhost:8080/api/listing/${id}`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch listing detail");
  return res.json();
}
