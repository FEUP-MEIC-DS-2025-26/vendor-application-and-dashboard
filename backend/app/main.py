from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
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
        # Use ENVIRONMENT variable (e.g., "production", "development")
        environment=os.getenv("ENVIRONMENT", "development"),
        traces_sample_rate=1.0, # Monitor performance
    )
    logger.info("Sentry telemetry initialized for backend.")
# -----------------------------

app = FastAPI(title=settings.app_name, debug=settings.debug)

# Configure CORS for frontend integration
from app.core.config import settings as app_settings
cors_origins = ["http://localhost:5173", "http://localhost:3000"]
frontend_url = getattr(app_settings, "frontend_url", None)
if frontend_url:
    cors_origins.append(frontend_url)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Jumpseller API routes
app.include_router(jumpseller_router)

# Include Vendor registration routes
app.include_router(vendors_router)

# Path to frontend build output (frontend/dist)
ROOT = pathlib.Path(__file__).resolve().parents[2]
FRONTEND_DIST = ROOT / "frontend" / "dist"


if FRONTEND_DIST.exists():
    # Serve the built frontend as static files (if present)
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


# --- Sentry Test Endpoints (Commented out - only for testing) ---
# @app.get("/api/test-sentry-error")
# def test_sentry_error():
#     """Trigger a test error to verify Sentry is working"""
#     raise Exception("Sentry Test Error from Backend")
#
#
# @app.get("/api/test-sentry-message")
# def test_sentry_message():
#     """Send a test message to Sentry"""
#     sentry_sdk.capture_message("Sentry Test Message from Backend", level="info")
#     return {"message": "Test message sent to Sentry"}
# ----------------------------