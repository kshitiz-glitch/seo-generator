from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from ..models import UserModel, SEOJobModel
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)
db = client["seo_generator_db"]  # Database name

users_collection = db["users"]
jobs_collection = db["jobs"]

# ---------- USER OPERATIONS ----------

async def get_user_by_email(email: str):
    return await users_collection.find_one({"email": email})

async def create_user(user: UserModel):
    user_dict = user.dict()
    await users_collection.insert_one(user_dict)
    return user_dict

# ---------- SEO JOB OPERATIONS ----------

async def save_seo_job(job: SEOJobModel):
    job_dict = job.dict(by_alias=True)
    result = await jobs_collection.insert_one(job_dict)
    return str(result.inserted_id)

async def get_jobs_by_user(user_id: str):
    jobs_cursor = jobs_collection.find({"user_id": user_id})
    jobs = []
    async for job in jobs_cursor:
        job["_id"] = str(job["_id"])
        jobs.append(job)
    return jobs
