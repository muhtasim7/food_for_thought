"""
Seed script to populate database with sample data
Run with: python -m app.seed
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import (
    User, Chef, Menu, MenuItem, Review, CuisineTag, DietaryTag, BookingRequest,
    chef_cuisine_association, chef_dietary_association,
)
from app.services.auth import AuthService
from datetime import datetime, timedelta


def clear_all_data(db: Session):
    """Clear all data from database"""
    # Delete in order of foreign key dependencies
    db.query(Review).delete()
    db.query(BookingRequest).delete()
    db.query(MenuItem).delete()
    db.query(Menu).delete()

    # Clear many-to-many join tables explicitly before deleting parent rows.
    db.execute(chef_cuisine_association.delete())
    db.execute(chef_dietary_association.delete())

    db.query(Chef).delete()
    db.query(CuisineTag).delete()
    db.query(DietaryTag).delete()
    db.query(User).delete()
    db.commit()


def seed_cuisine_tags(db: Session):
    """Seed cuisine tags"""
    cuisines = [
        CuisineTag(name="Bengali", icon="🇧🇩"),
        CuisineTag(name="Pakistani", icon="🇵🇰"),
        CuisineTag(name="Indian", icon="🇮🇳"),
        CuisineTag(name="Middle Eastern", icon="🌶️"),
        CuisineTag(name="Hakka", icon="🥢"),
        CuisineTag(name="BBQ", icon="🔥"),
        CuisineTag(name="Desserts", icon="🍰"),
        CuisineTag(name="Continental", icon="🍽️"),
        CuisineTag(name="Vegan", icon="🥗"),
        CuisineTag(name="Seafood", icon="🐟"),
    ]
    db.add_all(cuisines)
    db.commit()
    return cuisines


def seed_dietary_tags(db: Session):
    """Seed dietary tags"""
    dietary = [
        DietaryTag(name="Halal"),
        DietaryTag(name="Vegetarian"),
        DietaryTag(name="Vegan"),
        DietaryTag(name="Gluten-Free"),
        DietaryTag(name="Nut-Free"),
    ]
    db.add_all(dietary)
    db.commit()
    return dietary


def seed_chefs(db: Session, cuisines: list, dietary: list):
    """Seed sample chef data"""
    chefs_data = [
        {
            "email": "fatima@foodforthought.com",
            "password": "password123",
            "full_name": "Fatima Khan",
            "phone": "416-555-0101",
            "business_name": "Fatima's Bengali Kitchen",
            "bio": "Authentic Bengali cuisine from my kitchen. Specializing in traditional Dhaka recipes passed down through generations.",
            "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            "city": "Toronto",
            "service_area": "Greater Toronto Area",
            "experience_years": 8,
            "cuisine_indices": [0],  # Bengali
            "dietary_indices": [0],  # Halal
        },
        {
            "email": "ahmad@foodforthought.com",
            "password": "password123",
            "full_name": "Ahmad Hassan",
            "phone": "416-555-0102",
            "business_name": "Ahmad's Pakistani Catering",
            "bio": "Professional catering for weddings and events. Authentic Pakistani and Middle Eastern cuisine.",
            "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            "city": "Scarborough",
            "service_area": "Greater Toronto Area",
            "experience_years": 12,
            "cuisine_indices": [1, 3],  # Pakistani, Middle Eastern
            "dietary_indices": [0],  # Halal
        },
        {
            "email": "priya@foodforthought.com",
            "password": "password123",
            "full_name": "Priya Sharma",
            "phone": "416-555-0103",
            "business_name": "Priya's Indian Spice House",
            "bio": "North Indian cuisine with modern twists. Perfect for parties and special occasions.",
            "profile_image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            "city": "Toronto",
            "service_area": "Greater Toronto Area",
            "experience_years": 6,
            "cuisine_indices": [2],  # Indian
            "dietary_indices": [0, 1],  # Halal, Vegetarian
        },
        {
            "email": "james@foodforthought.com",
            "password": "password123",
            "full_name": "James Wilson",
            "phone": "416-555-0104",
            "business_name": "BBQ Masters",
            "bio": "Smoking meats and grilling perfection. Your go-to for backyard parties and corporate events.",
            "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            "city": "Toronto",
            "service_area": "Greater Toronto Area",
            "experience_years": 10,
            "cuisine_indices": [5],  # BBQ
            "dietary_indices": [],
        },
        {
            "email": "maria@foodforthought.com",
            "password": "password123",
            "full_name": "Maria Garcia",
            "phone": "416-555-0105",
            "business_name": "Sweet Delights Bakery",
            "bio": "Custom cakes, pastries, and desserts for all occasions. Fresh ingredients, no preservatives.",
            "profile_image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            "city": "Toronto",
            "service_area": "Greater Toronto Area",
            "experience_years": 7,
            "cuisine_indices": [6],  # Desserts
            "dietary_indices": [1, 2],  # Vegetarian, Vegan
        },
        {
            "email": "rajesh@foodforthought.com",
            "password": "password123",
            "full_name": "Rajesh Kumar",
            "phone": "416-555-0106",
            "business_name": "Taj Indian Catering",
            "bio": "Premium Indian catering for weddings and corporate events. Customizable menus available.",
            "profile_image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            "city": "Mississauga",
            "service_area": "Greater Toronto Area",
            "experience_years": 15,
            "cuisine_indices": [2, 3],  # Indian, Middle Eastern
            "dietary_indices": [0, 1, 2],  # Halal, Vegetarian, Vegan
        },
        {
            "email": "wei@foodforthought.com",
            "password": "password123",
            "full_name": "Wei Chen",
            "phone": "416-555-0107",
            "business_name": "Wei's Hakka Kitchen",
            "bio": "Authentic Hakka Chinese cuisine. Best for party trays and family gatherings.",
            "profile_image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            "city": "Toronto",
            "service_area": "Greater Toronto Area",
            "experience_years": 11,
            "cuisine_indices": [4],  # Hakka
            "dietary_indices": [1, 3],  # Vegetarian, Gluten-Free
        },
    ]

    created_chefs = []
    for chef_info in chefs_data:
        # Create user
        user = User(
            email=chef_info["email"],
            password_hash=AuthService.hash_password(chef_info["password"]),
            full_name=chef_info["full_name"],
            phone=chef_info["phone"],
            is_chef=True
        )
        db.add(user)
        db.flush()

        # Create chef profile
        chef = Chef(
            user_id=user.id,
            business_name=chef_info["business_name"],
            bio=chef_info["bio"],
            profile_image_url=chef_info["profile_image_url"],
            city=chef_info["city"],
            service_area=chef_info["service_area"],
            experience_years=chef_info["experience_years"],
            is_available=True,
            average_rating=4.5 + (hash(chef_info["email"]) % 10) / 10,  # Random rating ~4.5-5
        )

        # Add cuisine tags
        for cuisine_idx in chef_info["cuisine_indices"]:
            chef.cuisine_tags.append(cuisines[cuisine_idx])

        # Add dietary tags
        for dietary_idx in chef_info["dietary_indices"]:
            chef.dietary_tags.append(dietary[dietary_idx])

        db.add(chef)
        db.flush()
        created_chefs.append((chef, user))

    db.commit()
    return created_chefs


def seed_menus_and_items(db: Session, chefs_with_users: list):
    """Seed sample menus and menu items"""
    menus_data = {
        0: {  # Fatima - Bengali
            "name": "Bengali Classics",
            "items": [
                {"name": "Biryani", "price": 15.00, "desc": "Fragrant rice with meat"},
                {"name": "Begun Bhaja", "price": 8.00, "desc": "Fried eggplant"},
                {"name": "Ilish Mach", "price": 20.00, "desc": "Hilsa fish curry"},
            ]
        },
        1: {  # Ahmad - Pakistani/Middle Eastern
            "name": "Pakistani Wedding Menu",
            "items": [
                {"name": "Nihari", "price": 18.00, "desc": "Slow-cooked meat stew"},
                {"name": "Samosa", "price": 5.00, "desc": "Fried pastry with filling"},
                {"name": "Kebab Mix", "price": 22.00, "desc": "Assorted kebabs"},
            ]
        },
        2: {  # Priya - Indian
            "name": "North Indian Favorites",
            "items": [
                {"name": "Butter Chicken", "price": 16.00, "desc": "Creamy tomato sauce"},
                {"name": "Paneer Tikka", "price": 14.00, "desc": "Grilled cottage cheese"},
                {"name": "Biryani", "price": 15.00, "desc": "Fragrant saffron rice"},
            ]
        },
        3: {  # James - BBQ
            "name": "BBQ & Grill",
            "items": [
                {"name": "Smoked Brisket", "price": 25.00, "desc": "12-hour smoked beef"},
                {"name": "Ribs", "price": 20.00, "desc": "Tender BBQ ribs"},
                {"name": "Pulled Pork", "price": 18.00, "desc": "Slow cooked pork"},
            ]
        },
        4: {  # Maria - Desserts
            "name": "Dessert Platters",
            "items": [
                {"name": "Chocolate Cake", "price": 40.00, "desc": "Rich chocolate 8-inch"},
                {"name": "Cheesecake", "price": 35.00, "desc": "New York style"},
                {"name": "Macarons", "price": 2.00, "desc": "French-style per piece"},
            ]
        },
        5: {  # Rajesh - Premium Indian
            "name": "Premium Wedding Catering",
            "items": [
                {"name": "Tandoori Chicken", "price": 19.00, "desc": "Clay oven roasted"},
                {"name": "Dal Makhni", "price": 12.00, "desc": "Creamy lentils"},
                {"name": "Raita", "price": 8.00, "desc": "Yogurt side dish"},
            ]
        },
        6: {  # Wei - Hakka
            "name": "Hakka Special",
            "items": [
                {"name": "Hakka Noodles", "price": 12.00, "desc": "Stir-fried noodles"},
                {"name": "Chili Chicken", "price": 14.00, "desc": "Hakka style"},
                {"name": "Manchurian", "price": 13.00, "desc": "Crispy balls in sauce"},
            ]
        },
    }

    for chef_idx, (chef, user) in enumerate(chefs_with_users):
        if chef_idx in menus_data:
            menu_data = menus_data[chef_idx]
            menu = Menu(
                chef_id=chef.id,
                name=menu_data["name"],
                description=f"Menu by {chef.business_name}"
            )
            db.add(menu)
            db.flush()

            for item_data in menu_data["items"]:
                item = MenuItem(
                    menu_id=menu.id,
                    name=item_data["name"],
                    description=item_data["desc"],
                    price_per_portion=item_data["price"],
                    minimum_order_portions=10,
                    image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop"
                )
                db.add(item)

    db.commit()


def seed_reviews(db: Session, chefs_with_users: list):
    """Seed sample reviews"""
    reviews_data = [
        {"chef_idx": 0, "name": "Sarah Ahmed", "rating": 5.0, "comment": "Absolutely delicious! Perfect for our wedding."},
        {"chef_idx": 0, "name": "Ali Khan", "rating": 4.5, "comment": "Great food and good value for money."},
        {"chef_idx": 1, "name": "Neelam Patel", "rating": 5.0, "comment": "Professional and delicious. Highly recommended!"},
        {"chef_idx": 2, "name": "Emma Johnson", "rating": 4.8, "comment": "Fresh ingredients, amazing flavors."},
        {"chef_idx": 3, "name": "Marcus Brown", "rating": 5.0, "comment": "Best BBQ in town!"},
        {"chef_idx": 4, "name": "Jessica Lee", "rating": 4.9, "comment": "Beautiful cakes and so tasty!"},
        {"chef_idx": 5, "name": "Hiren Shah", "rating": 5.0, "comment": "Premium quality, worth every penny."},
        {"chef_idx": 6, "name": "Lisa Wong", "rating": 4.7, "comment": "Authentic Hakka flavors."},
    ]

    for review_data in reviews_data:
        chef = chefs_with_users[review_data["chef_idx"]][0]
        review = Review(
            chef_id=chef.id,
            reviewer_name=review_data["name"],
            rating=review_data["rating"],
            comment=review_data["comment"]
        )
        db.add(review)

    db.commit()


def seed_database():
    """Main seed function"""
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Clear existing data
        print("Clearing existing data...")
        clear_all_data(db)

        # Seed tags
        print("Seeding cuisine tags...")
        cuisines = seed_cuisine_tags(db)

        print("Seeding dietary tags...")
        dietary = seed_dietary_tags(db)

        # Seed chefs
        print("Seeding chefs...")
        chefs_with_users = seed_chefs(db, cuisines, dietary)

        # Seed menus
        print("Seeding menus and items...")
        seed_menus_and_items(db, chefs_with_users)

        # Seed reviews
        print("Seeding reviews...")
        seed_reviews(db, chefs_with_users)

        print("\n✅ Database seeded successfully!")
        print(f"Created {len(chefs_with_users)} chefs with menus and reviews.")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
