# seo-generator
# 🚀 AI-Powered SEO Meta Generator

Generate SEO-optimized titles and meta descriptions using AI for any article, webpage, or document — with support for login-based history tracking and multilingual support.

## 🌐 Live Features

- Upload a PDF or DOCX or enter a URL to generate SEO metadata
- Choose language, tone, and title length
- Download results as PDF and DOCX
- Optional login/signup for history tracking
- View your SEO generation history (if logged in)
- Responsive and modern UI built with Tailwind CSS

---

## 🧠 Tech Stack

### Frontend
- React + Vite + TypeScript
- Tailwind CSS for design
- React Query (TanStack) for data fetching
- Zustand for auth state management
- React Hook Form for form handling

### Backend
- FastAPI (Python)
- MongoDB Atlas (via Motor)
- JWT-based authentication
- OpenAI (Groq API) for content generation
- PDF and DOCX file generation

---

## 🛠 Setup Instructions

### ⚙️ Prerequisites
- Node.js (v18+)
- Python 3.10+
- MongoDB Atlas account
- Groq/OpenAI API key

---

### 🧩 Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt

---

### frontend

cd frontend
npm install
npm run dev 