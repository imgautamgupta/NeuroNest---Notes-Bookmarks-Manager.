# NeuroNest - Personal Notes & Bookmark Manager

NeuroNest is a full-stack, AI-powered productivity application designed to help you securely manage your notes and bookmarks with intelligence.

## 🚀 Features

-   **JWT Authentication**: Secure login and registration.
-   **Notes Module**: Rich text editing (TipTap), tags, and search.
-   **Bookmark Module**: Save URLs with automated metadata previews (Title, Description, Favicon, Image).
-   **AI Integration**: Automated note summarization and tag generation.
-   **Dashboard Analytics**: Visual insights into your productivity using Recharts.
-   **Premium UI**: Modern glassmorphism design with Dark/Light mode.
-   **Responsive**: Fully functional on mobile and desktop.

## 🛠️ Tech Stack

-   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, TanStack Query, Zustand.
-   **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, OpenAI (optional).

## 📦 Setup Instructions

### Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see `.env.example`):
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_key_optional
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js app:
   ```bash
   npm run dev
   ```

## 🧠 AI Features

Aura uses OpenAI to summarize notes and suggest tags. If you don't provide an `OPENAI_API_KEY`, the application will fall back to basic extraction logic, so it remains fully functional!

## 🛡️ Security

-   Password hashing with `bcryptjs`.
-   Protected API routes using JWT.
-   User data isolation (you only see your own notes/bookmarks).
-   Secure HTTP headers and CORS configuration.
