# TN Pulse

TN Pulse is a modern civic engagement platform built for Tamil Nadu.

## Production Deployment (Render)

This repository is configured for immediate deployment to [Render](https://render.com) and similar cloud platforms.

### 1. Database (Render PostgreSQL)
- Create a new PostgreSQL instance on Render.
- Copy the **Internal Database URL**.

### 2. Backend (Render Web Service)
- Create a new Web Service connected to this GitHub repo.
- **Root Directory:** `backend`
- **Build Command:** `mvn clean package -DskipTests` (or use the provided `Dockerfile`)
- **Start Command:** `java -jar target/api-0.0.1-SNAPSHOT.jar`
- **Environment Variables:**
  - `SPRING_DATASOURCE_URL`: The Database URL from Step 1
  - `SPRING_DATASOURCE_USERNAME`: Your DB user
  - `SPRING_DATASOURCE_PASSWORD`: Your DB password
  - `JWT_SECRET`: A long random secure string
  - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
  - `CLOUDINARY_API_KEY`: Your Cloudinary API key
  - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
  - `CORS_ALLOWED_ORIGINS`: The URL of your deployed frontend (e.g., `https://your-frontend.onrender.com`)

### 3. Frontend (Render Static Site)
- Create a new Static Site connected to this GitHub repo.
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`)

## Local Development

1. Create `.env` files in both `frontend` and `backend` using the provided `.env.example` templates.
2. Run PostgreSQL locally on port `5432` with user `postgres` / `postgres`.
3. Start the backend: `cd backend && mvn spring-boot:run`
4. Start the frontend: `cd frontend && npm run dev`
