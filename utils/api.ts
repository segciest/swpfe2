import { Listing, PageResponse, Subscription, UserSubscription, Review, Report, Payment } from './types';
import { getToken } from './auth';

const API_URL = 'http://localhost:8080/api';

// Helper function
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `API Error: ${res.status}`);
  }

  // Check if response is JSON or text
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  } else {
    // Return text as-is for non-JSON responses
    return await res.text() as any;
  }
}

// ========== LISTING APIs ==========
// Backend returns array of ListingDetailResponse, not Page object
export async function getListings(page = 0, size = 20): Promise<any[]> {
  return fetchApi(`/listing?page=${page}&size=${size}`);
}

export async function getActiveListings(page = 0, size = 20): Promise<any[]> {
  return fetchApi(`/listing/active?page=${page}&size=${size}`);
}

// Backend returns ListingDetailResponse with flattened seller info
export async function getListingById(id: string): Promise<any> {
  return fetchApi(`/listing/${id}`);
}

// FIXED: Backend has specific search endpoints, not generic search
export async function searchByBrand(brand: string, page = 0, size = 20): Promise<PageResponse<Listing>> {
  return fetchApi(`/listing/search/brand?brand=${encodeURIComponent(brand)}&page=${page}&size=${size}`);
}

export async function searchByModel(model: string, page = 0, size = 20): Promise<PageResponse<Listing>> {
  return fetchApi(`/listing/search/model?model=${encodeURIComponent(model)}&page=${page}&size=${size}`);
}

export async function searchByColor(color: string, page = 0, size = 20): Promise<PageResponse<Listing>> {
  return fetchApi(`/listing/search/color?color=${encodeURIComponent(color)}&page=${page}&size=${size}`);
}

export async function searchByVehicleType(vehicleType: string, page = 0, size = 20): Promise<any> {
  const response: any = await fetchApi(`/listing/search/vehicle-type?type=${encodeURIComponent(vehicleType)}&page=${page}&size=${size}`);
  return response.content || [];
}

