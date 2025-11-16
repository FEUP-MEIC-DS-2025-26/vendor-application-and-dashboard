import httpx
import base64
from typing import Dict, Any, Optional, List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class JumpsellerAPIError(Exception):
    """Custom exception for Jumpseller API errors."""
    def __init__(self, message: str, status_code: Optional[int] = None, response_data: Optional[Dict] = None):
        self.message = message
        self.status_code = status_code
        self.response_data = response_data
        super().__init__(self.message)


class JumpsellerClient:
    """
    Jumpseller API client with Basic Authentication.
    
    Usage:
        client = JumpsellerClient()
        products = await client.get_products()
        product = await client.create_product({"name": "New Product", "price": 100})
    """
    
    def __init__(self):
        self.base_url = settings.jumpseller_api_base_url
        self.login = settings.jumpseller_login
        self.auth_token = settings.jumpseller_auth_token
        self.timeout = settings.jumpseller_api_timeout
        
        # Create Basic Auth header
        credentials = f"{self.login}:{self.auth_token}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        self.auth_header = f"Basic {encoded_credentials}"
        
    def _get_headers(self, content_type: str = "application/json") -> Dict[str, str]:
        """Get headers for API requests."""
        return {
            "Authorization": self.auth_header,
            "Content-Type": content_type,
            "Accept": "application/json"
        }
    
    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Make an HTTP request to the Jumpseller API.
        
        Args:
            method: HTTP method (GET, POST, PUT, DELETE)
            endpoint: API endpoint (e.g., 'products', 'products/123')
            data: Request body data for POST/PUT requests
            params: Query parameters
            
        Returns:
            API response as dictionary
            
        Raises:
            JumpsellerAPIError: If the API request fails
        """
        url = f"{self.base_url}/{endpoint}.json"
        headers = self._get_headers()
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    json=data,
                    params=params
                )
                
                # Log request for debugging
                logger.info(f"{method} {url} -> {response.status_code}")
                
                # Handle different response status codes
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 201:
                    return response.json()
                elif response.status_code == 204:
                    return {"success": True}
                elif response.status_code == 401:
                    raise JumpsellerAPIError(
                        "Authentication failed. Check your login and auth token.",
                        status_code=401
                    )
                elif response.status_code == 404:
                    raise JumpsellerAPIError(
                        "Resource not found.",
                        status_code=404
                    )
                else:
                    error_data = None
                    try:
                        error_data = response.json()
                    except (ValueError, httpx.DecodingError) as e:
                        # Failed to parse JSON from response; keep error_data as None and log for debugging
                        logger.debug("Failed to parse JSON from error response: %s", e)
                    
                    raise JumpsellerAPIError(
                        f"API request failed with status {response.status_code}",
                        status_code=response.status_code,
                        response_data=error_data
                    )
                    
        except httpx.TimeoutException:
            raise JumpsellerAPIError("Request timeout")
        except httpx.RequestError as e:
            raise JumpsellerAPIError(f"Request error: {str(e)}")
    
    # Product Management Methods
    async def get_products(self, limit: Optional[int] = None, page: Optional[int] = None) -> List[Dict]:
        """Get all products."""
        params = {}
        if limit:
            params['limit'] = limit
        if page:
            params['page'] = page
        response = await self._make_request("GET", "products", params=params)

        # Jumpseller may return either a dict with a 'products' key or a plain list
        # where each item is a dict containing a 'product' key. Normalize both forms
        # into a list of product dicts.
        if isinstance(response, dict):
            return response.get("products", [])

        if isinstance(response, list):
            normalized = []
            for item in response:
                if isinstance(item, dict) and 'product' in item:
                    normalized.append(item.get('product'))
                else:
                    normalized.append(item)
            return normalized

        # Fallback
        return []
    
    async def get_product(self, product_id: int) -> Dict:
        """Get a specific product by ID."""
        response = await self._make_request("GET", f"products/{product_id}")
        return response.get("product", {})
    
    async def create_product(self, product_data: Dict) -> Dict:
        """Create a new product."""
        response = await self._make_request("POST", "products", data={"product": product_data})
        return response.get("product", {})
    
    async def update_product(self, product_id: int, product_data: Dict) -> Dict:
        """Update an existing product."""
        response = await self._make_request("PUT", f"products/{product_id}", data={"product": product_data})
        return response.get("product", {})
    
    async def delete_product(self, product_id: int) -> bool:
        """Delete a product."""
        await self._make_request("DELETE", f"products/{product_id}")
        return True
    
    # Order Management Methods
    async def get_orders(self, status: Optional[str] = None, limit: Optional[int] = None) -> List[Dict]:
        """Get orders, optionally filtered by status."""
        params = {}
        if status:
            params['status'] = status
        if limit:
            params['limit'] = limit
            
        response = await self._make_request("GET", "orders", params=params)

        # Normalize orders similar to products: support dict with 'orders' key or list
        if isinstance(response, dict):
            return response.get("orders", [])

        if isinstance(response, list):
            normalized = []
            for item in response:
                if isinstance(item, dict) and 'order' in item:
                    normalized.append(item.get('order'))
                else:
                    normalized.append(item)
            return normalized

        return []
    
    async def get_order(self, order_id: int) -> Dict:
        """Get a specific order by ID."""
        response = await self._make_request("GET", f"orders/{order_id}")
        return response.get("order", {})
    
    async def update_order_status(self, order_id: int, status: str) -> Dict:
        """Update order status."""
        response = await self._make_request("PUT", f"orders/{order_id}", data={"order": {"status": status}})
        return response.get("order", {})
    
    # Category Management Methods
    async def get_categories(self) -> List[Dict]:
        """Get all categories."""
        response = await self._make_request("GET", "categories")
        return response.get("categories", [])
    
    async def create_category(self, category_data: Dict) -> Dict:
        """Create a new category."""
        response = await self._make_request("POST", "categories", data={"category": category_data})
        return response.get("category", {})
    
    # Store Information Methods
    async def get_store_info(self) -> Dict:
        """Get store information from products endpoint (store endpoint doesn't exist)."""
        try:
            return {
                "name": "Made in Portugal",
                "currency": "EUR",
                "timezone": "Europe/Lisbon"
            }
        except Exception:
            return {
                "name": "Made in Portugal",
                "currency": "EUR", 
                "timezone": "Europe/Lisbon"
            }
    
    # Health Check Method
    async def health_check(self) -> bool:
        """Check if API credentials are working."""
        try:
            await self._make_request("GET", "products", params={"limit": 1})
            return True
        except JumpsellerAPIError:
            return False


# Global client instance
jumpseller_client = JumpsellerClient()