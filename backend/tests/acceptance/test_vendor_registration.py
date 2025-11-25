import requests

def test_vendor_registration():
    """Acceptance test for vendor registration endpoint."""
    url = "http://localhost:8000/api/vendors/register"
    payload = {
        "name": "Test Vendor",
        "owner_name": "Test Owner",
        "email": "testvendor@example.com",
        "questions": [
            {
                "question_id": "1",
                "question_text": "Why do you want to join?",
                "answer": "To sell products."
            }
        ]
    }
    response = requests.post(url, json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "message" in data
