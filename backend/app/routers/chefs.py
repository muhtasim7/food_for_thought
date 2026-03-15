from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.schemas import ChefResponse, ChefDetailResponse, ChefCreate, ChefProfileUpdate, CuisineTagResponse, DietaryTagResponse, ChefPublicSignupCreate
from app.services import ChefService, TagService
from app.models import Chef, User, CuisineTag

router = APIRouter(prefix="/api/chefs", tags=["Chefs"])


@router.get("", response_model=List[ChefResponse])
def get_chefs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get all chefs with pagination"""
    chefs = ChefService.get_all_chefs(db, skip=skip, limit=limit)
    return chefs


@router.get("/search", response_model=List[ChefResponse])
def search_chefs(
    city: Optional[str] = Query(None),
    cuisine_ids: Optional[List[int]] = Query(None),
    dietary_ids: Optional[List[int]] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Search chefs with filters"""
    chefs = ChefService.search_chefs(
        db,
        city=city,
        cuisine_ids=cuisine_ids,
        dietary_ids=dietary_ids,
        skip=skip,
        limit=limit
    )
    return chefs


@router.get("/featured", response_model=List[ChefResponse])
def get_featured_chefs(db: Session = Depends(get_db)):
    """Get featured chefs"""
    chefs = ChefService.get_featured_chefs(db, limit=6)
    return chefs


@router.get("/top-rated", response_model=List[ChefResponse])
def get_top_chefs(db: Session = Depends(get_db)):
    """Get top-rated chefs"""
    chefs = ChefService.get_top_chefs(db, limit=5)
    return chefs


@router.post("/public-signup", response_model=ChefResponse)
def public_signup_chef(payload: ChefPublicSignupCreate, db: Session = Depends(get_db)):
    """Create chef directly from public chef onboarding form (no customer/user signup)."""
    cuisine_name = payload.cuisine.strip()
    cuisine = (
        db.query(CuisineTag)
        .filter(func.lower(CuisineTag.name) == cuisine_name.lower())
        .first()
    )
    if not cuisine:
        cuisine = CuisineTag(name=cuisine_name)
        db.add(cuisine)
        db.flush()

    chef = ChefService.create_public_chef(
        db=db,
        name=payload.name,
        phone=payload.phone,
        city=payload.city,
        cuisine=cuisine_name,
        sample_menu=payload.sample_menu,
        food_photos=payload.food_photos,
        instagram=payload.instagram,
    )
    chef.cuisine_tags.append(cuisine)
    db.commit()
    db.refresh(chef)
    return chef


# ==================== Tags ====================

@router.get("/tags/cuisines", response_model=List[CuisineTagResponse])
def get_cuisines(db: Session = Depends(get_db)):
    """Get all cuisine tags"""
    cuisines = TagService.get_all_cuisines(db)
    return cuisines


@router.get("/tags/dietary", response_model=List[DietaryTagResponse])
def get_dietary_tags(db: Session = Depends(get_db)):
    """Get all dietary tags"""
    tags = TagService.get_all_dietary_tags(db)
    return tags


@router.get("/{chef_id}", response_model=ChefDetailResponse)
def get_chef(chef_id: int, db: Session = Depends(get_db)):
    """Get chef details with menus and reviews"""
    chef = ChefService.get_chef_by_id(db, chef_id)
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )
    return chef


@router.post("", response_model=ChefResponse)
def create_chef(
    user_id: int,
    chef_data: ChefCreate,
    db: Session = Depends(get_db)
):
    """Create chef profile (called after user registration)"""
    # Check user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check chef already doesn't exist for this user
    existing_chef = ChefService.get_chef_by_user_id(db, user_id)
    if existing_chef:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chef profile already exists for this user"
        )

    chef = ChefService.create_chef(db, user_id, chef_data)
    return chef


@router.put("/{chef_id}", response_model=ChefResponse)
def update_chef(
    chef_id: int,
    chef_data: ChefProfileUpdate,
    db: Session = Depends(get_db)
):
    """Update chef profile"""
    chef = ChefService.update_chef(db, chef_id, chef_data)
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )
    return chef
