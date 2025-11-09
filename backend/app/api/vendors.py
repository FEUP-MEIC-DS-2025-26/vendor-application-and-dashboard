from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import logging

from app.models.vendor import (
    Vendor,
    VendorRequestCreate,
    VendorRequestUpdate,
    VendorRequestResponse,
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
    """
    try:
        if not vendor_data.questions or len(vendor_data.questions) == 0:
            raise HTTPException(
                status_code=400,
                detail="At least one verification question must be answered"
            )
        
        try:
            # Check for an existing pending_approval vendor with same email
            statement = select(Vendor).where(
                Vendor.email == vendor_data.email,
                Vendor.status == "pending_approval"
            )
            existing = session.exec(statement).first()

            if existing:
                raise HTTPException(
                    status_code=409,
                    detail="A pending registration already exists for this email"
                )

            # Build info JSON with all asked fields
            info = {
                "owner_name": vendor_data.owner_name,
                "phone": vendor_data.phone,
                "country": vendor_data.country,
                "tax_id": vendor_data.tax_id,
                "website": vendor_data.website,
                "about": vendor_data.about,
                "questions": vendor_data.questions,
                "documents": vendor_data.documents,
                "raw_payload": vendor_data.dict()
            }

            vendor = Vendor(
                name=vendor_data.name,
                email=vendor_data.email,
                status="pending_approval",
                info=info
            )

            session.add(vendor)
            session.commit()
            session.refresh(vendor)

            logger.info(f"New vendor saved to vendor table: {vendor.email} (ID: {vendor.id})")

            return {
                "id": vendor.id,
                "name": vendor.name,
                "owner_name": vendor.info.get("owner_name"),
                "email": vendor.email,
                "status": vendor.status,
                "submitted_at": vendor.created_at.isoformat(),
                "reviewed_at": None,
                "message": "Registration submitted successfully"
            }
            
        except HTTPException:
            raise
        except Exception as db_error:
            logger.error(f"Database error during vendor registration: {str(db_error)}")
            # Fail loud instead of returning mock data so client sees the error
            raise HTTPException(status_code=503, detail="Database unavailable")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Vendor registration failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )