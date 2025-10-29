export async function getListingDetail(id: string) {
  const res = await fetch(`https://mocki.io/v1/33d39e03-a1a1-48a6-bf0e-1e94d3dc0e63`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch listing detail");
  return res.json();
}
