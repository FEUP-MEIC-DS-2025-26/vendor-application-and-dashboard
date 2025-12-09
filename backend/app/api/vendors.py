
from app.services.dashboard_service import DashboardService
from fastapi import APIRouter, HTTPException, status
import logging
from app.models.vendor import VendorRequestCreate

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/vendor", tags=["Vendor Registration"])

# Create a single instance of the dashboard service
dashboard_service = DashboardService()

# Dashboard endpoint - single call to get all dashboard data
@router.get("/dashboard")
async def get_dashboard_data(period: str = "daily"):
    """
    Get all dashboard data in a single optimized call.
    Accepts 'period' query param: 'daily', 'weekly', 'monthly'.
    """
    try:
        dashboard_data = await dashboard_service.get_dashboard_data(period)
        return dashboard_data
    except Exception as e:
        logger.error(f"Dashboard endpoint failed: {str(e)}")
        # Return error response - let frontend handle fallbacks
        raise HTTPException(
            status_code=503, 
            detail=f"Unable to connect to Jumpseller API: {str(e)}"
        )

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


    # Build simplified payload
    payload = {
        "about": vendor_data.about,
        "phone": vendor_data.phone,
        "tax_id": vendor_data.tax_id,
        "country": vendor_data.country,
        "website": vendor_data.website,
        "documents": vendor_data.documents,
        "questions": vendor_data.questions,
        "owner_name": vendor_data.owner_name
    }


    # Publish to Google Cloud Pub/Sub instead of direct API call
    from app.clients.pubsub_client import publish_vendor_registration
    try:
        publish_vendor_registration(payload)
    except Exception as e:
        logger.error(f"Failed to publish vendor registration: {e}")
        raise HTTPException(status_code=500, detail="Failed to process registration request.")
    # Removed all code related to CREATE_SELLER_URL API call. Now only publishes to Pub/Sub.

    return {
        "message": "Registration submitted successfully",
    }