"""
Chat Endpoint - Interactive Q&A with books
"""

from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime

from app.models.schemas import ChatRequest, ChatResponse
from app.services.ai_service import ai_service
from app.services.embedding_service import embedding_service
from app.api.endpoints.upload import get_file_content

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_book(request: ChatRequest):
    """
    Chat with an uploaded book - Ask questions and get answers
    
    - Uses semantic search to find relevant passages
    - Maintains conversation history for context
    - Provides accurate answers based on book content
    """
    try:
        logger.info(f"Chat request for file: {request.file_id}")
        
        # Validate message
        if not request.message or len(request.message.strip()) < 3:
            raise HTTPException(
                status_code=400,
                detail="Message is too short. Please ask a meaningful question."
            )
        
        # Get file content
        try:
            text_content = get_file_content(request.file_id)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Find relevant chunks using semantic search
        try:
            relevant_chunks = await embedding_service.find_relevant_chunks(
                file_id=request.file_id,
                query=request.message,
                top_k=3
            )
            
            # Combine relevant chunks as context
            if relevant_chunks:
                context = "\n\n".join(relevant_chunks)
            else:
                # Fallback: use beginning of document
                context = text_content[:3000]
                logger.warning("No relevant chunks found, using document start")
        
        except Exception as e:
            logger.warning(f"Semantic search failed: {str(e)}, using full content")
            context = text_content[:3000]
        
        # Convert chat history to dict format if needed
        chat_history = []
        if request.chat_history:
            chat_history = [
                {"role": msg.role, "content": msg.content}
                for msg in request.chat_history
            ]
        
        # Generate response using AI
        try:
            response_text = await ai_service.chat_with_book(
                question=request.message,
                context=context,
                chat_history=chat_history
            )
            
            if not response_text:
                raise ValueError("Empty response from AI")
        
        except Exception as e:
            logger.error(f"AI service error: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate response: {str(e)}"
            )
        
        logger.info(f"✓ Chat response generated for {request.file_id}")
        
        return ChatResponse(
            success=True,
            response=response_text,
            file_id=request.file_id,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {str(e)}"
        )


@router.post("/chat/start/{file_id}")
async def start_chat_session(file_id: str):
    """
    Start a new chat session with a book
    Returns a welcome message
    """
    try:
        # Verify file exists
        get_file_content(file_id)
        
        welcome_message = (
            "Hello! I'm ready to answer questions about this book. "
            "You can ask me about:\n"
            "- Main themes and ideas\n"
            "- Specific topics or chapters\n"
            "- Character details or plot points\n"
            "- Key concepts and arguments\n\n"
            "What would you like to know?"
        )
        
        return {
            "success": True,
            "message": welcome_message,
            "file_id": file_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
