# 🧠 AI SEO Generator

> 🚀 Instantly generate SEO-optimized titles and meta descriptions from URLs or uploaded articles using AI (LLaMA 3 via Groq API). Supports PDF/DOCX upload, multilingual metadata generation, download as PDF/DOCX, and user history tracking.


## 📂 Project Structure

```bash
seo-generator/
├── backend/        # FastAPI backend with Groq AI, MongoDB, JWT auth
├── frontend/       # React + Tailwind CSS frontend with Auth & History
├── README.md       # You're here

✨ Features
🧠 AI-powered metadata generation using Groq + LLaMA 3
🔗 Extract content from URLs or upload PDF/DOCX
🌍 Multilingual SEO metadata (English, French, German, Spanish, Italian, etc.)
📝 Download generated result as PDF & DOCX
🔐 Optional Signup/Login with JWT
📜 Logged-in users get access to history of SEO jobs
💾 Uses MongoDB Atlas for user and job data
💡 Responsive design with Tailwind CSS
✅ Built with React, FastAPI, MongoDB, Groq, Zustand, React Query, and more
🚀 Getting Started (Local Development)

1. 🛠️ Prerequisites
Node.js
Python 3.10+
MongoDB Atlas
Groq API Key

2. 📦 Backend Setup (/backend)

cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

🔐 Create .env file

GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret
MONGO_URL=your_mongodb_connection_string

▶️ Run Backend Server

uvicorn app.main:app --reload
API will be available at: http://localhost:8000

3. 🌐 Frontend Setup (/frontend)

cd frontend
npm install
npm run dev
App will be available at: http://localhost:5173

🔗 API Overview
POST /api/v1/generate-seo
Generate title + meta description from content
POST /api/v1/signup, POST /api/v1/login
Auth endpoints — returns JWT token
GET /api/v1/history
Get SEO job history (requires Authorization header)

🔐 Auth & History Logic
Logged-in users receive a JWT token (stored in localStorage)
Logged-in users can see their past SEO jobs on the /history page
Anonymous users can still generate SEO and download results — but no history is saved

📦 Tech Stack
Area	Tech Used
Frontend	React, Vite, Tailwind CSS, Zustand
Backend	FastAPI, Groq (LLaMA 3), Pydantic v2
Auth	JWT (PyJWT), bcrypt
DB	MongoDB Atlas (Motor Async Driver)
File Gen	python-docx, fpdf


🧪 Future Improvements
✅ Add user profile and password reset
🌍 Language detection for uploaded content
📊 Analytics for SEO performance
💬 AI suggestions for improvements

🙌 Author
Developed by Kshitiz Gaur — reach out for collaboration or contributions!
