from typing import Dict, Any, List
from app.clients.jumpseller_client import jumpseller_client
import asyncio
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class DashboardService:
    """Service to aggregate dashboard data from Jumpseller API."""
    
    async def get_dashboard_data(self, period: str = "daily") -> Dict[str, Any]:
        """
        Get all dashboard data in a single call.
        Aggregates multiple API calls for efficient dashboard loading.
        """
        # Run multiple API calls concurrently
        results = await asyncio.gather(
            self._get_orders_summary(),
            self._get_products_summary(),
            self._get_recent_orders(),
            self._get_store_info(),
            self._get_sales_chart_data(period), # Pass period here
            return_exceptions=True
        )
        
        orders_summary, products_summary, recent_orders, store_info, sales_chart = results
        
        # Check if any critical API calls failed
        if isinstance(store_info, Exception):
            raise Exception(f"Failed to get store info: {store_info}")
        
        # Build dashboard data
        dashboard_data = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "store_info": store_info,
            "stats": {
                "orders": orders_summary if not isinstance(orders_summary, Exception) else {"new_orders": 0, "total_orders": 0, "monthly_revenue": 0, "currency": "EUR"},
                "products": products_summary if not isinstance(products_summary, Exception) else {"total_products": 0, "active_products": 0, "low_stock_alerts": 0}
            },
            "recent_orders": recent_orders if not isinstance(recent_orders, Exception) else [],
            "sales_chart": sales_chart if not isinstance(sales_chart, Exception) else [],
            "quick_actions": self._get_quick_actions_data()
        }
        
        return dashboard_data
    
    async def _get_orders_summary(self) -> Dict[str, Any]:
        """Get orders summary for dashboard stats."""
        try:
            all_orders = await jumpseller_client.get_orders(limit=100)
            total_orders = len(all_orders)

            now = datetime.utcnow()
            window_30d_start = now - timedelta(days=30)
            window_24h_start = now - timedelta(days=1)

            def parse_order_date(date_str: str):
                if not date_str: 
                    return None
                try:
                    ds = date_str.replace(' UTC', '').strip()
                    return datetime.strptime(ds, '%Y-%m-%d %H:%M:%S')
                except Exception:
                    try: 
                        return datetime.fromisoformat(date_str)
                    except Exception: 
                        return None

            def get_order_total(order: Dict[str, Any]) -> float:
                for key in ('total', 'total_price', 'grand_total', 'amount'):
                    val = order.get(key)
                    if val is not None:
                        try:
                            return float(val)
                        except (TypeError, ValueError):
                            # non-numeric or unexpected type
                            pass
                totals = order.get('totals') or {}
                for key in ('total', 'grand_total', 'amount'):
                    val = totals.get(key)
                    if val is not None:
                        try:
                            return float(val)
                        except (TypeError, ValueError):
                            # totals field may be malformed or non-numeric
                            pass
                total = 0.0
                for li in order.get('line_items', []) or []:
                    try:
                        price = float(li.get('price', 0) or 0)
                        qty = int(li.get('quantity', 1) or 1)
                        total += price * qty
                    except (TypeError, ValueError):
                        # skip malformed line item
                        continue
                return total

            new_orders_count = 0
            revenue_status = {'completed', 'shipped', 'delivered', 'paid'}
            current_month_revenue = 0.0

            for order in all_orders:
                status = (order.get('status') or '').strip().lower()
                order_date = parse_order_date(order.get('created_at') or order.get('date') or '')

                if status == 'pending' and order_date is not None:
                    if window_24h_start <= order_date <= now:
                        new_orders_count += 1

                if status in revenue_status and order_date is not None:
                    if window_30d_start <= order_date <= now:
                        current_month_revenue += get_order_total(order)
            
            return {
                "new_orders": new_orders_count,
                "total_orders": total_orders,
                "monthly_revenue": current_month_revenue,
                "currency": "EUR"
            }
        except Exception as e:
            logger.error(f"Orders summary failed: {str(e)}")
            raise
    
    async def _get_products_summary(self) -> Dict[str, Any]:
        try:
            products = await jumpseller_client.get_products(limit=50)
            active_products = len([p for p in products if p.get('status') == 'active'])
            low_stock = len([p for p in products if bool(p.get('stock_notification'))])
            return {
                "total_products": len(products),
                "active_products": active_products,
                "low_stock_alerts": low_stock
            }
        except Exception as e:
            logger.error(f"Products summary failed: {str(e)}")
            raise
    
    async def _get_recent_orders(self) -> List[Dict]:
        try:
            orders = await jumpseller_client.get_orders(limit=5)
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
    
    async def _get_sales_chart_data(self, period: str) -> List[Dict[str, Any]]:
        """
        Get sales totals aggregated by period (daily, weekly, monthly).
        """
        try:
            # 1. Determine Date Range
            now = datetime.utcnow()
            if period == 'monthly':
                days_back = 365 # Last 12 months approx
            elif period == 'weekly':
                days_back = 90  # Last 12 weeks approx
            else:
                days_back = 30  # Last 30 days

            start_date = now - timedelta(days=days_back)
            
            # 2. Fetch orders (fetch more for longer periods)
            limit = 200 if period == 'monthly' else 100
            orders = await jumpseller_client.get_orders(limit=limit)
            
            # 3. Initialize aggregation dictionary
            chart_data = {}
            
            # Pre-fill keys to ensure continuous graph (optional but good for UX)
            # For simplicity, we will just sort the available data points, 
            # but filling gaps with 0 is ideal. We'll skip pre-fill for variable periods to keep code simple.

            valid_status = {'completed', 'shipped', 'delivered', 'paid'}

            for order in orders:
                status = (order.get('status') or '').strip().lower()
                
                if status in valid_status:
                    date_str = order.get('created_at') or order.get('date')
                    if not date_str: 
                        continue
                        
                    try:
                        dt = date_str.replace(' UTC', '').strip()
                        order_date = datetime.strptime(dt, '%Y-%m-%d %H:%M:%S')
                    except (ValueError, TypeError):
                        # unable to parse this date string
                        continue

                    # Filter out old orders
                    if order_date < start_date:
                        continue

                    # Determine Key based on Period
                    if period == 'monthly':
                        date_key = order_date.strftime('%Y-%m') # 2025-11
                    elif period == 'weekly':
                        # ISO Week number
                        year, week, _ = order_date.isocalendar()
                        date_key = f"{year}-W{week:02d}"
                    else:
                        date_key = order_date.strftime('%Y-%m-%d')
                    
                    # Aggregate
                    total = float(order.get('total', 0) or 0)
                    chart_data[date_key] = chart_data.get(date_key, 0.0) + total

            # 4. Convert to list and Sort
            result = [{"date": key, "sales": round(amount, 2)} for key, amount in chart_data.items()]
            result.sort(key=lambda x: x['date'])
            
            # If empty (no sales), return at least one empty point to prevent frontend errors
            if not result:
                return []
                
            return result

        except Exception as e:
            logger.error(f"Sales chart data failed: {str(e)}")
            return []
    
    def _get_quick_actions_data(self) -> List[Dict]:
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
            }
        ]


# Global service instance
dashboard_service = DashboardService()