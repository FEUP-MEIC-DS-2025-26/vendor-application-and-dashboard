from typing import Optional, List
from sqlmodel import SQLModel, Field, JSON, Column
from datetime import datetime
from pydantic import EmailStr


class VendorAnswer(SQLModel):
    """Individual answer to a verification question."""
    question_id: str
    question_text: str
    answer: str


class VendorRequest(SQLModel, table=True):
    """Vendor registration request model."""
    
    __tablename__ = "vendor_requests"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Store/Business info
    name: str = Field(max_length=200)
    owner_name: str = Field(max_length=200)
    email: str = Field(max_length=255, index=True)
    phone: Optional[str] = Field(default=None, max_length=50)
    country: Optional[str] = Field(default=None, max_length=100)
    tax_id: Optional[str] = Field(default=None, max_length=50)
    website: Optional[str] = Field(default=None, max_length=500)
    about: Optional[str] = Field(default=None, max_length=2000)
    
    # Verification questions (stored as JSON)
    questions: List[dict] = Field(default=[], sa_column=Column(JSON))
    
    # Documents/attachments (URLs or identifiers)
    documents: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
    # Status tracking
    status: str = Field(default="pending", max_length=20)  # pending, approved, rejected
    admin_notes: Optional[str] = Field(default=None, max_length=2000)
    reviewer: Optional[str] = Field(default=None, max_length=200)
    
    # Timestamps
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_at: Optional[datetime] = Field(default=None)


class VendorRequestCreate(SQLModel):
    """Schema for creating a vendor request."""
    name: str
    owner_name: str
    email: EmailStr
    phone: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    website: Optional[str] = None
    about: Optional[str] = None
    questions: List[dict]  # List of {question_id, question_text, answer}
    documents: Optional[List[str]] = None


class VendorRequestUpdate(SQLModel):
    """Schema for updating vendor status (admin action)."""
    status: str  # approved or rejected
    admin_notes: Optional[str] = None
    reviewer: Optional[str] = None


class VendorRequestResponse(SQLModel):
    """Response schema for vendor request."""
    id: int
    name: str
    owner_name: str
    email: str
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
