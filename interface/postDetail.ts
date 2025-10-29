export interface PostDetail {
  listingId: string;
  seller: {
    userID: string;
    userName: string;
    userEmail: string;
    dob: string;
    role: {
      roleId: number;
      roleName: string;
    };
    phone: string;
    subid: {
      subId: number;
      subName: string;
      subDetails: string;
      subPrice: string;
      duration: number;
      priorityLevel: number;
      status: string;
    };
    userStatus: string;
  };
  category: {
    categoryId: number;
    categoryName: string;
  };
  title: string;
  description: string;
  brand: string;
  warrantyInfo: string;
  model: string;
  year: number;
  seats: number;
  vehicleType: string;
  color: string;
  mileage: string;
  batteryCapacity: string;
  capacity: string;
  voltage: string;
  cycleCount: number;
  batteryLifeRemaining: string;
  price: number;
  contact: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  content: string; // HTML content
}