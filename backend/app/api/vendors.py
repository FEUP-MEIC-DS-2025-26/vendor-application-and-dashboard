from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import logging

from app.models.vendor import (
    VendorRequest,
    VendorRequestCreate,
    VendorRequestUpdate,
    VendorRequestResponse
)
from app.db import get_session
from app.clients.jumpseller_client import jumpseller_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/vendors", tags=["Vendor Registration"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_vendor(vendor_data: VendorRequestCreate, session: Session = Depends(get_session)):
    """
    Register a new vendor request.
    This endpoint is public (no authentication required for prototype).
    Falls back to mock response if database is unavailable.
    """
    try:
        if not vendor_data.questions or len(vendor_data.questions) == 0:
            raise HTTPException(
                status_code=400,
                detail="At least one verification question must be answered"
            )
        
        try:
            statement = select(VendorRequest).where(
                VendorRequest.email == vendor_data.email,
                VendorRequest.status == "pending"
            )
            existing = session.exec(statement).first()
            
            if existing:
                raise HTTPException(
                    status_code=409,
                    detail="A pending registration already exists for this email"
                )
            
            vendor_request = VendorRequest(
                name=vendor_data.name,
                owner_name=vendor_data.owner_name,
                email=vendor_data.email,
                phone=vendor_data.phone,
                country=vendor_data.country,
                tax_id=vendor_data.tax_id,
                website=vendor_data.website,
                about=vendor_data.about,
                questions=vendor_data.questions,
                documents=vendor_data.documents,
                status="pending"
            )
            
            session.add(vendor_request)
            session.commit()
            session.refresh(vendor_request)
            
            logger.info(f"New vendor registration saved to DB: {vendor_request.email} (ID: {vendor_request.id})")
            
            return {
                "id": vendor_request.id,
                "name": vendor_request.name,
                "owner_name": vendor_request.owner_name,
                "email": vendor_request.email,
                "status": vendor_request.status,
                "submitted_at": vendor_request.submitted_at.isoformat(),
                "reviewed_at": None,
                "message": "Registration submitted successfully"
            }
            
        except HTTPException:
            raise
        except Exception as db_error:
            logger.warning(f"Database unavailable, using fallback: {str(db_error)}")
            
            return {
                "id": 0,
                "name": vendor_data.name,
                "owner_name": vendor_data.owner_name,
                "email": vendor_data.email,
                "status": "pending",
                "submitted_at": datetime.utcnow().isoformat(),
                "reviewed_at": None,
                "message": "Registration submitted successfully (mock mode - database unavailable)"
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vendor registration failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


@router.get("/pending")
async def get_pending_vendors(session: Session = Depends(get_session)):
    """
    Get all pending vendor requests.
    For admin use (authentication can be added later).
    Falls back to empty list if database unavailable.
    """
    try:
        statement = select(VendorRequest).where(VendorRequest.status == "pending")
        vendors = session.exec(statement).all()
        return list(vendors)
    except Exception as e:
        logger.warning(f"Database unavailable for pending vendors: {str(e)}")
        return []


@router.get("/{vendor_id}")
async def get_vendor_details(vendor_id: int, session: Session = Depends(get_session)):
    """
    Get detailed information about a specific vendor request.
    Falls back to 404 if database unavailable.
    """
    try:
        vendor = session.get(VendorRequest, vendor_id)
        
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor request not found")
        
        return vendor
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Database unavailable for vendor {vendor_id}: {str(e)}")
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.put("/{vendor_id}/status")
async def update_vendor_status(
    vendor_id: int,
    update_data: VendorRequestUpdate,
    session: Session = Depends(get_session)
):
    """
    Update vendor request status (approve/reject).
    
    This endpoint is called by the Admin Verification team when they approve/reject a vendor.
    When status is 'approved', automatically creates a category in Jumpseller.
    """
    if update_data.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be 'approved' or 'rejected'"
        )
    
    try:
        vendor = session.get(VendorRequest, vendor_id)
        
        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor request not found")
        
        vendor.status = update_data.status
        vendor.admin_notes = update_data.admin_notes
        vendor.reviewer = update_data.reviewer
        vendor.reviewed_at = datetime.utcnow()
        
        session.add(vendor)
        session.commit()
        session.refresh(vendor)
        
        logger.info(f"Vendor {vendor_id} status updated to {update_data.status} by {update_data.reviewer}")
        
        if update_data.status == "approved":
            try:
                category_data = {
                    "name": vendor.name,
                    "description": vendor.about or f"Products from {vendor.name}",
                    "status": "visible"
                }
                jumpseller_category = await jumpseller_client.create_category(category_data)
                logger.info(f"Created Jumpseller category for vendor {vendor.name}: Category ID {jumpseller_category.get('id')}")
            except Exception as js_error:
                logger.error(f"Failed to create Jumpseller category for vendor {vendor_id}: {str(js_error)}")
        
        return vendor
        
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Database unavailable for status update: {str(e)}")
        return {
            "id": vendor_id,
            "status": update_data.status,
            "admin_notes": update_data.admin_notes,
            "reviewer": update_data.reviewer,
            "reviewed_at": datetime.utcnow().isoformat(),
            "message": "Status updated (mock mode - database unavailable)"
        }


@router.get("/")
async def get_all_vendors(
    status: str = None,
    session: Session = Depends(get_session)
):
    """
    Get all vendor requests, optionally filtered by status.
    Falls back to empty list if database unavailable.
    """
    try:
        if status:
            statement = select(VendorRequest).where(VendorRequest.status == status)
        else:
            statement = select(VendorRequest)
        
        vendors = session.exec(statement).all()
        return list(vendors)
    except Exception as e:
        logger.warning(f"Database unavailable for vendors list: {str(e)}")
        return []
