"""
Upload Endpoint - Handle file uploads
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uuid
import os
import logging
from datetime import datetime

from app.core.config import settings
from app.models.schemas import UploadResponse
from app.services.text_processor import text_processor
from app.services.embedding_service import embedding_service

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for file metadata (in production, use a database)
file_storage = {}


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF or TXT file for processing
    
    - Validates file type and size
    - Extracts text content
    - Creates embeddings for semantic search
    - Returns file ID for subsequent operations
    """
    try:
        # Validate file extension
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        
        # Validate file size
        if file_size > settings.MAX_FILE_SIZE:
            max_mb = settings.MAX_FILE_SIZE / (1024 * 1024)
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {max_mb}MB"
            )
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        logger.info(f"Processing file: {file.filename} ({file_size} bytes)")
        
        # Extract text from file
        try:
            text_content = await text_processor.extract_text(file_content, file.filename)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to extract text from file: {str(e)}"
            )
        
        # Clean text
        text_content = text_processor.clean_text(text_content)
        
        if len(text_content) < 100:
            raise HTTPException(
                status_code=400,
                detail="File content too short. Please upload a meaningful document."
            )
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Save file to disk (optional)
        file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}.{file_extension}")
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        # Create text chunks for embeddings
        chunks = text_processor.chunk_text(
            text_content,
            chunk_size=settings.CHUNK_SIZE,
            overlap=settings.CHUNK_OVERLAP
        )
        
        # Create embeddings for semantic search
        try:
            await embedding_service.create_embeddings_for_chunks(file_id, chunks)
        except Exception as e:
            logger.warning(f"Failed to create embeddings: {str(e)}")
            # Continue anyway - embeddings are optional
        
        # Store file metadata
        file_storage[file_id] = {
            "filename": file.filename,
            "file_path": file_path,
            "text_content": text_content,
            "file_size": file_size,
            "upload_time": datetime.now().isoformat(),
            "chunks": chunks
        }
        
        # Get content preview
        preview = text_processor.get_preview(text_content, max_length=500)
        
        logger.info(f"✓ File uploaded successfully: {file_id}")
        
        return UploadResponse(
            success=True,
            message="File uploaded and processed successfully",
            file_id=file_id,
            filename=file.filename,
            file_size=file_size,
            content_preview=preview
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/files/{file_id}")
async def get_file_info(file_id: str):
    """Get information about an uploaded file"""
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_info = file_storage[file_id]
    
    return {
        "file_id": file_id,
        "filename": file_info["filename"],
        "file_size": file_info["file_size"],
        "upload_time": file_info["upload_time"],
        "content_preview": text_processor.get_preview(file_info["text_content"])
    }


@router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    """Delete an uploaded file and its data"""
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Remove from storage
    file_info = file_storage[file_id]
    
    # Delete file from disk
    if os.path.exists(file_info["file_path"]):
        os.remove(file_info["file_path"])
    
    # Clear embeddings cache
    embedding_service.clear_cache(file_id)
    
    # Remove from memory
    del file_storage[file_id]
    
    logger.info(f"File deleted: {file_id}")
    
    return {"success": True, "message": "File deleted successfully"}


def get_file_content(file_id: str) -> str:
    """Helper function to get file content by ID"""
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    return file_storage[file_id]["text_content"]


def get_file_chunks(file_id: str) -> list:
    """Helper function to get file chunks by ID"""
    if file_id not in file_storage:
        raise HTTPException(status_code=404, detail="File not found")
    return file_storage[file_id]["chunks"]
