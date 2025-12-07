<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-00f0ff?style=for-the-badge&logo=openai&logoColor=white" alt="AI Powered"/>
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
</p>

<h1 align="center">
  ⚡ SEO.AI Generator
</h1>

<p align="center">
  <strong>AI-Powered SEO Metadata Generation Platform</strong><br/>
  Generate optimized titles & meta descriptions instantly using advanced LLMs
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-reference">API</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 📸 Screenshots

<p align="center">
  <strong>🏠 Landing Page</strong><br/>
  <img src="screenshots/landing.png" alt="Landing Page" width="800"/>
</p>

<p align="center">
  <strong>⚡ SEO Generator</strong><br/>
  <img src="screenshots/generator.png" alt="Generator Page" width="800"/>
</p>

<p align="center">
  <strong>🔐 Login Page</strong><br/>
  <img src="screenshots/login.png" alt="Login Page" width="800"/>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Generation** | Leverages Groq's LLaMA 3.1 for instant, high-quality SEO content |
| 📄 **Multi-Format Input** | Upload PDFs, DOCX files, or paste any URL for analysis |
| 🌍 **50+ Languages** | Generate metadata in English, Spanish, French, German, and more |
| 🎭 **Tone Customization** | Professional, Friendly, Urgent, Casual, Formal, or Exciting |
| 📊 **History Tracking** | Logged-in users can access their complete generation history |
| 📥 **Export Options** | Download results as PDF or DOCX documents |
| 🔐 **JWT Authentication** | Secure user authentication with bcrypt password hashing |
| 🎨 **Cyberpunk UI** | Stunning futuristic interface with glassmorphism and neon effects |

---

## 🛠 Tech Stack

### Frontend
```
React 18.2 + TypeScript + Vite 7
├── Tailwind CSS      → Utility-first styling
├── Framer Motion     → Smooth animations
├── React Query       → Server state management
├── Zustand           → Client state management
├── React Hook Form   → Form handling
└── React Dropzone    → File uploads
```

### Backend
```
FastAPI (Python 3.10+)
├── Motor            → Async MongoDB driver
├── python-jose      → JWT authentication
├── Passlib          → Password hashing
├── OpenAI SDK       → Groq API integration
├── newspaper3k      → URL content extraction
├── pdfminer.six     → PDF text extraction
├── python-docx      → DOCX processing
└── fpdf2            → PDF generation
```

### Infrastructure
```
MongoDB Atlas    → Cloud database
Groq API         → LLaMA 3.1 inference
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Landing   │  │  Generator  │  │     History/Results     │  │
│  │    Page     │  │    Form     │  │         Pages           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     API Routes                            │   │
│  │  POST /api/v1/generate-seo   → Content analysis + AI gen  │   │
│  │  GET  /api/v1/status/:id     → Job status polling         │   │
│  │  POST /api/v1/signup         → User registration          │   │
│  │  POST /api/v1/login          → JWT authentication         │   │
│  │  GET  /api/v1/history        → User generation history    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────────┐  ┌───────────┴───────────┐  ┌────────────────┐  │
│  │  Content   │  │      AI Engine        │  │  File Gen      │  │
│  │ Extractor  │  │  (Groq LLaMA 3.1)     │  │  PDF/DOCX      │  │
│  └────────────┘  └───────────────────────┘  └────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS                               │
│  ┌─────────────────┐           ┌─────────────────────────────┐  │
│  │     users       │           │         seo_jobs            │  │
│  │  - email        │           │  - user_id                  │  │
│  │  - password     │           │  - title                    │  │
│  └─────────────────┘           │  - meta_description         │  │
│                                │  - pdf_url / docx_url       │  │
│                                │  - created_at               │  │
│                                └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0
- **Python** ≥ 3.10
- **MongoDB Atlas** account
- **Groq API** key ([Get one free](https://console.groq.com/))

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/seo-generator.git
cd seo-generator
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

**`.env` Configuration:**
```env
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/seo_generator_db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access the app:** http://localhost:5173

---

## 📡 API Reference

### Generate SEO Metadata
```http
POST /api/v1/generate-seo
Content-Type: multipart/form-data
Authorization: Bearer <token>  # Optional

# Form Data
file: <PDF/DOCX>  # OR
url: <string>
language: en|fr|de|es|it|pt|ja|ko|zh|hi
tone: Professional|Friendly|Urgent|Casual|Formal|Exciting
length: 60  # Max title characters
```

**Response:**
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Job Status
```http
GET /api/v1/status/{jobId}
```

**Response:**
```json
{
  "status": "completed",
  "title": "Ultimate Guide to AI-Powered Marketing",
  "meta_description": "Discover how AI transforms...",
  "pdf_url": "http://localhost:8000/downloads/550e8400.pdf",
  "docx_url": "http://localhost:8000/downloads/550e8400.docx"
}
```

### Authentication
```http
POST /api/v1/signup
Content-Type: application/json

{ "email": "user@example.com", "password": "secure123" }
```

```http
POST /api/v1/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secure123" }
```

---

## 📁 Project Structure

```
seo-generator/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app & routes
│   │   ├── auth.py          # JWT authentication
│   │   ├── models.py        # Pydantic models
│   │   ├── db/
│   │   │   └── mongo.py     # MongoDB connection
│   │   ├── routes/
│   │   │   └── history.py   # History endpoints
│   │   └── utils/
│   │       └── file_generator.py  # PDF/DOCX generation
│   ├── downloads/           # Generated files
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand stores
│   │   ├── index.css        # Cyberpunk design system
│   │   └── App.tsx          # Router setup
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

---

## 🚢 Deployment

### Backend (Render / Railway)

1. Set environment variables in dashboard
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Update CORS origins in `main.py` to your frontend URL

### Frontend (Vercel / Netlify)

1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 🔒 Security

- Passwords hashed with **bcrypt**
- JWT tokens with configurable expiration
- CORS protection enabled
- Environment variables for sensitive data
- Service account keys excluded from git

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ⚡ by <strong>Kshitiz Gaur</strong>
</p>

<p align="center">
  <sub>Powered by Groq LLaMA 3.1 • React • FastAPI • MongoDB</sub>
</p>