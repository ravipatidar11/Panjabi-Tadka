# Punjabi Tadka deployment

## Architecture

`Vercel frontend -> Render FastAPI -> Supabase PostgreSQL`

The frontend reads `VITE_API_URL` at build time. The FastAPI service reads `DATABASE_URL` and `ALLOWED_ORIGINS` at runtime. FastAPI creates the tables and seeds the INR menu on first startup when the menu table is empty.

## 1. Supabase FREE

1. Create a Supabase project.
2. Open **Project Settings -> Database -> Connection string -> URI**.
3. Copy the URI and replace `[YOUR-PASSWORD]` with the database password.
4. Keep the URI private. It is used only as Render's `DATABASE_URL`.

## 2. Render FREE

Create a new **Web Service** from this repository:

- Root directory: `backend`
- Runtime: `Python 3`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/health`

Set these Render environment variables:

```text
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN.vercel.app,http://localhost:3000
FRONTEND_URL=https://YOUR_VERCEL_DOMAIN.vercel.app
```

Deploy and verify:

```text
https://YOUR_RENDER_SERVICE.onrender.com/health
```

It should return `{"status":"ok"}`. The first boot creates the SQLAlchemy tables and seeds menu data in Supabase.

## 3. Vercel FREE

1. Import the same repository into Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add this environment variable for Production, Preview, and Development:

```text
VITE_API_URL=https://YOUR_RENDER_SERVICE.onrender.com
```

6. Deploy once.
7. Copy the resulting Vercel domain and add it to Render's `ALLOWED_ORIGINS` as a comma-separated value.
8. Redeploy Render, then redeploy Vercel so the final CORS and build-time API URL are both active.

## Local development

Terminal 1:

```cmd
cd /d C:\WEB\html6\Panjabi-Tadka
C:/Users/mahakaal/AppData/Local/Programs/Python/Python314/python.exe -m pip install -r backend\requirements.txt
C:/Users/mahakaal/AppData/Local/Programs/Python/Python314/python.exe -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

Terminal 2:

```cmd
cd /d C:\WEB\html6\Panjabi-Tadka
npm install
set VITE_API_URL=http://localhost:8000
npm run dev
```

Open `http://localhost:3000`.

## Final public URL structure

The one-click public website URL is the Vercel URL:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app
```

The browser silently calls the Render API:

```text
https://YOUR_RENDER_SERVICE.onrender.com/api/menu
https://YOUR_RENDER_SERVICE.onrender.com/api/orders
https://YOUR_RENDER_SERVICE.onrender.com/api/reservations
https://YOUR_RENDER_SERVICE.onrender.com/api/catering
https://YOUR_RENDER_SERVICE.onrender.com/api/contact
```

There is no real final public URL until the Vercel and Render services are created in the user's accounts. The repository contains `render.yaml`, `vercel.json`, and environment examples to make those deployments repeatable without exposing database credentials.
