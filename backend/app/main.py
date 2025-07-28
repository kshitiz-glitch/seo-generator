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

# Load environment
load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": "You generate SEO-optimized metadata."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=length + 100,
        )
        model_reply = chat_resp.choices[0].message.content
    except Exception as e:
        JOB_STORAGE[job_id] = {"status": "error", "error_message": str(e)}
        raise HTTPException(502, f"Groq error: {e}")

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