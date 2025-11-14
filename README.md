# Vendor Application and Dashboard

This repository contains a comprehensive Vendor Dashboard application with a modern, organized architecture:

- **Backend**: Python + FastAPI with Jumpseller integration
- **Frontend**: TypeScript + React + Vite with organized component structure

## 📁 Project Structure

```
backend/
├── requirements.txt
├── JUMPSELLER_README.md
└── app/
    ├── main.py              # FastAPI application entry point
    ├── api/
    │   ├── __init__.py
    │   └── routes.py        # API endpoints
    ├── clients/
    │   ├── __init__.py
    │   └── jumpseller_client.py  # Jumpseller API client
    ├── core/
    │   ├── __init__.py
    │   └── config.py        # Configuration management
    └── services/
        ├── __init__.py
        └── dashboard_service.py  # Business logic

frontend/
├── package.json
├── index.html
├── tsconfig.json
├── vite.config.ts
├── public/                  # Static assets
└── src/
    ├── main.tsx            # Application entry point
    ├── components/         # Reusable UI components
    │   ├── DashboardHeader.tsx
    │   ├── ErrorScreen.tsx
    │   ├── LoadingScreen.tsx
    │   ├── ManagementGrid.tsx
    │   ├── QuickActions.tsx
    │   ├── RecentOrders.tsx
    │   └── index.ts
    ├── pages/              # Main application pages
    │   ├── App.tsx         # Main application wrapper
    │   ├── Dashboard.tsx   # Dashboard page
    │   └── index.ts
    ├── services/           # API and business logic
    │   ├── dashboardAPI.ts # Dashboard API service
    │   └── index.ts
    ├── styles/             # CSS and styling
    │   └── styles.css
    └── types/              # TypeScript definitions
        ├── dashboard.ts    # Dashboard-related types
        └── index.ts
```

## 🚀 How to Run (Development)

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- pip

### 1. Frontend Development Server

```pwsh
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Backend Development Server

In a separate terminal:

```pwsh
cd backend
# Create and activate a virtual environment (recommended)
python -m venv venv
.\venv\Scripts\Activate       # On Windows PowerShell
# source venv/bin/activate    # On Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend API will be available at `http://localhost:8000`

### 3. Production Build

To build and serve the frontend statically through the backend:

```pwsh
# Build the frontend
cd frontend
npm run build

# Start the backend (serves static files)
cd ..\backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🛠️ Development Notes

### Architecture Decisions
- **Pages vs Components**: Main application views are in `src/pages/`, reusable UI elements in `src/components/`
- **Service Layer**: API calls and business logic separated into `src/services/`
- **Type Safety**: All TypeScript interfaces centralized in `src/types/`
- **Styling**: Single CSS file with CSS custom properties for theming

### API Endpoints
- `GET /api/dashboard` - Retrieve complete dashboard data
- `GET /health` - Backend health check
- `GET /api/jumpseller/health` - Jumpseller API connectivity check