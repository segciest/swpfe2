export interface Listing {
  listingId: string;
  title: string;
  description: string | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  year: number | null;
  seats: number | null;
  vehicleType: string | null;
  mileage: number | null;
  batteryCapacity: number | null;
  warrantyInfo: string | null;
  price: number;
  contact: string;
  categoryName: 'Electric Car' | 'Electric Bike' | 'Battery' | string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerAvatarUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  imageUrls: string[];
}
