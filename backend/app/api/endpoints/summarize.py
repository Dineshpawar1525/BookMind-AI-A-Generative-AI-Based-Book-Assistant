"""
Summarization Endpoint - Generate book summaries
"""

from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime

from app.models.schemas import SummarizeRequest, SummarizeResponse
from app.services.ai_service import ai_service
from app.api.endpoints.upload import get_file_content

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_book(request: SummarizeRequest):
    """
    Generate a comprehensive summary of an uploaded book
    
    - Takes a file_id from a previously uploaded file
    - Uses AI to generate a concise summary
    - Extracts key bullet points
    - Returns structured summary data
    """
    try:
        logger.info(f"Summarization requested for file: {request.file_id}")
        
        # Get file content
        try:
            text_content = get_file_content(request.file_id)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Validate content
        if not text_content or len(text_content) < 100:
            raise HTTPException(
                status_code=400,
                detail="File content is too short to summarize"
            )
        
        # Generate summary using AI
        try:
            result = await ai_service.generate_summary(text_content)
            
            summary = result.get("summary", "")
            key_points = result.get("key_points", [])
            
            if not summary:
                raise ValueError("Empty summary generated")
            
        except Exception as e:
            logger.error(f"AI service error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate summary: {str(e)}"
            )
        
        logger.info(f"✓ Summary generated successfully for {request.file_id}")
        
        return SummarizeResponse(
            success=True,
            summary=summary,
            key_points=key_points,
            file_id=request.file_id,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Summarization failed: {str(e)}"
        )
