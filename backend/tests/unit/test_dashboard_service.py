
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import pytest
from app.services.dashboard_service import DashboardService

@pytest.mark.asyncio
async def test_get_dashboard_data_returns_dict(monkeypatch):
    # Patch all async methods to return dummy data
    class DummyService(DashboardService):
        async def _get_orders_summary(self):
            return {"new_orders": 1, "total_orders": 2, "monthly_revenue": 100, "currency": "EUR"}
        async def _get_products_summary(self):
            return {"total_products": 5, "active_products": 4, "low_stock_alerts": 0}
        async def _get_recent_orders(self):
            return []
        async def _get_store_info(self):
            return {"name": "Test Store", "currency": "EUR"}

    service = DummyService()
    data = await service.get_dashboard_data()
    assert isinstance(data, dict)
    assert "store_info" in data
    assert "stats" in data
    assert "orders" in data["stats"]
    assert "products" in data["stats"]
