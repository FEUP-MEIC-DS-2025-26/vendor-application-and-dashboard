from fastapi import APIRouter, HTTPException
from app.services.dashboard_service import dashboard_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Vendor API"])


# Dashboard endpoint - single call to get all dashboard data
@router.get("/dashboard")
async def get_dashboard_data():
    """Get all dashboard data in a single optimized call."""
    try:
        dashboard_data = await dashboard_service.get_dashboard_data()
        return dashboard_data
    except Exception as e:
        logger.error(f"Dashboard endpoint failed: {str(e)}")
        # Return error response - let frontend handle fallbacks
        raise HTTPException(
            status_code=503, 
            detail=f"Unable to connect to Jumpseller API: {str(e)}"
        )


# Basic health check
@router.get("/health")
async def health_check():
    """Basic API health check."""
    return {"status": "ok", "message": "Vendor API is running"}