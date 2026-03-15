from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models import Chef, CuisineTag, DietaryTag, User, MenuItem, Menu, BookingRequest, Review
from app.schemas import ChefCreate, ChefUpdate, ChefProfileUpdate
from typing import List, Optional
from datetime import datetime


class ChefService:
    """Service for chef-related operations"""

    @staticmethod
    def get_all_chefs(db: Session, skip: int = 0, limit: int = 10) -> List[Chef]:
        """Get all chefs with pagination"""
        return db.query(Chef).offset(skip).limit(limit).all()

    @staticmethod
    def get_chef_by_id(db: Session, chef_id: int) -> Optional[Chef]:
        """Get chef by ID"""
        return db.query(Chef).filter(Chef.id == chef_id).first()

    @staticmethod
    def get_chef_by_user_id(db: Session, user_id: int) -> Optional[Chef]:
        """Get chef profile by user ID"""
        return db.query(Chef).filter(Chef.user_id == user_id).first()

    @staticmethod
    def search_chefs(
        db: Session,
        city: Optional[str] = None,
        cuisine_ids: Optional[List[int]] = None,
        dietary_ids: Optional[List[int]] = None,
        skip: int = 0,
        limit: int = 10
    ) -> List[Chef]:
        """Search chefs with filters"""
        query = db.query(Chef).filter(Chef.is_available == True)

        if city:
            query = query.filter(Chef.city.ilike(f"%{city}%"))

        if cuisine_ids:
            query = query.filter(Chef.cuisine_tags.any(CuisineTag.id.in_(cuisine_ids)))

        if dietary_ids:
            query = query.filter(Chef.dietary_tags.any(DietaryTag.id.in_(dietary_ids)))

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create_chef(db: Session, user_id: int, chef_data: ChefCreate) -> Chef:
        """Create new chef profile"""
        chef = Chef(
            user_id=user_id,
            business_name=chef_data.business_name,
            bio=chef_data.bio,
            profile_image_url=chef_data.profile_image_url,
            city=chef_data.city,
            service_area=chef_data.service_area,
            experience_years=chef_data.experience_years
        )
        db.add(chef)
        db.commit()
        db.refresh(chef)
        return chef

    @staticmethod
    def create_public_chef(
        db: Session,
        name: str,
        phone: str,
        city: str,
        cuisine: str,
        sample_menu: str,
        food_photos: list[str],
        instagram: Optional[str] = None,
    ) -> Chef:
        """Create a chef profile directly from the public signup form."""
        chef = Chef(
            user_id=None,
            business_name=name,
            contact_name=name,
            contact_phone=phone,
            city=city,
            primary_cuisine=cuisine,
            sample_menu=sample_menu,
            food_photos=",".join([url.strip() for url in food_photos if url and url.strip()]),
            instagram_handle=instagram,
            bio=sample_menu,
            profile_image_url=(food_photos[0] if food_photos else None),
            service_area=city,
            is_available=True,
        )
        db.add(chef)
        db.commit()
        db.refresh(chef)
        return chef

    @staticmethod
    def update_chef(
        db: Session,
        chef_id: int,
        chef_data: ChefProfileUpdate
    ) -> Optional[Chef]:
        """Update chef profile"""
        chef = db.query(Chef).filter(Chef.id == chef_id).first()
        if not chef:
            return None

        # Update basic fields
        update_data = chef_data.dict(exclude_unset=True, exclude={"cuisine_ids", "dietary_ids"})
        for key, value in update_data.items():
            if value is not None:
                setattr(chef, key, value)

        # Update cuisine tags
        if chef_data.cuisine_ids is not None:
            cuisines = db.query(CuisineTag).filter(CuisineTag.id.in_(chef_data.cuisine_ids)).all()
            chef.cuisine_tags = cuisines

        # Update dietary tags
        if chef_data.dietary_ids is not None:
            dietaries = db.query(DietaryTag).filter(DietaryTag.id.in_(chef_data.dietary_ids)).all()
            chef.dietary_tags = dietaries

        chef.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(chef)
        return chef

    @staticmethod
    def get_top_chefs(db: Session, limit: int = 5) -> List[Chef]:
        """Get top-rated chefs"""
        return db.query(Chef).order_by(Chef.average_rating.desc()).limit(limit).all()

    @staticmethod
    def get_featured_chefs(db: Session, limit: int = 6) -> List[Chef]:
        """Get featured chefs (can be customized with business logic)"""
        return db.query(Chef).filter(Chef.is_available == True).limit(limit).all()


