# backend/app/main.py

import os
import uuid
import re
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from app.utils.file_generator import generate_pdf, generate_docx
from app.auth import get_current_user
from app.models import UserModel
from app.db.mongo import db
from app.auth import router as auth_router
from app.routes import history as history_routes
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from jose import jwt, JWTError
from fastapi import Request
from openai import APIConnectionError, APIStatusError, RateLimitError

# Load environment
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
# ✅ Debug: Confirm if the GROQ_API_KEY is loaded
# top of file (optional but recommended)
MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

print("🔑 Loaded GROQ_API_KEY =", os.getenv("GROQ_API_KEY"))
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

app = FastAPI()

# Health check / root route
@app.get("/")
async def root():
    return {"status": "ok", "message": "SEO Generator API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# CORS Configuration - Allow frontend origins
# Set CORS_ORIGINS env var to your frontend URL in production (e.g., https://your-app.vercel.app)
# Use * for development or comma-separated URLs for multiple origins
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
if cors_origins == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class GenerateResponse(BaseModel):
    jobId: str

class StatusResponse(BaseModel):
    status: str
    title: str | None = None
    meta_description: str | None = None
    pdf_url: str | None = None
    docx_url: str | None = None
    error_message: str | None = None

# In-memory store (stub)
JOB_STORAGE = {}

@app.post("/api/v1/generate-seo", response_model=GenerateResponse)
async def generate_seo(
    request: Request,
    url: str | None = Form(None),
    file: UploadFile | None = File(None),
    language: str = Form(...),
    tone: str = Form(...),
    length: int = Form(...),
    
    
):
    print("🔥 Endpoint /generate-seo hit")
    job_id = str(uuid.uuid4())
    user = None
    try:
        token = request.headers.get("authorization")
        if token and token.startswith("Bearer "):
            payload = jwt.decode(token[7:], os.getenv("JWT_SECRET", "secret-key"), algorithms=["HS256"])
            user = payload.get("sub")
    except JWTError:
        pass  # Invalid or missing token = anonymous

    print(f"🚀 New job: {job_id} by: {user or 'Anonymous'}")
    

    # Step A: Extract content
    try:
        if url:
            from newspaper import Article
            headers = {"User-Agent": "Mozilla/5.0"}
            r = requests.get(url, headers=headers, timeout=10)
            r.raise_for_status()
            article = Article(url)
            article.set_html(r.text)
            article.parse()
            content = article.text
        elif file:
            from pdfminer.high_level import extract_text as extract_pdf_text
            import docx
            raw = await file.read()
            if file.content_type == "application/pdf":
                with open("tmp.pdf", "wb") as f:
                    f.write(raw)
                content = extract_pdf_text("tmp.pdf")
            elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                with open("tmp.docx", "wb") as f:
                    f.write(raw)
                doc = docx.Document("tmp.docx")
                content = "\n".join(p.text for p in doc.paragraphs)
            else:
                raise HTTPException(400, "Unsupported file type")
        else:
            raise HTTPException(400, "Provide either a file or URL")
    except Exception as e:
        JOB_STORAGE[job_id] = {"status": "error", "error_message": str(e)}
        raise HTTPException(500, f"Extraction failed: {e}")

    # Step B: Truncate content
    content = content[:3000]

    # Step C: Prompt
    prompt = (
        f"You are an SEO assistant that generates SEO titles and meta descriptions.\n"
        f"Your task is to read the following content (in any language) and write:\n"
        f"- A compelling SEO title\n"
        f"- A meta description\n\n"
        f"The output must be in **{language.upper()}**, even if the input is in English.\n\n"
        "Respond ONLY in the following JSON format:\n"
        '{\n  "title": "...",\n  "meta_description": "..." \n}\n\n'
        f"Tone: {tone}\n"
        f"Max title length: {length} characters\n\n"
        f"Text:\n{content}"
    )
    print("🌍 Language received:", language)


    # Step D: Call Groq
    try:
        print("🧠 Calling Groq...")
        chat_resp = client.chat.completions.create(
            # 👇 try the exact model that works for your key.
            # If `llama3-8b-8192` is flaky, try one of:
            # "llama3-70b-8192", "llama-3.1-8b-instant", or whatever worked last time.
            model=MODEL,
            messages=[
                {"role": "system", "content": "You generate SEO-optimized metadata."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=length + 100,
        )
        model_reply = chat_resp.choices[0].message.content

    except RateLimitError as e:
        err_msg = getattr(e, 'message', str(e))
        print("=" * 60)
        print("❌ GROQ API RATE LIMIT ERROR")
        print("=" * 60)
        print(f"⚠️  Your Groq API key has hit the rate limit!")
        print(f"📋 Error details: {err_msg}")
        print("💡 Solutions:")
        print("   1. Wait a few minutes and try again")
        print("   2. Upgrade your Groq plan for higher limits")
        print("   3. Use a different API key")
        print("=" * 60)
        JOB_STORAGE[job_id] = {"status": "error", "error_message": "API rate limit reached. Please try again later."}
        raise HTTPException(status_code=429, detail="API rate limit reached. Please try again in a few minutes.")

    except APIStatusError as e:
        body_text = None
        try:
            body_text = e.response.text
        except Exception:
            pass
        
        print("=" * 60)
        print("❌ GROQ API STATUS ERROR")
        print("=" * 60)
        print(f"🔴 Status Code: {e.status_code}")
        print(f"📋 Response: {body_text or str(e)}")
        
        # Check for common error types
        if e.status_code == 401:
            print("⚠️  INVALID API KEY - Your Groq API key is invalid or expired!")
            print("💡 Solution: Check your GROQ_API_KEY in environment variables")
            error_detail = "Invalid API key. Please check your Groq API key."
        elif e.status_code == 403:
            print("⚠️  ACCESS DENIED - Your API key doesn't have access to this model")
            print("💡 Solution: Verify your Groq account has access to the model")
            error_detail = "API access denied. Please verify your API key permissions."
        elif e.status_code == 429:
            print("⚠️  QUOTA EXCEEDED - You've exceeded your API quota!")
            print("💡 Solutions:")
            print("   1. Wait for quota reset (usually daily)")
            print("   2. Upgrade your Groq plan")
            error_detail = "API quota exceeded. Please try again later."
        else:
            error_detail = f"API error ({e.status_code}). Please try again."
        
        print("=" * 60)
        JOB_STORAGE[job_id] = {"status": "error", "error_message": error_detail}
        raise HTTPException(status_code=502, detail=error_detail)

    except APIConnectionError as e:
        print("=" * 60)
        print("❌ GROQ API CONNECTION ERROR")
        print("=" * 60)
        print(f"🔴 Cannot connect to Groq API!")
        print(f"📋 Error: {str(e)}")
        print("💡 Solutions:")
        print("   1. Check your internet connection")
        print("   2. Verify Groq API is not down (status.groq.com)")
        print("=" * 60)
        JOB_STORAGE[job_id] = {"status": "error", "error_message": "Cannot connect to AI service. Please try again."}
        raise HTTPException(status_code=502, detail="Cannot connect to AI service. Please try again.")

    except Exception as e:
        print("=" * 60)
        print("❌ GROQ UNEXPECTED ERROR")
        print("=" * 60)
        print(f"🔴 Unexpected error: {repr(e)}")
        print("💡 This may be a temporary issue. Try again.")
        print("=" * 60)
        JOB_STORAGE[job_id] = {"status": "error", "error_message": "Unexpected AI error. Please try again."}
        raise HTTPException(status_code=502, detail="Unexpected AI error. Please try again.")

    # Step E: Parse JSON
    try:
        match = re.search(r"\{.*\}", model_reply, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON in response")
        seo = json.loads(match.group(0))
        title = seo.get("title")
        meta = seo.get("meta_description")
    except Exception as e:
        JOB_STORAGE[job_id] = {"status": "error", "error_message": f"JSON error: {e}"}
        raise HTTPException(500, f"JSON parse error: {e}")

    # Step F: Generate Files
    try:
        output_dir = Path("downloads")
        output_dir.mkdir(exist_ok=True)
        pdf_path = output_dir / f"{job_id}.pdf"
        docx_path = output_dir / f"{job_id}.docx"

        generate_pdf(title, meta, pdf_path)
        generate_docx(title, meta, docx_path)

        # Save to MongoDB
        if user:
            seo_jobs = db["seo_jobs"]
            await seo_jobs.insert_one({
            "user_id": user,
            "email": user,
            "title": title,
            "meta_description": meta,
            "pdf_url": f"http://localhost:8000/downloads/{pdf_path.name}",
            "docx_url": f"http://localhost:8000/downloads/{docx_path.name}",
            "created_at": datetime.utcnow()
        })

        JOB_STORAGE[job_id] = {
            "status": "completed",
            "title": title,
            "meta_description": meta,
            "pdf_url": f"http://localhost:8000/downloads/{pdf_path.name}",
            "docx_url": f"http://localhost:8000/downloads/{docx_path.name}",
        }

        

    except Exception as e:
        JOB_STORAGE[job_id] = {"status": "error", "error_message": f"File generation failed: {e}"}
        raise HTTPException(500, f"File generation failed: {e}")

    return GenerateResponse(jobId=job_id)

@app.get("/api/v1/status/{job_id}", response_model=StatusResponse)
async def get_status(job_id: str):
    job = JOB_STORAGE.get(job_id)
    if not job:
        raise HTTPException(404, "Job ID not found")
    return job

# Mount static file download route
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

# DB test route
@app.get("/ping-db")
async def ping_db():
    collections = await db.list_collection_names()
    return {"collections": collections}

# Routes
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(history_routes.router, prefix="/api/v1", tags=["History"])


# uvicorn app.main:app --reload 