// User Types
export interface User {
  userID: string;
  userName: string;
  userEmail: string;
  phone: string;
  role: 'GUEST' | 'USER' | 'ADMIN' | 'MODERATOR' | { roleId: number; roleName: string };
  userStatus: 'ACTIVE' | 'BANNED';
  subscription?: Subscription;
  city?: string;
  district?: string;
  ward?: string;
  street?: string;
}

// Listing Types
export interface Listing {
  listingId: string;
  title: string;
  description: string;
  brand: string;
  model?: string;
  color?: string;
  year?: number;
  price: number;
  contact: string;
  categoryName: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerAvatarUrl?: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SOLD' | 'HIDDEN';
  createdAt: string;
  updatedAt?: string;
  imageUrls: string[];
  
  // EV specific
  seats?: number;
  vehicleType?: string;
  mileage?: string;
  batteryCapacity?: string;
  
  // Battery specific
  capacity?: string;
  voltage?: string;
  cycleCount?: number;
  warrantyInfo?: string;
}

// Subscription Types
export interface Subscription {
  subId: number;
  subName: 'Free' | 'Basic' | 'Premium' | 'VIP';
  subDetails: string;
  subPrice: number;
  duration: number; // days
  postLimit: number;
  priorityLevel: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UserSubscription {
  id: number;
  user: User;
  subscription: Subscription;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED';
}

// Review Types
export interface Review {
  reviewId: number;
  listing: Listing;
  reviewer: User;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

// Report Types
export interface Report {
  reportId: number;
  listing: Listing;
  reporter: User;
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
}

// Payment Types
export interface Payment {
  paymentId: number;
  user: User;
  subscription: Subscription;
  amount: number;
  transactionCode: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
