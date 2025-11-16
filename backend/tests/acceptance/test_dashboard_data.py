import requests

def test_dashboard_data():
    """Acceptance test for dashboard data endpoint."""
    # First, login to get token
    dashboard_url = "http://localhost:8000/api/dashboard"
    dashboard_response = requests.get(dashboard_url)
    assert dashboard_response.status_code == 200
    data = dashboard_response.json()
    assert "recent_orders" in data
    assert "stats" in data
