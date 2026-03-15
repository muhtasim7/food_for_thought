# Quick Start Guide - Food For Thought

## One-Command Setup (Recommended)

If you're on Mac/Linux with all prerequisites installed, run this from the project root:

```bash
# Backend setup and start
cd backend && \
python -m venv venv && \
source venv/bin/activate && \
pip install -r requirements.txt && \
cp .env.example .env && \
python -m app.seed && \
uvicorn app.main:app --reload --port 8000 &

# Then in another terminal, frontend setup and start
cd frontend && \
npm install && \
cp .env.example .env.local && \
npm run dev

# Open http://localhost:3000 in your browser
```

---

## Step-by-Step Setup

### Prerequisites
Before you begin, ensure you have:
- Python 3.10 or higher (`python --version`)
- Node.js 18+ and npm (`node --version`)
- PostgreSQL 12+ installed and running (`psql --version`)
- A code editor (VS Code recommended)

---

### Part 1: Database Setup

1. **Start PostgreSQL** (if not already running)
   - Mac: `brew services start postgresql`
   - Windows: PostgreSQL should run automatically, or use Services
   - Linux: `sudo systemctl start postgresql`

2. **Create database**
   ```bash
   createdb food_for_thought
   ```

   To verify: `psql -l` (you should see `food_for_thought` in the list)

---