// FIXED: Search by model (used for general keyword search) - Backend returns Page object
export async function searchListings(keyword: string, page = 0, size = 20): Promise<any> {
  const response: any = await fetchApi(`/listing/search/model?model=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
  return response.content || [];
}

// FIXED: Backend uses min and max, not minPrice and maxPrice; returns Page object
export async function filterListingsByPrice(minPrice: number, maxPrice: number, page = 0, size = 20): Promise<any> {
  const response: any = await fetchApi(`/listing/filter/price?min=${minPrice}&max=${maxPrice}&page=${page}&size=${size}`);
  return response.content || [];
}

export async function filterListingsByYear(startYear: number, endYear: number, page = 0, size = 20): Promise<any> {
  const response: any = await fetchApi(`/listing/filter/year?start=${startYear}&end=${endYear}&page=${page}&size=${size}`);
  return response.content || [];
}

export async function filterListingsByCity(city: string, page = 0, size = 20): Promise<any> {
  const response: any = await fetchApi(`/listing/filter/city?city=${encodeURIComponent(city)}&page=${page}&size=${size}`);
  return response.content || [];
}

// FIXED: Backend returns Page object with .content
export async function getListingsByCategory(categoryId: number, page = 0, size = 20): Promise<any> {
  const response: any = await fetchApi(`/listing/category/${categoryId}?page=${page}&size=${size}`);
  return response.content || [];
}

// ADDED: Get listings by seller
export async function getListingsBySeller(sellerId: string, page = 0, size = 20): Promise<PageResponse<Listing>> {
  return fetchApi(`/listing/seller/${sellerId}?page=${page}&size=${size}`);
}

// ADDED: Get listings by status
export async function getListingsByStatus(status: string, page = 0, size = 20): Promise<PageResponse<Listing>> {
  return fetchApi(`/listing/status/${status}?page=${page}&size=${size}`);
}

export async function getMyListings(page = 0, size = 20): Promise<any[]> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  
  // FIXED: Backend doesn't have /my-posts endpoint
  // Need to get userId from token and use /listing/seller/{id}
  // For now, this will need to be called with userId from component
  throw new Error('Use getListingsBySeller(userId) instead');
}

export async function createListing(listingData: any, files: File[]): Promise<any> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  
  // Backend expects category as object with categoryId field
  const requestData = {
    ...listingData,
    category: { categoryId: listingData.categoryId }
  };
  delete requestData.categoryId;
  
  formData.append('listing', JSON.stringify(requestData));
  files.forEach(file => formData.append('files', file));

  const res = await fetch(`${API_URL}/listing/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Đăng bài thất bại');
  }

  // Backend returns: { message: "...", data: ListingResponse }
  const response = await res.json();
  return response.data || response;
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
  return fetchApi(`/listing/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ADDED: Update listing status
export async function updateListingStatus(id: string, status: string): Promise<Listing> {
  return fetchApi(`/listing/status/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function deleteListing(id: string): Promise<void> {
  return fetchApi(`/listing/delete/${id}`, {
    method: 'DELETE',
  });
}

// ========== SUBSCRIPTION APIs ==========
// FIXED: Backend uses /subscription not /subscriptions
export async function getSubscriptions(): Promise<Subscription[]> {
  return fetchApi('/subscription');
}

export async function getSubscriptionById(id: number): Promise<Subscription> {
  return fetchApi(`/subscription/${id}`);
}

export async function getSubscriptionByName(name: string): Promise<Subscription> {
  return fetchApi(`/subscription/name?name=${encodeURIComponent(name)}`);
}

export async function subscribeToPackage(subId: number): Promise<any> {
  return fetchApi(`/subscription/SubPackage?subId=${subId}`, {
    method: 'POST',
  });
}

export async function cancelSubscription(subId: number): Promise<any> {
  return fetchApi(`/subscription/cancel?subId=${subId}`, {
    method: 'PUT',
  });
}

// REMOVED: This endpoint doesn't exist in backend
// Use subscribeToPackage() or createVNPayPayment() instead

export async function getMySubscription(): Promise<UserSubscription | null> {
  try {
    // Backend doesn't have this endpoint, need to implement differently
    // For now return null
    return null;
  } catch {
    return null;
  }
}

// ========== REVIEW APIs ==========
// FIXED: Backend uses /review not /reviews, and reviews are for users not listings
export async function getAllReviews(): Promise<Review[]> {
  return fetchApi('/review');
}

export async function getReviewById(reviewId: number): Promise<Review> {
  return fetchApi(`/review/${reviewId}`);
}

export async function getReviewsByReviewer(userId: string): Promise<Review[]> {
  return fetchApi(`/review/reviewer/${userId}`);
}

export async function getReviewsAboutUser(userId: string): Promise<Review[]> {
  return fetchApi(`/review/reviewed/${userId}`);
}

export async function getUserAverageRating(userId: string): Promise<number> {
  return fetchApi(`/review/${userId}/rate`);
}

export async function getUserReviewSummary(userId: string): Promise<any> {
  return fetchApi(`/review/summary/${userId}`);
}

export async function createReview(sellerId: string, rate: number, comment: string): Promise<Review> {
  return fetchApi('/review/create', {
    method: 'POST',
    body: JSON.stringify({ sellerId, rate, comment }),
  });
}

export async function updateReview(reviewId: number, data: any): Promise<Review> {
  return fetchApi(`/review/update/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteReview(reviewId: number): Promise<void> {
  return fetchApi(`/review/delete/${reviewId}`, {
    method: 'DELETE',
  });
}

// ========== REPORT APIs ==========
// FIXED: Backend uses /report not /reports
export async function getAllReports(): Promise<Report[]> {
  return fetchApi('/report');
}

export async function getReportById(id: number): Promise<Report> {
  return fetchApi(`/report/id/${id}`);
}

export async function getReportsByStatus(status: string): Promise<Report[]> {
  return fetchApi(`/report/status/${status}`);
}

export async function reportListing(listingId: string, reason: string): Promise<Report> {
  return fetchApi('/report/create', {
    method: 'POST',
    body: JSON.stringify({ listingId, reason }),
  });
}

export async function updateReport(reportId: number, data: any): Promise<Report> {
  return fetchApi(`/report/update/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateReportStatus(reportId: number, status: string): Promise<Report> {
  return fetchApi(`/report/status/${reportId}?status=${status}`, {
    method: 'PUT',
  });
}

export async function deleteReport(reportId: number): Promise<void> {
  return fetchApi(`/report/${reportId}`, {
    method: 'DELETE',
  });
}

// ========== USER MANAGEMENT APIs ==========
// FIXED: Backend uses /users/list not /users
export async function getAllUsers(page = 0, size = 20): Promise<PageResponse<any>> {
  return fetchApi(`/users/list?page=${page}&size=${size}`);
}

export async function getUserById(userId: string): Promise<any> {
  return fetchApi(`/users/${userId}`);
}

export async function getUsersByCity(city: string): Promise<any[]> {
  return fetchApi(`/users/city?city=${encodeURIComponent(city)}`);
}

export async function updateUserProfile(data: any): Promise<any> {
  return fetchApi('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateUserStatus(userId: string, status: string): Promise<any> {
  return fetchApi(`/users/status/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function updateUserRole(userId: string, roleId: number): Promise<any> {
  return fetchApi(`/users/role/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ roleId }),
  });
}

// FIXED: Backend uses PUT /users/ban/{id} not POST /users/{id}/ban
export async function banUser(userId: string): Promise<void> {
  return fetchApi(`/users/ban/${userId}`, {
    method: 'PUT',
  });
}

// FIXED: Backend uses PUT /users/active/{id} not POST /users/{id}/unban
export async function unbanUser(userId: string): Promise<void> {
  return fetchApi(`/users/active/${userId}`, {
    method: 'PUT',
  });
}

export async function deleteUser(userId: string): Promise<void> {
  return fetchApi(`/users/${userId}`, {
    method: 'DELETE',
  });
}

// ADDED: Update avatar
export async function updateAvatar(file: File): Promise<any> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/users/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to upload avatar');
  }

  return await res.json();
}

