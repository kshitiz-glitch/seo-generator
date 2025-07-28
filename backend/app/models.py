from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from bson import ObjectId
from pydantic_core import core_schema
from pydantic import GetCoreSchemaHandler
import typing


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: typing.Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.str_schema()


class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: EmailStr
    hashed_password: str

    @classmethod
    def from_mongo(cls, doc: dict) -> "UserModel":
        return cls(
            id=str(doc["_id"]),
            email=doc["email"],
            hashed_password=doc.get("password", "")  # assumes Mongo field is "password"
        )

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class SEOJobModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: Optional[str] = None
    title: str
    meta_description: str
    pdf_url: str
    docx_url: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