### Part 2: Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Mac/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Open `.env` and verify database URL:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/food_for_thought
   ```
   Replace `user` and `password` with your PostgreSQL credentials if needed.

6. **Seed database with sample data**
   ```bash
   python -m app.seed
   ```
   
   Expected output:
   ```
   ✅ Database seeded successfully!
   Created 7 chefs with menus and reviews.
   ```

7. **Start FastAPI server**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   Expected output:
   ```
   Uvicorn running on http://127.0.0.1:8000
   ```

8. **Test API**
   - Visit http://localhost:8000/api/docs for Swagger documentation
   - Try: http://localhost:8000/api/chefs to list all chefs

✅ Backend is running!

---

### Part 3: Frontend Setup

1. **Open another terminal** and navigate to frontend
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Verify it contains:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=Food For Thought
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Expected output:
   ```
   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   ```

5. **Open in browser**
   - Visit http://localhost:3000

✅ Frontend is running!

---

## Testing the Application

### Test as a Customer

1. **Browse chefs** (no login needed)
   - Go to http://localhost:3000
   - Click "Browse Chefs"
   - Use filters to search by city, cuisine, dietary options
   - Click on a chef to see full profile, menus, and reviews

2. **Sign Up as Customer**
   - Click "Sign Up" in top right
   - Select "Customer" tab
   - Fill in form (sample: john@example.com / password123)
   - Click "Create Account"
   - You'll be redirected to browse page

3. **Send Booking Request**
   - Find a chef you like
   - Click "View Profile"
   - Click "Request Booking"
   - Fill in event details (date, guests, dishes, notes)
   - Click "Submit Request"
   - See confirmation page ✓

### Test as a Chef

1. **Sign Up as Chef**
   - Click "Sign Up" in top right
   - Select "Chef" tab
   - Fill in form (sample: chef@example.com / password123)
   - Click "Create Account"
   - Complete chef profile setup
   - You'll be redirected to chef dashboard

2. **Chef Dashboard**
   - View your profile and rating
   - See booking requests
   - Accept/reject bookings

3. **Add Menus** (future enhancement)
   - Dashboard will have menu management section

---

## Sample Test Data

The database includes 7 ready-to-use sample chefs:

| Chef | Cuisine | Location | Rating |
|------|---------|----------|--------|
| Fatima Khan | Bengali | Toronto | 4.8 ⭐ |
| Ahmad Hassan | Pakistani/Middle Eastern | Scarborough | 4.9 ⭐ |
| Priya Sharma | Indian | Toronto | 4.7 ⭐ |
| James Wilson | BBQ | Toronto | 4.8 ⭐ |
| Maria Garcia | Desserts | Toronto | 4.9 ⭐ |
| Rajesh Kumar | Indian Premium | Mississauga | 5.0 ⭐ |
| Wei Chen | Hakka | Toronto | 4.7 ⭐ |

**Test Login:**
- Email: `fatima@foodforthought.com`
- Password: `password123`

---

## Common Issues & Solutions

### PostgreSQL Connection Error
```
Error: could not connect to server
```
**Solution:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Verify your PostgreSQL username/password

### Port Already in Use
```
Address already in use [PORT 8000]
```
**Solution:**
```bash
# Kill the process using the port
lsof -ti:8000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8000   # Windows
```

### Frontend Can't Connect to Backend
```
Network Error: Failed to fetch from http://localhost:8000
```
**Solution:**
- Verify `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`
- Make sure backend is running at http://localhost:8000/api/docs
- Check no firewall is blocking port 8000

### Database Already Exists
```
Error: database "food_for_thought" already exists
```
**Solution:**
```bash
dropdb food_for_thought
createdb food_for_thought
python -m app.seed
```

### Seed Script Fails
```bash
# Clear and try again
python -m app.seed
```

---

## File Structure You Should See

```
food_for_thought/
├── README.md                           ← You are here
├── QUICK_START.md
├── backend/
│   ├── venv/                          (created by python -m venv)
│   ├── app/
│   │   ├── main.py                    ✓ FastAPI app
│   │   ├── database.py                ✓ DB config
│   │   ├── models/
│   │   │   └── __init__.py            ✓ User, Chef, Menu, etc.
│   │   ├── schemas/
│   │   │   └── __init__.py            ✓ Validation schemas
│   │   ├── services/
│   │   │   ├── __init__.py            ✓ Business logic
│   │   │   └── auth.py                ✓ Auth service
│   │   ├── routers/
│   │   │   ├── auth.py                ✓ Auth endpoints
│   │   │   ├── chefs.py               ✓ Chef endpoints
│   │   │   ├── menus.py               ✓ Menu endpoints
│   │   │   ├── bookings.py            ✓ Booking endpoints
│   │   │   └── reviews.py             ✓ Review endpoints
│   │   ├── seed.py                    ✓ Sample data
│   │   └── config.py                  ✓ Settings
│   ├── .env                           (you create from .env.example)
│   ├── .env.example                   ✓
│   ├── requirements.txt               ✓
│   └── .gitignore                     ✓
│
├── frontend/
│   ├── node_modules/                  (created by npm install)
│   ├── app/
│   │   ├── layout.tsx                 ✓ Root layout
│   │   ├── page.tsx                   ✓ Home page
│   │   ├── globals.css                ✓ Base styles
│   │   ├── browse/                    ✓ Browse chefs
│   │   ├── chef/[id]/                 ✓ Chef detail
│   │   ├── login/                     ✓ Login page
│   │   ├── signup/                    ✓ Signup page
│   │   ├── chef-setup/                ✓ Chef onboarding
│   │   ├── chef-dashboard/            ✓ Chef management
│   │   ├── booking-confirmation/      ✓ Confirmation
│   │   ├── how-it-works/              ✓ Info page
│   │   └── about/                     ✓ About page
│   ├── components/
│   │   ├── Header.tsx                 ✓ Navigation
│   │   ├── Footer.tsx                 ✓ Footer
│   │   ├── Layout.tsx                 ✓ Page layout
│   │   ├── Button.tsx                 ✓ Button component
│   │   ├── ChefCard.tsx               ✓ Chef card
│   │   ├── FormInput.tsx              ✓ Form input
│   │   ├── TextArea.tsx               ✓ Textarea
│   │   └── Select.tsx                 ✓ Select dropdown
│   ├── lib/
│   │   └── api.ts                     ✓ API client
│   ├── types/
│   │   └── index.ts                   ✓ TypeScript types
│   ├── .env.local                     (you create from .env.example)
│   ├── .env.example                   ✓
│   ├── package.json                   ✓
│   ├── tsconfig.json                  ✓
│   ├── tailwind.config.ts             ✓
│   ├── next.config.js                 ✓
│   └── .gitignore                     ✓
```

---

## Next Steps

After setup is working:

1. **Explore the code**
   - Backend: `backend/app` - check out the models, routers
   - Frontend: `frontend/app` - review page structure
   - Understand data flow from frontend to backend

2. **Add your own data**
   - Edit `backend/app/seed.py` to add more sample chefs
   - Run seed again: `python -m app.seed`

3. **Customize styling**
   - Edit `frontend/tailwind.config.ts` for colors/fonts
   - Update components in `frontend/components/`

4. **Test API thoroughly**
   - Visit http://localhost:8000/api/docs
   - Try different endpoints with Swagger UI

5. **Deploy**
   - Backend: Deploy to Heroku, Railway, or your chosen platform
   - Frontend: Deploy to Vercel, Netlify, or your chosen platform

---

## Useful Commands

### Backend
```bash
# Activate venv
source venv/bin/activate

# Run seed data
python -m app.seed

# Start server (with auto-reload)
uvicorn app.main:app --reload --port 8000

# Start server (production)
uvicorn app.main:app --port 8000

# Access API docs
# Open http://localhost:8000/api/docs
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production build
npm run start

# Run linting
npm run lint
```

### Database
```bash
# Connect to database
psql food_for_thought

# List all tables
\dt

# Exit psql
\q

# View all chefs (SQL)
psql food_for_thought -c "SELECT * FROM chefs;"
```

---

## Need Help?

If something doesn't work:

1. **Check the logs**
   - Backend terminal: Look for error messages when starting `uvicorn`
   - Frontend terminal: Look for errors when running `npm run dev`

2. **Verify prerequisites**
   - PostgreSQL: `psql --version`
   - Python: `python --version`
   - Node: `node --version`

3. **Reset everything**
   ```bash
   # Database
   dropdb food_for_thought
   createdb food_for_thought
   cd backend && python -m app.seed
   
   # Backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Check port conflicts**
   - Backend uses port 8000
   - Frontend uses port 3000
   - If already in use, check running processes

5. **See README.md** for full documentation

---

## You're Ready! 🚀

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Open browser
# http://localhost:3000
```

Explore, build, and enjoy! 🍽️
