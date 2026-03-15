import axios from 'axios'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://food-for-thought-gfrv.onrender.com'
).replace(/\/$/, '')

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const authAPI = {
  register: (email: string, password: string, fullName: string, phone?: string) =>
    apiClient.post('/api/auth/register', { email, password, full_name: fullName, phone }),
  
  registerChef: (email: string, password: string, fullName: string, phone?: string) =>
    apiClient.post('/api/auth/register/chef', { email, password, full_name: fullName, phone }),
  
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),
  
  getMe: () => apiClient.get('/api/auth/me'),
}

// Chef endpoints
export const chefAPI = {
  getAllChefs: (skip?: number, limit?: number) =>
    apiClient.get('/api/chefs', { params: { skip: skip || 0, limit: limit || 10 } }),
  
  searchChefs: (city?: string, cuisineIds?: number[], dietaryIds?: number[]) =>
    apiClient.get('/api/chefs/search', { params: { city, cuisine_ids: cuisineIds, dietary_ids: dietaryIds } }),
  
  getFeaturedChefs: () => apiClient.get('/api/chefs/featured'),
  
  getTopChefs: () => apiClient.get('/api/chefs/top-rated'),
  
  getChefDetail: (chefId: number) => apiClient.get(`/api/chefs/${chefId}`),

  publicSignup: (payload: {
    name: string
    phone: string
    city: string
    cuisine: string
    sample_menu: string
    food_photos: string[]
    instagram?: string
  }) => apiClient.post('/api/chefs/public-signup', payload),
  
  createChef: (userId: number, chefData: any) =>
    apiClient.post('/api/chefs', { user_id: userId, ...chefData }),
  
  updateChef: (chefId: number, data: any) =>
    apiClient.put(`/api/chefs/${chefId}`, data),
  
  getCuisines: () => apiClient.get('/api/chefs/tags/cuisines'),
  
  getDietaryTags: () => apiClient.get('/api/chefs/tags/dietary'),
}

// Menu endpoints
export const menuAPI = {
  getChefMenus: (chefId: number) =>
    apiClient.get(`/api/menus/chef/${chefId}`),
  
  createMenu: (chefId: number, name: string, description?: string) =>
    apiClient.post('/api/menus', { chef_id: chefId, name, description }),
  
  addMenuItem: (menuId: number, itemData: any) =>
    apiClient.post(`/api/menus/${menuId}/items`, itemData),
  
  updateMenuItem: (itemId: number, data: any) =>
    apiClient.put(`/api/menus/items/${itemId}`, data),
  
  deleteMenuItem: (itemId: number) =>
    apiClient.delete(`/api/menus/items/${itemId}`),
}

// Booking endpoints
export const bookingAPI = {
  createBookingRequest: (chefId: number, bookingData: any) =>
    apiClient.post('/api/bookings', { chef_id: chefId, ...bookingData }),
  
  getChefBookings: (chefId: number) =>
    apiClient.get(`/api/bookings/chef/${chefId}`),
  
  getBooking: (bookingId: number) =>
    apiClient.get(`/api/bookings/${bookingId}`),
  
  updateBookingStatus: (bookingId: number, status: string) =>
    apiClient.put(`/api/bookings/${bookingId}`, { status }),
}

// Review endpoints
export const reviewAPI = {
  addReview: (chefId: number, reviewData: any) =>
    apiClient.post('/api/reviews', { chef_id: chefId, ...reviewData }),
  
  getChefReviews: (chefId: number) =>
    apiClient.get(`/api/reviews/chef/${chefId}`),
}
