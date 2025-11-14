
from typing import Optional, List
from pydantic import BaseModel, EmailStr

class VendorAnswer(BaseModel):
    """Individual answer to a verification question."""
    question_id: str
    question_text: str
    answer: str

class VendorRequestCreate(BaseModel):
    """Schema for creating a vendor request."""
    name: str
    owner_name: str
    email: EmailStr
    phone: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    questions: List[dict]
    documents: Optional[List[str]] = None

class VendorRequestUpdate(BaseModel):
    """Schema for updating vendor status (admin action)."""
    status: str  # approved or rejected
    admin_notes: Optional[str] = None
    reviewer: Optional[str] = None

class VendorRequestResponse(BaseModel):
    """Response schema for vendor request."""
    id: int
    name: str
    owner_name: str
    email: str
    status: str
    submitted_at: str
    reviewed_at: Optional[str] = None


