from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# ==================== User Schemas ====================

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_chef: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Cuisine & Dietary Schemas ====================

class CuisineTagResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None

    class Config:
        from_attributes = True


class DietaryTagResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


# ==================== Menu Item Schemas ====================

class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    price_per_portion: float
    minimum_order_portions: int = 10
    is_available: bool = True


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_per_portion: Optional[float] = None
    minimum_order_portions: Optional[int] = None
    is_available: Optional[bool] = None


class MenuItemResponse(MenuItemCreate):
    id: int
    menu_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Menu Schemas ====================

class MenuCreate(BaseModel):
    name: str
    description: Optional[str] = None


class MenuResponse(MenuCreate):
    id: int
    chef_id: int
    is_active: bool
    created_at: datetime
    items: List[MenuItemResponse] = []

    class Config:
        from_attributes = True


# ==================== Chef Schemas ====================

class ChefBase(BaseModel):
    business_name: str
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    city: str
    service_area: Optional[str] = None
    experience_years: Optional[int] = None


class ChefCreate(ChefBase):
    """Chef creation with user info"""
    pass


class ChefUpdate(BaseModel):
    business_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    city: Optional[str] = None
    service_area: Optional[str] = None
    experience_years: Optional[int] = None
    is_available: Optional[bool] = None


class ChefProfileUpdate(BaseModel):
    """For chef dashboard profile updates"""
    business_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    city: Optional[str] = None
    service_area: Optional[str] = None
    experience_years: Optional[int] = None
    is_available: Optional[bool] = None
    cuisine_ids: Optional[List[int]] = None
    dietary_ids: Optional[List[int]] = None


class ChefResponse(ChefBase):
    id: int
    user_id: Optional[int] = None
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    primary_cuisine: Optional[str] = None
    sample_menu: Optional[str] = None
    food_photos: Optional[str] = None
    instagram_handle: Optional[str] = None
    is_available: bool
    average_rating: float
    total_reviews: int
    created_at: datetime
    updated_at: datetime
    cuisine_tags: List[CuisineTagResponse] = []
    dietary_tags: List[DietaryTagResponse] = []

    class Config:
        from_attributes = True


class ChefDetailResponse(ChefResponse):
    """Chef detail with menus and reviews"""
    menus: List[MenuResponse] = []
    reviews: List['ReviewResponse'] = []

    class Config:
        from_attributes = True


# ==================== Booking Request Schemas ====================

class BookingRequestCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    event_date: datetime
    guest_count: int
    message: Optional[str] = None


class BookingRequestPublicCreate(BookingRequestCreate):
    chef_id: int


class BookingRequestUpdate(BaseModel):
    status: Optional[str] = None  # pending, accepted, rejected, completed


class BookingRequestResponse(BookingRequestCreate):
    id: int
    chef_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Review Schemas ====================

class ReviewCreate(BaseModel):
    reviewer_name: str
    rating: float  # 1-5
    comment: Optional[str] = None


class ReviewResponse(ReviewCreate):
    id: int
    chef_id: int
    booking_request_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ==================== Auth Schemas ====================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    email: Optional[str] = None
    subject: Optional[str] = None
    full_name: Optional[str] = None


class ChefPublicSignupCreate(BaseModel):
    name: str
    phone: str
    city: str
    cuisine: str
    sample_menu: str
    food_photos: List[str] = []
    instagram: Optional[str] = None


# Resolve forward refs declared before ReviewResponse definition.
ChefDetailResponse.model_rebuild()