class MenuService:
    """Service for menu operations"""

    @staticmethod
    def get_chef_menus(db: Session, chef_id: int) -> List[Menu]:
        """Get all menus for a chef"""
        return db.query(Menu).filter(Menu.chef_id == chef_id, Menu.is_active == True).all()

    @staticmethod
    def create_menu(db: Session, chef_id: int, name: str, description: Optional[str] = None) -> Menu:
        """Create new menu for chef"""
        menu = Menu(
            chef_id=chef_id,
            name=name,
            description=description
        )
        db.add(menu)
        db.commit()
        db.refresh(menu)
        return menu

    @staticmethod
    def update_menu_item(db: Session, item_id: int, updated_data: dict) -> Optional[MenuItem]:
        """Update a menu item"""
        item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
        if not item:
            return None

        for key, value in updated_data.items():
            if value is not None:
                setattr(item, key, value)

        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def add_menu_item(db: Session, menu_id: int, item_data: dict) -> MenuItem:
        """Add item to menu"""
        item = MenuItem(
            menu_id=menu_id,
            **item_data
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


class BookingService:
    """Service for booking operations"""

    @staticmethod
    def create_booking_request(db: Session, chef_id: int, booking_data: dict) -> BookingRequest:
        """Create new booking request"""
        booking = BookingRequest(
            chef_id=chef_id,
            **booking_data
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking

    @staticmethod
    def get_chef_bookings(db: Session, chef_id: int) -> List[BookingRequest]:
        """Get all bookings for a chef"""
        return db.query(BookingRequest).filter(BookingRequest.chef_id == chef_id).all()

    @staticmethod
    def update_booking_status(db: Session, booking_id: int, status: str) -> Optional[BookingRequest]:
        """Update booking status"""
        booking = db.query(BookingRequest).filter(BookingRequest.id == booking_id).first()
        if not booking:
            return None

        booking.status = status
        booking.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(booking)
        return booking

    @staticmethod
    def get_booking_by_id(db: Session, booking_id: int) -> Optional[BookingRequest]:
        """Get booking by ID"""
        return db.query(BookingRequest).filter(BookingRequest.id == booking_id).first()


class ReviewService:
    """Service for review operations"""

    @staticmethod
    def add_review(db: Session, chef_id: int, review_data: dict) -> Review:
        """Add review for chef and update chef rating"""
        review = Review(
            chef_id=chef_id,
            **review_data
        )
        db.add(review)

        # Update chef's average rating
        chef = db.query(Chef).filter(Chef.id == chef_id).first()
        if chef:
            avg_rating = db.query(func.avg(Review.rating)).filter(Review.chef_id == chef_id).scalar() or 0
            chef.average_rating = round(float(avg_rating), 2)
            chef.total_reviews = db.query(Review).filter(Review.chef_id == chef_id).count() + 1

        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def get_chef_reviews(db: Session, chef_id: int) -> List[Review]:
        """Get all reviews for a chef"""
        return db.query(Review).filter(Review.chef_id == chef_id).order_by(Review.created_at.desc()).all()


class TagService:
    """Service for cuisine and dietary tags"""

    @staticmethod
    def get_all_cuisines(db: Session) -> List[CuisineTag]:
        """Get all cuisine tags"""
        return db.query(CuisineTag).all()

    @staticmethod
    def get_all_dietary_tags(db: Session) -> List[DietaryTag]:
        """Get all dietary tags"""
        return db.query(DietaryTag).all()

    @staticmethod
    def get_cuisine_by_id(db: Session, cuisine_id: int) -> Optional[CuisineTag]:
        """Get cuisine by ID"""
        return db.query(CuisineTag).filter(CuisineTag.id == cuisine_id).first()

    @staticmethod
    def create_cuisine(db: Session, name: str, icon: Optional[str] = None) -> CuisineTag:
        """Create new cuisine tag"""
        cuisine = CuisineTag(name=name, icon=icon)
        db.add(cuisine)
        db.commit()
        db.refresh(cuisine)
        return cuisine
