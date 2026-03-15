from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import BookingRequestPublicCreate, BookingRequestResponse, BookingRequestUpdate
from app.services import BookingService
from app.models import Chef
from app.services.notifications import send_booking_notification

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("", response_model=BookingRequestResponse)
def create_booking_request(
    booking_data: BookingRequestPublicCreate,
    db: Session = Depends(get_db)
):
    """Create new booking request from customer without requiring customer signup."""
    chef_id = booking_data.chef_id

    # Verify chef exists
    chef = db.query(Chef).filter(Chef.id == chef_id).first()
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )

    booking_dict = booking_data.model_dump()
    booking_dict.pop("chef_id", None)
    booking = BookingService.create_booking_request(db, chef_id, booking_dict)

    chef_email = chef.user.email if chef.user else None
    if chef_email:
        subject = f"New booking request for {chef.business_name}"
        body = (
            f"New booking request received.\n\n"
            f"Customer: {booking.customer_name}\n"
            f"Phone: {booking.customer_phone}\n"
            f"Email: {booking.customer_email}\n"
            f"Event Date: {booking.event_date}\n"
            f"Guest Count: {booking.guest_count}\n"
            f"Message: {booking.message or 'N/A'}\n"
            f"Request ID: {booking.id}\n"
        )
        try:
            send_booking_notification(chef_email, subject, body)
        except Exception as exc:
            # Booking persistence is more important than email send.
            print(f"Booking email notification failed for chef_id={chef_id}: {exc}")

    return booking


@router.get("/chef/{chef_id}", response_model=List[BookingRequestResponse])
def get_chef_bookings(chef_id: int, db: Session = Depends(get_db)):
    """Get all booking requests for a chef"""
    # Verify chef exists
    chef = db.query(Chef).filter(Chef.id == chef_id).first()
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )

    bookings = BookingService.get_chef_bookings(db, chef_id)
    return bookings


@router.get("/{booking_id}", response_model=BookingRequestResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get booking request details"""
    booking = BookingService.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    return booking


@router.put("/{booking_id}", response_model=BookingRequestResponse)
def update_booking_status(
    booking_id: int,
    status_update: BookingRequestUpdate,
    db: Session = Depends(get_db)
):
    """Update booking status (accept/reject)"""
    booking = BookingService.update_booking_status(db, booking_id, status_update.status)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    return booking
