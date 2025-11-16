
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pytest
from app.models.vendor import VendorRequestCreate

def test_vendor_request_create_valid():
    data = {
        "name": "Test Vendor",
        "owner_name": "Test Owner",
        "email": "test@example.com",
        "questions": [
            {"question_id": "1", "question_text": "Q1", "answer": "A valid answer"}
        ]
    }
    vendor = VendorRequestCreate(**data)
    assert vendor.name == "Test Vendor"
    assert vendor.owner_name == "Test Owner"
    assert vendor.email == "test@example.com"
    assert len(vendor.questions) == 1

def test_vendor_request_create_missing_required():
    data = {
        "name": "Test Vendor",
        # missing owner_name
        "email": "test@example.com",
        "questions": [
            {"question_id": "1", "question_text": "Q1", "answer": "A valid answer"}
        ]
    }
    with pytest.raises(Exception):
        VendorRequestCreate(**data)
