from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import ReviewCreate, ReviewResponse
from app.services import ReviewService
from app.models import Chef, Review

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.post("", response_model=ReviewResponse)
def create_review(
    chef_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
):
    """Create review for chef"""
    # Verify chef exists
    chef = db.query(Chef).filter(Chef.id == chef_id).first()
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )

    # Validate rating
    if not (1 <= review_data.rating <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )

    review_dict = review_data.dict()
    review = ReviewService.add_review(db, chef_id, review_dict)
    return review


@router.get("/chef/{chef_id}", response_model=List[ReviewResponse])
def get_chef_reviews(chef_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a chef"""
    # Verify chef exists
    chef = db.query(Chef).filter(Chef.id == chef_id).first()
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )

    reviews = ReviewService.get_chef_reviews(db, chef_id)
    return reviews
