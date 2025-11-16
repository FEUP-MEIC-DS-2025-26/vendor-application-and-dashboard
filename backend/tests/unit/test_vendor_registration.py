
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_vendor_validation():
    # Missing required fields
    payload = {
        "name": "Test Vendor",
        "email": "test@example.com",
        "questions": []
    }
    response = client.post("/api/vendors/register", json=payload)
    assert response.status_code == 422 or response.status_code == 400

def test_register_vendor_success(monkeypatch):
    # Patch the async httpx call to simulate success
    async def mock_post(self, *args, **kwargs):
        class MockResponse:
            def raise_for_status(self): pass
            def json(self): return {"id": 1}
        return MockResponse()

    monkeypatch.setattr("httpx.AsyncClient.post", mock_post)
    payload = {
        "name": "Test Vendor",
        "owner_name": "Test Owner",
        "email": "test@example.com",
        "questions": [
            {"question_id": "1", "question_text": "Q1", "answer": "A valid answer"}
        ]
    }
    response = client.post("/api/vendors/register", json=payload)
    assert response.status_code in (200, 201)
    assert "message" in response.json()
