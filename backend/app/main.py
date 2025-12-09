from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware 
from app.api.routes import router as jumpseller_router
from app.core.config import settings
from app.api.vendors import router as vendors_router
import pathlib
import logging
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Sentry Initialization ---
if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[FastApiIntegration()],
        environment=os.getenv("ENVIRONMENT", "development"),
        traces_sample_rate=1.0, 
    )
    logger.info("Sentry telemetry initialized for backend.")
# -----------------------------

app = FastAPI(title=settings.app_name, debug=settings.debug)


# Isto permite ao Backend saber que está atrás de uma Gateway e confiar nos headers
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])
# -----------------------------------------------

# Configure CORS for frontend integration - allow all origins since we're behind a gateway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# Include Jumpseller API routes
app.include_router(jumpseller_router)

# Include Vendor registration routes
app.include_router(vendors_router)

# Path to frontend build output (frontend/dist)
ROOT = pathlib.Path(__file__).resolve().parents[2]
FRONTEND_DIST = ROOT / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:
    @app.get("/")
    def dev_message():
        return JSONResponse({
            "message": "Frontend not built. Start the frontend dev server or run a build.",
            "frontend_dev": "cd frontend && npm install && npm run dev",
            "frontend_build": "cd frontend && npm install && npm run build"
        })

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Vendor Application Backend is running"}