export async function getListings() {
  const res = await fetch("https://mocki.io/v1/358b9a62-33a7-40fd-8697-0ccd13d57267", {
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}
