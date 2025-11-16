
from fastapi import APIRouter, HTTPException, status
import logging
import httpx
from app.models.vendor import VendorRequestCreate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/vendors", tags=["Vendor Registration"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_vendor(vendor_data: VendorRequestCreate):
    """
    Register a new vendor request.
    This endpoint is public (no authentication required for prototype).
    """
    if not vendor_data.questions or len(vendor_data.questions) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one verification question must be answered"
        )


    # Build payload as per new required structure
    payload = {
        "about": vendor_data.about,
        "phone": vendor_data.phone,
        "tax_id": vendor_data.tax_id,
        "country": vendor_data.country,
        "website": vendor_data.website,
        "documents": vendor_data.documents,
        "questions": vendor_data.questions,
        "owner_name": vendor_data.owner_name,
        "raw_payload": vendor_data.dict()
    }


    from app.core.config import settings
    create_seller_url = settings.create_seller_url
    if not create_seller_url:
        raise HTTPException(status_code=500, detail="CREATE_SELLER_URL not configured")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(create_seller_url, json=payload)
            response.raise_for_status()
            result = response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"Failed to register vendor: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"Failed to register vendor: {e.response.text}")
    except Exception as e:
        logger.error(f"Vendor registration failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

    return {
        "message": "Registration submitted successfully",
        "result": result
    }