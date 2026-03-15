from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import MenuResponse, MenuCreate, MenuItemResponse, MenuItemCreate, MenuItemUpdate
from app.services import MenuService
from app.models import Menu, MenuItem, Chef

router = APIRouter(prefix="/api/menus", tags=["Menus"])


@router.get("/chef/{chef_id}", response_model=List[MenuResponse])
def get_chef_menus(chef_id: int, db: Session = Depends(get_db)):
    """Get all menus for a specific chef"""
    # Verify chef exists
    chef = db.query(Chef).filter(Chef.id == chef_id).first()
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )

    menus = MenuService.get_chef_menus(db, chef_id)
    return menus


@router.post("/", response_model=MenuResponse)
def create_menu(
    chef_id: int,
    menu_data: MenuCreate,
    db: Session = Depends(get_db)
):
    """Create new menu for chef"""
    # Verify chef exists
    chef = db.query(Chef).filter(Chef.id == chef_id).first()
    if not chef:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chef not found"
        )

    menu = MenuService.create_menu(db, chef_id, menu_data.name, menu_data.description)
    return menu


# ==================== Menu Items ====================

@router.post("/{menu_id}/items", response_model=MenuItemResponse)
def add_menu_item(
    menu_id: int,
    item_data: MenuItemCreate,
    db: Session = Depends(get_db)
):
    """Add item to menu"""
    # Verify menu exists
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu not found"
        )

    item_dict = item_data.dict()
    item = MenuService.add_menu_item(db, menu_id, item_dict)
    return item


@router.put("/items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    item_data: MenuItemUpdate,
    db: Session = Depends(get_db)
):
    """Update menu item"""
    # Verify item exists
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )

    update_dict = item_data.dict(exclude_unset=True)
    updated_item = MenuService.update_menu_item(db, item_id, update_dict)
    return updated_item


@router.delete("/items/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db)):
    """Delete menu item"""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found"
        )

    db.delete(item)
    db.commit()
    return {"message": "Menu item deleted successfully"}
