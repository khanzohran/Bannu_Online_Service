# Bannu Online Service

React + Vite frontend and Express/MongoDB backend.

## Frontend (Vercel)
1. Import this project into Vercel.
2. Set **Root Directory** to `frontend` (lowercase).
3. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Set `VITE_Backend_base_ULR` to your deployed backend URL, without a trailing slash.

Local frontend setup:
```bash
cd frontend
# Copy .env.example to .env and set the backend URL
npm install
npm run dev
```

## Backend
Deploy the `backend` folder to a Node.js host that supports an Express server. Configure `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL` (exact Vercel origin), and `PORT` in the host environment. Install dependencies in `backend` and run `npm start`.

For local backend development, copy `backend/.env.example` to `backend/.env` and replace the placeholders with a real MongoDB Atlas URI and a strong random JWT secret. Never commit `.env` files.

## Security
The uploaded source included a MongoDB connection string with credentials. This corrected copy removes the hardcoded connection string and reads `MONGO_URI` from the environment. **Rotate the MongoDB database user's password in Atlas before deploying**, because the old credential was included in the uploaded source.

A live deployment also depends on valid hosting variables, MongoDB Atlas network access settings, and the backend being online.
