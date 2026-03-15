// User types
export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
  is_chef: boolean
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

// Chef types
export interface CuisineTag {
  id: number
  name: string
  icon?: string
}

export interface DietaryTag {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  menu_id: number
  name: string
  description?: string
  image_url?: string
  price_per_portion: number
  minimum_order_portions: number
  is_available: boolean
  created_at: string
}

export interface Menu {
  id: number
  chef_id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  items: MenuItem[]
}

export interface Review {
  id: number
  chef_id: number
  booking_request_id?: number
  reviewer_name: string
  rating: number
  comment?: string
  created_at: string
}

export interface Chef {
  id: number
  user_id?: number
  business_name: string
  contact_name?: string
  contact_phone?: string
  primary_cuisine?: string
  sample_menu?: string
  food_photos?: string
  instagram_handle?: string
  bio?: string
  profile_image_url?: string
  city: string
  service_area?: string
  experience_years?: number
  is_available: boolean
  average_rating: number
  total_reviews: number
  created_at: string
  updated_at: string
  cuisine_tags: CuisineTag[]
  dietary_tags: DietaryTag[]
}

export interface ChefDetail extends Chef {
  menus: Menu[]
  reviews: Review[]
}

// Booking types
export interface BookingRequest {
  id: number
  chef_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  event_date: string
  guest_count: number
  message?: string
  status: string
  created_at: string
}

// Form types
export interface RegisterFormData {
  email: string
  password: string
  fullName: string
  phone?: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ChefProfileFormData {
  businessName: string
  bio?: string
  profileImageUrl?: string
  city: string
  serviceArea?: string
  experienceYears?: number
  cuisineIds: number[]
  dietaryIds: number[]
}

export interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  eventDate: string
  guestCount: number
  message?: string
}
