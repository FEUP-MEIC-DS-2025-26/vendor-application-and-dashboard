from fastapi import APIRouter
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Vendor API"])

# Basic health check
@router.get("/health")
async def health_check():
    """Basic API health check."""
    return {"status": "ok", "message": "Vendor API is running"}