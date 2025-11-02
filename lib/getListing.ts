export async function getListings() {
  const res = await fetch(`http://localhost:8080/api/listing/active`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}
