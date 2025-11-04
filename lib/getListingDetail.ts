export async function getListingDetail(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/listing/${id}`, {
      cache: "no-store"
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', res.status, errorText);
      throw new Error(`Failed to fetch listing detail: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
