# backend/app/routes/history.py

from fastapi import APIRouter, Depends
from app.auth import get_current_user
from app.models import UserModel
from app.db.mongo import db
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class SEOJobOut(BaseModel):
    id: str
    title: str
    meta_description: str
    pdf_url: str
    docx_url: str
    created_at: datetime

@router.get("/history", response_model=List[SEOJobOut])
async def get_user_history(current_user: UserModel = Depends(get_current_user)):
    
    seo_jobs = db["seo_jobs"]
    # ✅ Use email for matching
    cursor = seo_jobs.find({"email": current_user.email}).sort("created_at", -1)



    results = []
    async for doc in cursor:
        
        results.append(SEOJobOut(
            id=str(doc.get("_id", "")),
            title=doc.get("title", ""),
            meta_description=doc.get("meta_description", ""),
            pdf_url=doc.get("pdf_url", ""),
            docx_url=doc.get("docx_url", ""),
            created_at=doc.get("created_at")
        ))
    
    return results