// ========== ADMIN APIs ==========
// Backend returns array of ListingDetailResponse, not Page object
export async function getPendingListings(page = 0, size = 20): Promise<any[]> {
  return fetchApi(`/listing/pending?page=${page}&size=${size}`);
}

// Backend returns success message string
export async function approveListing(id: string): Promise<string> {
  return fetchApi(`/listing/approve/${id}`, {
    method: 'POST',
  });
}

export async function rejectListing(id: string): Promise<string> {
  return fetchApi(`/listing/reject/${id}`, {
    method: 'POST',
  });
}

export async function getAdminDashboard(): Promise<any> {
  return fetchApi('/admin/dashboard');
}

// ========== PAYMENT APIs ==========
// VNPay payment creation
export async function createVNPayPayment(data: { amount: number; orderInfo: string; subscriptionId: number; userId: string }): Promise<any> {
  return fetchApi('/vnpay/create-payment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get all payments for a user (with full Payment entity for cancel/retry)
export async function getAllPaymentsByUser(userId: string): Promise<any[]> {
  return fetchApi(`/payment/user/${userId}/all`);
}

// Cancel a pending payment
export async function cancelPayment(paymentId: number): Promise<any> {
  return fetchApi(`/payment/cancel/${paymentId}`, {
    method: 'PUT',
  });
}

// Retry a failed/cancelled payment
export async function retryPayment(userSubId: number, userId: string): Promise<any> {
  return fetchApi('/vnpay/retry-payment', {
    method: 'POST',
    body: JSON.stringify({ userSubId, userId }),
  });
}

// Handle VNPay callback
export async function handleVNPayReturn(params: any): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/vnpay/return?${queryString}`);
  if (!res.ok) throw new Error('Failed to process VNPay return');
  return await res.json();
}

// ========== CATEGORY APIs ==========
export async function getCategoryByName(name: string): Promise<any> {
  return fetchApi(`/category/name?name=${encodeURIComponent(name)}`);
}

export async function getCategoryById(id: number): Promise<any> {
  return fetchApi(`/category/${id}`);
}

export async function createCategory(data: any): Promise<any> {
  return fetchApi('/category/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: number, data: any): Promise<any> {
  return fetchApi(`/category/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return fetchApi(`/category/${id}`, {
    method: 'DELETE',
  });
}

// ========== NOTIFICATION APIs ==========
export async function getNotificationsByUser(userId: string): Promise<any[]> {
  return fetchApi(`/notifications/${userId}`);
}

export async function createNotification(userId: string, message: string): Promise<any> {
  return fetchApi(`/notifications?userId=${userId}&message=${encodeURIComponent(message)}`, {
    method: 'POST',
  });
}

export async function hideNotification(userId: string, notificationId: number): Promise<string> {
  return fetchApi(`/notifications/${userId}/${notificationId}/hide`, {
    method: 'PUT',
  });
}

export async function hideAllNotifications(userId: string): Promise<string> {
  return fetchApi(`/notifications/${userId}/hide-all`, {
    method: 'PUT',
  });
}

// ========== FAVORITE APIs ==========
export async function getFavoritesByUser(userId: string): Promise<any[]> {
  return fetchApi(`/favorite/user/${userId}`);
}

export async function addFavorite(listingId: string): Promise<any> {
  return fetchApi(`/favorite/create?listingId=${listingId}`, {
    method: 'POST',
  });
}

export async function removeFavorite(listingId: string): Promise<string> {
  return fetchApi(`/favorite/remove?listingId=${listingId}`, {
    method: 'DELETE',
  });
}

// ========== USER SUBSCRIPTION APIs ==========
export async function createUserSubscription(userId: string, subId: number): Promise<any> {
  return fetchApi(`/UserSub/create?userId=${userId}&subId=${subId}`, {
    method: 'POST',
  });
}

export async function deleteUserSubscription(id: number): Promise<void> {
  return fetchApi(`/UserSub/${id}`, {
    method: 'DELETE',
  });
}

export async function updateUserSubscription(id: number, data: any): Promise<void> {
  return fetchApi(`/UserSub/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getRemainingDays(userId: string): Promise<number> {
  return fetchApi(`/UserSub/remainday/${userId}`);
}
