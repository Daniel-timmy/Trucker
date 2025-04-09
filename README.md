# Trucker

**Trucker** is a full-stack application built with Django (backend) and React (frontend) that helps property-carrying truck drivers plan their trips and generate Electronic Logging Device (ELD) logs. The app accepts trip details as input, calculates routes with required stops, and outputs daily log sheets that comply with Hours of Service (HOS) regulations (70 hours/8 days). It features a clean and responsive UI/UX.

---

## 🚚 Features

- **Trip Input**: Enter current location, pickup and dropoff locations, and current cycle hours.
- **Route Calculation**: Displays a route map with:
  - Rest stops based on HOS rules.
- **ELD Logs**: Generates daily logs with visual timelines showing:
  - Driving
  - On-Duty
  - Off-Duty
  - Includes 1-hour pickup/dropoff buffers.
- **Responsive UI**: Mobile and desktop friendly using `react-bootstrap`.
- **PDF Download**: Export logs as downloadable PDF files.

---

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- `@arcgis/core` – Mapping & routing
- `react-bootstrap` – UI components
- `axios` – API requests
- `jwt-decode` – JWT decoding
- `html2canvas`, `jsPDF` – For generating PDFs

**Backend:**

- Django
- Django REST Framework
- SQLite (or PostgreSQL for production)

**APIs:**

- ArcGIS (mapping and routing)
- LocationIQ (geocoding)

**Deployment:**

- Frontend: [Vercel](https://vercel.com/)
- Backend: [Render](https://render.com/)

---

## ✅ Assumptions

- Driver follows 70-hour/8-day HOS rules.
- No adverse driving conditions are considered.
- Fueling occurs at least every 1,000 miles.
- Pickup and dropoff each take 1 hour.

---

## 🔧 Setup Instructions

### 🔁 Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- Git
- Vercel CLI (for frontend deployment)
- Render account (for backend deployment)

---

## ⚛️ Frontend Setup (`trucker_frontend`)

### 🖥️ Local Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd trucker_frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**  
   Create a `.env` file in the `trucker_frontend` directory:

```env
VITE_API_URL=http://localhost:8000/driver
VITE_ARCGIS_API_KEY=<your-arcgis-key>
```

> - `VITE_API_URL`: Points to your Django backend API.
> - `VITE_ARCGIS_API_KEY`: Get from [ArcGIS Developer](https://developers.arcgis.com/).

4. **Run the app locally**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

### 🌐 Deployment to Vercel

1. **Build the frontend**

```bash
npm run build
```

2. **Log in and deploy to Vercel**

```bash
vercel login
vercel
```

> Follow the prompts and configure environment variables on the Vercel dashboard.

---

## 🐍 Backend Setup (`backend`)

### 🖥️ Local Setup

1. **Navigate to backend folder**

```bash
cd ../backend
```

2. **Create and activate virtual environment**

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Set up environment variables**  
   Create a `.env` file in the `backend` directory:

For SQLite:

```env
ARCGIS_API_KEY=<your-arcgis-key>
SERVICE_URI=https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World
DB_NAME=sqlite3.db
API_KEY=<your-locationiq-key>  # Optional
```

For PostgreSQL:

```env
ARCGIS_API_KEY=...
SERVICE_URI=...
DB_NAME=trucker_db
DB_USER=admin
DB_PASSWORD=securepassword123
DB_HOST=localhost
DB_PORT=5432
API_KEY=...
```

5. **Apply migrations**

```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Run the server**

```bash
python manage.py runserver
```

API available at [http://localhost:8000/driver](http://localhost:8000)

---

### ☁️ Deployment to Render

1. **Ensure `requirements.txt` is ready**  
   Includes `django`, `djangorestframework`, `gunicorn`, etc.

2. **Optional: Create `render.yaml`**

```yaml
services:
  - type: web
    name: trucker-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn your_project_name.wsgi:application
    envVars:
      - key: ARCGIS_API_KEY
        sync: false
      - key: SERVICE_URI
        sync: false
      - key: DB_NAME
        sync: false
      - key: DB_USER
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: DB_HOST
        sync: false
      - key: DB_PORT
        sync: false
      - key: API_KEY
        sync: false
```

3. **Deploy on Render**

- Push to GitHub.
- Log in to [Render](https://render.com).
- Create a new Web Service and connect your repository.
- Add environment variables in Render dashboard.
- Deploy.

---

## 🚀 Usage

1. **Enter Trip Details**  
   Input Current Location, Pickup & Dropoff Locations, and Cycle Hours.

2. **View Route and Logs**  
   See route map with fueling/rest stops and generated ELD log sheet.

3. **Download Logs**  
   Click **"Download Logs"** to get logs as a PDF.

---

## 📦 Frontend Module Notes

- `@arcgis/core`: Map visualization and routing (ArcGIS API).
- `react-bootstrap`: Responsive UI components.
- `axios`: Handles API requests to the backend.
- `jwt-decode`: (If auth is added) Decodes JWT tokens.
- `html2canvas`, `jsPDF`: Convert ELD logs to downloadable PDFs.

---
