from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, run_runtime_migrations
from app.config import settings
from app.routers import auth, chefs, menus, bookings, reviews

# Create database tables
Base.metadata.create_all(bind=engine)
run_runtime_migrations()

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="Marketplace connecting customers with local home chefs and caterers",
    version=settings.api_version,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(chefs.router)
app.include_router(menus.router)
app.include_router(bookings.router)
app.include_router(reviews.router)


@app.get("/")
def read_root():
    """API health check"""
    return {
        "message": "Welcome to Food For Thought API",
        "version": settings.api_version,
        "docs": "/api/docs"
    }


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
