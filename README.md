# Food For Thought - Chef Marketplace MVP

A modern, clean marketplace connecting customers with local home chefs and party food caterers.

## Overview

This is a full-stack MVP built with:
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python + SQLAlchemy
- **Database**: PostgreSQL
- **Auth**: Email/password with JWT tokens

## Features

### Customer Features
- Browse chefs with advanced filters (cuisine, location, dietary options)
- View detailed chef profiles with menus and reviews
- Send booking requests
- See booking confirmation

### Chef Features
- Create and manage profile
- Set cuisines and dietary options
- Add menus with pricing
- View and manage booking requests
- Track rating and reviews

### Admin/System
- Seed data with 7 sample chefs
- Flexible, extensible data model
- Clean API design with FastAPI documentation

## Project Structure

```
food_for_thought/
├── frontend/                    # Next.js frontend
│   ├── app/                     # Pages and layouts
│   │   ├── (main pages)
│   │   ├── browse/
│   │   ├── chef/[id]/
│   │   ├── login/
│   │   ├── signup/
│   │   └── chef-dashboard/
│   ├── components/              # Reusable UI components
│   ├── lib/                     # API client and utilities
│   ├── types/                   # TypeScript definitions
│   └── package.json
│
└── backend/                     # FastAPI backend
    ├── app/
    │   ├── main.py              # FastAPI app instance
    │   ├── config.py            # Settings
    │   ├── database.py          # DB connection
    │   ├── models/              # SQLAlchemy models
    │   ├── schemas/             # Pydantic validation
    │   ├── services/            # Business logic
    │   ├── routers/             # API routes
    │   └── seed.py              # Database seeding
    ├── requirements.txt
    └── .env.example
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 12+

### 1. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create and configure .env
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb food_for_thought  # Make sure PostgreSQL is running

# Run seed script to populate test data
python -m app.seed

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/api/docs

### 2. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create and configure .env.local
cp .env.example .env.local
# Make sure NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend available at: http://localhost:3000

---

## API Endpoints

### Auth Endpoints
```
POST   /api/auth/register         - Register customer
POST   /api/auth/register/chef    - Register chef
POST   /api/auth/login            - Login
GET    /api/auth/me               - Get current user
```

### Chef Endpoints
```
GET    /api/chefs                 - List all chefs
GET    /api/chefs/search          - Search with filters
GET    /api/chefs/featured        - Featured chefs
GET    /api/chefs/{id}            - Chef detail
POST   /api/chefs                 - Create chef profile
PUT    /api/chefs/{id}            - Update chef profile
```

### Menu Endpoints
```
GET    /api/menus/chef/{chef_id}  - Get chef menus
POST   /api/menus                 - Create menu
POST   /api/menus/{id}/items      - Add menu item
PUT    /api/menus/items/{id}      - Update menu item
```

### Booking Endpoints
```
POST   /api/bookings              - Create booking request
GET    /api/bookings/chef/{id}    - Get chef's bookings
GET    /api/bookings/{id}         - Get booking details
PUT    /api/bookings/{id}         - Update booking status
```

### Review Endpoints
```
POST   /api/reviews               - Add review
GET    /api/reviews/chef/{id}     - Get chef reviews
```

---

## Sample Data

The seed script creates 7 sample chefs:
1. **Fatima Khan** - Bengali cuisine (Toronto)
2. **Ahmad Hassan** - Pakistani/Middle Eastern (Scarborough)
3. **Priya Sharma** - Indian cuisine (Toronto)
4. **James Wilson** - BBQ & Grilling (Toronto)
5. **Maria Garcia** - Desserts & Bakery (Toronto)
6. **Rajesh Kumar** - Premium Indian Catering (Mississauga)
7. **Wei Chen** - Hakka Chinese (Toronto)

Each chef includes:
- Sample menus with 3 dishes
- Realistic ratings and reviews
- Cuisine and dietary tags

---

## Database Schema

### Core Tables
- **users**: Customer and chef accounts
- **chefs**: Chef profiles (extends user)
- **menus**: Menu collections (e.g., "Bengali Classics")
- **menu_items**: Individual dishes with pricing
- **booking_requests**: Customer-to-chef booking requests
- **reviews**: Chef ratings and comments

### Reference Tables
- **cuisine_tags**: Cuisine types (Bengali, Pakistani, etc.)
- **dietary_tags**: Dietary options (Halal, Vegetarian, etc.)

### Many-to-Many Relationships
- chef_cuisine (chefs ↔ cuisines)
- chef_dietary (chefs ↔ dietary tags)

---

## Development Tips

### Frontend
- Components are in `/components` - reuse and extend
- Pages follow Next.js app router structure
- Tailwind CSS configured - use utility classes
- TypeScript types in `/types/index.ts`
- API calls through `/lib/api.ts`

### Backend
- Services handle business logic
- Routers handle HTTP endpoints
- Schemas validate request/response
- Models are SQLAlchemy ORM definitions
- Use `db.session` for database operations

### Adding a New Feature
1. Add database model in `app/models/__init__.py`
2. Add Pydantic schema in `app/schemas/__init__.py`
3. Add service methods in `app/services/`
4. Add API router in `app/routers/`
5. Include router in `app/main.py`
6. Create frontend pages/components as needed

---

## Testing the Flow

### As a Customer:
1. Go to http://localhost:3000
2. Explore home page with featured chefs
3. Click "Browse Chefs" to search/filter
4. Click on a chef to see profile, menus, and reviews
5. Sign up as a customer
6. Submit a booking request
7. See confirmation page

### As a Chef:
1. Sign up as a chef
2. Complete chef profile setup
3. Access chef dashboard at /chef-dashboard
4. View booking requests
5. Accept/reject bookings

---

## V2 Features (Roadmap)

The following features are great additions for V2:

1. **Payment Integration**
   - Stripe/PayPal integration
   - Invoice generation
   - Secure payment processing

2. **Advanced Messaging**
   - In-app chat between chefs and customers
   - File sharing (menus, photos)
   - Notification system

3. **Chef Portfolio**
   - Photo gallery/portfolio
   - Video testimonials
   - Past events showcase
   - Detailed ratings by category (Quality, Punctuality, etc.)

4. **Advanced Search & Discovery**
   - Map-based search
   - Availability calendar sync
   - Price range filtering
   - Multi-day catering packages
   - Recommendation algorithm

5. **Admin Dashboard**
   - Manage users, chefs, disputes
   - Analytics and insights
   - Commission tracking
   - Featured chef management

6. **Bookings & Scheduling**
   - Chef calendar integration
   - Deposit/payment tracking
   - Automated reminders
   - Cancellation policies

7. **Mobile App**
   - React Native app
   - Push notifications
   - Location services

8. **Community Features**
   - Chef reviews and ratings refinement
   - Food photo sharing
   - Event showcases
   - Testimonials/case studies

9. **Content & Marketing**
   - Blog/recipes
   - Chef spotlights
   - Event planning guides
   - Email newsletters

10. **Analytics**
    - Chef performance dashboard
    - Customer insights
    - Data-driven recommendations
    - Business intelligence

---

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env is correct
- Run migrations/seed: `python -m app.seed`

### Frontend can't connect to backend
- Check NEXT_PUBLIC_API_URL matches backend URL
- Ensure FastAPI is running on port 8000
- Check CORS settings in app/config.py

### Database errors
- Delete existing DB and recreate: `dropdb food_for_thought && createdb food_for_thought`
- Re-run seed script: `python -m app.seed`

---

## License

MIT

---

## Support

For issues, questions, or suggestions:
- Email: hello@foodforthought.com
- GitHub: [Your repo]

---

Happy cooking! 🍽️
