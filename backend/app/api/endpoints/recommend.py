"""
Recommendation Endpoint - Book recommendations
"""

from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime

from app.models.schemas import (
    RecommendationRequest,
    RecommendationResponse,
    BookRecommendation
)
from app.services.ai_service import ai_service
from app.api.endpoints.upload import get_file_content

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized book recommendations
    
    - Based on user interests/genres
    - Optionally based on a previously uploaded book
    - Returns 5 curated recommendations with descriptions
    """
    try:
        logger.info(f"Recommendation request: {request.interests}")
        
        # Validate interests
        if not request.interests or len(request.interests.strip()) < 3:
            raise HTTPException(
                status_code=400,
                detail="Please provide more detailed interests (at least 3 characters)"
            )
        
        # Check if recommendation should be based on an uploaded book
        book_summary = None
        if request.based_on_file_id:
            try:
                # Get the book content
                text_content = get_file_content(request.based_on_file_id)
                
                # Create a quick summary for recommendation context
                # (using first portion of the book)
                book_summary = text_content[:2000]
                logger.info("Using uploaded book as recommendation base")
                
            except HTTPException:
                logger.warning(f"File {request.based_on_file_id} not found, using interests only")
            except Exception as e:
                logger.warning(f"Error loading file: {str(e)}, using interests only")
        
        # Generate recommendations using AI
        try:
            recommendations_data = await ai_service.generate_recommendations(
                interests=request.interests,
                book_summary=book_summary
            )
            
            if not recommendations_data:
                raise ValueError("No recommendations generated")
            
            # Convert to Pydantic models
            recommendations = []
            for rec in recommendations_data:
                try:
                    book_rec = BookRecommendation(
                        title=rec.get("title", "Unknown"),
                        author=rec.get("author", "Unknown"),
                        description=rec.get("description", "No description available"),
                        reason=rec.get("reason", "Matches your interests")
                    )
                    recommendations.append(book_rec)
                except Exception as e:
                    logger.warning(f"Skipping invalid recommendation: {str(e)}")
                    continue
            
            if not recommendations:
                raise ValueError("No valid recommendations generated")
        
        except Exception as e:
            logger.error(f"AI service error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate recommendations: {str(e)}"
            )
        
        logger.info(f"✓ Generated {len(recommendations)} recommendations")
        
        return RecommendationResponse(
            success=True,
            recommendations=recommendations,
            based_on_interests=request.interests,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {str(e)}"
        )


@router.get("/recommend/genres")
async def get_popular_genres():
    """
    Get a list of popular book genres for user reference
    """
    genres = [
        "Science Fiction",
        "Fantasy",
        "Mystery & Thriller",
        "Romance",
        "Historical Fiction",
        "Non-Fiction",
        "Biography & Memoir",
        "Self-Help & Personal Development",
        "Business & Economics",
        "Science & Technology",
        "Philosophy",
        "Psychology",
        "True Crime",
        "Horror",
        "Young Adult",
        "Literary Fiction",
        "Adventure",
        "Classics"
    ]
    
    return {
        "genres": genres,
        "message": "Use these as inspiration for your interests"
    }
