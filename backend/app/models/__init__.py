from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum


# Association tables for many-to-many relationships
chef_cuisine_association = Table(
    'chef_cuisine',
    Base.metadata,
    Column('chef_id', Integer, ForeignKey('chefs.id'), primary_key=True),
    Column('cuisine_id', Integer, ForeignKey('cuisine_tags.id'), primary_key=True)
)

chef_dietary_association = Table(
    'chef_dietary',
    Base.metadata,
    Column('chef_id', Integer, ForeignKey('chefs.id'), primary_key=True),
    Column('dietary_id', Integer, ForeignKey('dietary_tags.id'), primary_key=True)
)


class User(Base):
    """Base user model for both customers and chefs"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    is_chef = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chef_profile = relationship("Chef", back_populates="user", uselist=False)
    booking_requests = relationship("BookingRequest", back_populates="customer")


class Chef(Base):
    """Chef profile model"""
    __tablename__ = "chefs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=True)
    
    # Profile info
    business_name = Column(String, nullable=False)
    contact_name = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    primary_cuisine = Column(String, nullable=True)
    sample_menu = Column(Text, nullable=True)
    food_photos = Column(Text, nullable=True)  # Comma-separated image URLs
    instagram_handle = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    # Location
    city = Column(String, nullable=False)
    service_area = Column(String, nullable=True)  # e.g., "Greater Toronto Area"
    
    # Details
    experience_years = Column(Integer, nullable=True)
    is_available = Column(Boolean, default=True)
    
    # Stats
    average_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="chef_profile")
    menus = relationship("Menu", back_populates="chef", cascade="all, delete-orphan")
    booking_requests = relationship("BookingRequest", back_populates="chef")
    reviews = relationship("Review", back_populates="chef", cascade="all, delete-orphan")
    cuisine_tags = relationship("CuisineTag", secondary=chef_cuisine_association, back_populates="chefs")
    dietary_tags = relationship("DietaryTag", secondary=chef_dietary_association, back_populates="chefs")


class CuisineTag(Base):
    """Cuisine tag (Bengali, Pakistani, etc.)"""
    __tablename__ = "cuisine_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    icon = Column(String, nullable=True)  # emoji or icon name

    chefs = relationship("Chef", secondary=chef_cuisine_association, back_populates="cuisine_tags")


class DietaryTag(Base):
    """Dietary restrictions (Halal, Vegetarian, etc.)"""
    __tablename__ = "dietary_tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    chefs = relationship("Chef", secondary=chef_dietary_association, back_populates="dietary_tags")


class Menu(Base):
    """Menu for a chef (e.g., "Biryani Special", "Desserts")"""
    __tablename__ = "menus"

    id = Column(Integer, primary_key=True, index=True)
    chef_id = Column(Integer, ForeignKey('chefs.id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    chef = relationship("Chef", back_populates="menus")
    items = relationship("MenuItem", back_populates="menu", cascade="all, delete-orphan")


class MenuItem(Base):
    """Individual menu item (dish) with pricing by portion size"""
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey('menus.id'), nullable=False)
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    
    # Pricing - single price but could be extended for tray sizes
    price_per_portion = Column(Float, nullable=False)  # Price per portion/serving
    minimum_order_portions = Column(Integer, default=10)  # Minimum portions to order
    
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    menu = relationship("Menu", back_populates="items")


class BookingRequest(Base):
    """Booking request from customer to chef"""
    __tablename__ = "booking_requests"

    id = Column(Integer, primary_key=True, index=True)
    chef_id = Column(Integer, ForeignKey('chefs.id'), nullable=False)
    customer_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    # Customer details
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    
    # Event details
    event_date = Column(DateTime, nullable=False)
    guest_count = Column(Integer, nullable=False)
    message = Column(Text, nullable=True)
    
    # Status
    status = Column(String, default="pending")  # pending, accepted, rejected, completed
    
    created_at = Column(DateTime, default=datetime.utcnow)
    # Relationships
    chef = relationship("Chef", back_populates="booking_requests")
    customer = relationship("User", back_populates="booking_requests")


class Review(Base):
    """Review for a chef"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    chef_id = Column(Integer, ForeignKey('chefs.id'), nullable=False)
    booking_request_id = Column(Integer, ForeignKey('booking_requests.id'), nullable=True)
    
    reviewer_name = Column(String, nullable=False)
    rating = Column(Float, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    chef = relationship("Chef", back_populates="reviews")
