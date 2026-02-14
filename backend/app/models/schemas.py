"""
Pydantic Models for Request/Response Schemas
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# Upload Models
class UploadResponse(BaseModel):
    """Response after successful file upload"""
    success: bool
    message: str
    file_id: str
    filename: str
    file_size: int
    content_preview: str


# Summarization Models
class SummarizeRequest(BaseModel):
    """Request to summarize a book"""
    file_id: str = Field(..., description="ID of the uploaded file")


class SummarizeResponse(BaseModel):
    """Response containing book summary"""
    success: bool
    summary: str
    key_points: List[str]
    file_id: str
    timestamp: str


# Chat Models
class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request to chat with a book"""
    file_id: str = Field(..., description="ID of the uploaded file")
    message: str = Field(..., description="User's question or message")
    chat_history: Optional[List[ChatMessage]] = Field(
        default=[],
        description="Previous conversation history"
    )


class ChatResponse(BaseModel):
    """Response from chat endpoint"""
    success: bool
    response: str
    file_id: str
    timestamp: str


# Recommendation Models
class RecommendationRequest(BaseModel):
    """Request for book recommendations"""
    interests: str = Field(
        ...,
        description="User's interests or genres",
        example="Science fiction, space exploration, AI"
    )
    based_on_file_id: Optional[str] = Field(
        None,
        description="Optional: Get recommendations based on uploaded book"
    )


class BookRecommendation(BaseModel):
    """Single book recommendation"""
    title: str
    author: str
    description: str
    reason: str


class RecommendationResponse(BaseModel):
    """Response containing book recommendations"""
    success: bool
    recommendations: List[BookRecommendation]
    based_on_interests: str
    timestamp: str


# Error Response Model
class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    detail: Optional[str] = None


# Health Check Model
class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    environment: str
    version: Optional[str] = None
