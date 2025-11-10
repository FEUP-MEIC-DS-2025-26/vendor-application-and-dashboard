from typing import Dict, Any, List
from app.clients.jumpseller_client import jumpseller_client
import asyncio
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class DashboardService:
    """Service to aggregate dashboard data from Jumpseller API."""
    
    async def get_dashboard_data(self) -> Dict[str, Any]:
        """
        Get all dashboard data in a single call.
        Aggregates multiple API calls for efficient dashboard loading.
        """
        # Run multiple API calls concurrently for better performance
        results = await asyncio.gather(
            self._get_orders_summary(),
            self._get_products_summary(),
            self._get_recent_orders(),
            self._get_store_info(),
            return_exceptions=True
        )
        
        orders_summary, products_summary, recent_orders, store_info = results
        
        # Check if any critical API calls failed
        if isinstance(store_info, Exception):
            raise Exception(f"Failed to get store info: {store_info}")
        
        # Build dashboard data - let individual failures be handled gracefully
        dashboard_data = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "store_info": store_info,
            "stats": {
                "orders": orders_summary if not isinstance(orders_summary, Exception) else {"new_orders": 0, "total_orders": 0, "monthly_revenue": 0, "currency": "EUR"},
                "products": products_summary if not isinstance(products_summary, Exception) else {"total_products": 0, "active_products": 0, "low_stock_alerts": 0}
            },
            "recent_orders": recent_orders if not isinstance(recent_orders, Exception) else [],
            "quick_actions": self._get_quick_actions_data()
        }
        
        return dashboard_data
    
    async def _get_orders_summary(self) -> Dict[str, Any]:
        """Get orders summary for dashboard stats."""
        try:
            # Get recent orders (last 30 days)
            all_orders = await jumpseller_client.get_orders(limit=100)
            
            # Calculate stats
            total_orders = len(all_orders)
            pending_orders = len([o for o in all_orders if o.get('status') == 'pending'])
            
            # Calculate revenue (this month)
            current_month_revenue = 0.0

            # Use last 30 days window (common interpretation of "last month" for dashboards)
            now = datetime.utcnow()
            window_start = now - timedelta(days=30)

            def parse_order_date(date_str: str):
                if not date_str:
                    return None
                # Common Jumpseller format: '2025-11-04 16:01:35 UTC'
                try:
                    # Remove trailing timezone designator if present
                    ds = date_str.replace(' UTC', '').strip()
                    return datetime.strptime(ds, '%Y-%m-%d %H:%M:%S')
                except Exception:
                    try:
                        return datetime.fromisoformat(date_str)
                    except Exception:
                        return None

            def get_order_total(order: Dict[str, Any]) -> float:
                # Try several common fields used by APIs
                for key in ('total', 'total_price', 'grand_total', 'amount'):
                    val = order.get(key)
                    if val is not None:
                        try:
                            return float(val)
                        except Exception:
                            pass

                # Try totals object
                totals = order.get('totals') or {}
                for key in ('total', 'grand_total', 'amount'):
                    val = totals.get(key)
                    if val is not None:
                        try:
                            return float(val)
                        except Exception:
                            pass

                # Fallback: sum line items price * quantity
                total = 0.0
                for li in order.get('line_items', []) or []:
                    try:
                        price = float(li.get('price', 0) or 0)
                        qty = int(li.get('quantity', 1) or 1)
                        total += price * qty
                    except Exception:
                        continue
                return total

            valid_statuses = {'completed', 'shipped', 'delivered', 'paid'}
            for order in all_orders:
                status = (order.get('status') or '').strip().lower()
                order_date = parse_order_date(order.get('created_at') or order.get('date') or '')
                if status in valid_statuses and order_date is not None:
                    # check if order was in the last 30 days window
                    if window_start <= order_date <= now:
                        current_month_revenue += get_order_total(order)
            
            return {
                "new_orders": pending_orders,
                "total_orders": total_orders,
                "monthly_revenue": current_month_revenue,
                "currency": "EUR"  # You can get this from store info
            }
            
        except Exception as e:
            logger.error(f"Orders summary failed: {str(e)}")
            raise
    
    async def _get_products_summary(self) -> Dict[str, Any]:
        """Get products summary for dashboard."""
        try:
            products = await jumpseller_client.get_products(limit=50)
            
            active_products = len([p for p in products if p.get('status') == 'active'])
            low_stock = len([p for p in products if int(p.get('stock', 0)) < 5])
            
            return {
                "total_products": len(products),
                "active_products": active_products,
                "low_stock_alerts": low_stock
            }
            
        except Exception as e:
            logger.error(f"Products summary failed: {str(e)}")
            raise
    
    async def _get_recent_orders(self) -> List[Dict]:
        """Get recent orders for dashboard display."""
        try:
            orders = await jumpseller_client.get_orders(limit=5)
            
            # Format orders for dashboard display
            formatted_orders = []
            for order in orders:
                formatted_orders.append({
                    "id": order.get("id"),
                    "customer": order.get("customer", {}).get("name", "Unknown"),
                    "total": order.get("total", 0),
                    "status": order.get("status", "pending"),
                    "date": order.get("created_at", ""),
                    "items_count": len(order.get("line_items", []))
                })
            
            return formatted_orders
            
        except Exception as e:
            logger.error(f"Recent orders failed: {str(e)}")
            raise
    
    async def _get_store_info(self) -> Dict[str, Any]:
        """Get basic store information."""
        try:
            store = await jumpseller_client.get_store_info()
            return {
                "name": store.get("name", "Your Store"),
                "currency": store.get("currency", "EUR"),
                "timezone": store.get("timezone", "UTC")
            }
        except Exception as e:
            logger.error(f"Store info failed: {str(e)}")
            raise
    
    def _get_quick_actions_data(self) -> List[Dict]:
        """Get quick actions configuration for dashboard."""
        return [
            {
                "id": "add_product",
                "title": "Add New Product",
                "description": "Create and list a new product",
                "icon": "➕",
                "action": "create_product"
            },
            {
                "id": "view_orders",
                "title": "Manage Orders",
                "description": "View and update order status",
                "icon": "📦",
                "action": "view_orders"
            },
            {
                "id": "inventory",
                "title": "Check Inventory",
                "description": "Monitor stock levels",
                "icon": "📊",
                "action": "view_inventory"
            },
            {
                "id": "analytics",
                "title": "Sales Analytics",
                "description": "View performance metrics",
                "icon": "📈",
                "action": "view_analytics"
            }
        ]


# Global service instance
dashboard_service = DashboardService()