"""
AI Service - Handles all OpenAI API interactions
"""

import openai
import json
import logging
from typing import Dict, List, Optional
from app.core.config import settings
from app.core.prompts import prompts

logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY


class AIService:
    """Service for AI operations using OpenAI API"""
    
    def __init__(self):
        self.model = settings.OPENAI_MODEL
        self.temperature = settings.TEMPERATURE
        self.max_tokens = settings.MAX_TOKENS
    
    async def generate_summary(self, book_content: str) -> Dict[str, any]:
        """
        Generate a comprehensive summary of book content
        
        Args:
            book_content: The text content of the book
            
        Returns:
            Dictionary with 'summary' and 'key_points'
        """
        try:
            # Truncate content if too long
            truncated_content = prompts.truncate_text(
                book_content, 
                max_length=settings.MAX_CONTEXT_LENGTH
            )
            
            # Create prompt
            prompt = prompts.SUMMARIZE_BOOK.format(book_content=truncated_content)
            
            logger.info("Requesting summary from OpenAI...")
            
            # Call OpenAI API
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert book analyst. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            # Extract and parse response
            content = response.choices[0].message.content.strip()
            
            # Try to parse JSON response
            try:
                result = json.loads(content)
                return {
                    "summary": result.get("summary", ""),
                    "key_points": result.get("key_points", [])
                }
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                logger.warning("Failed to parse JSON response, using raw content")
                return {
                    "summary": content,
                    "key_points": ["Summary generated but key points extraction failed"]
                }
            
        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            raise Exception(f"Failed to generate summary: {str(e)}")
    
    async def chat_with_book(
        self,
        question: str,
        context: str,
        chat_history: Optional[List[Dict]] = None
    ) -> str:
        """
        Answer questions about the book using context
        
        Args:
            question: User's question
            context: Relevant text from the book
            chat_history: Previous conversation messages
            
        Returns:
            AI-generated answer
        """
        try:
            # Format chat history
            history_text = prompts.format_chat_history(chat_history or [])
            
            # Truncate context if needed
            truncated_context = prompts.truncate_text(context, max_length=3000)
            
            # Create prompt
            prompt = prompts.CHAT_WITH_BOOK.format(
                context=truncated_context,
                chat_history=history_text,
                question=question
            )
            
            logger.info(f"Processing chat question: {question[:50]}...")
            
            # Call OpenAI API
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that answers questions about books accurately and concisely."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            answer = response.choices[0].message.content.strip()
            logger.info("Chat response generated successfully")
            
            return answer
            
        except Exception as e:
            logger.error(f"Error in chat: {str(e)}")
            raise Exception(f"Failed to process chat: {str(e)}")
    
    async def generate_recommendations(
        self,
        interests: str,
        book_summary: Optional[str] = None
    ) -> List[Dict[str, str]]:
        """
        Generate book recommendations based on interests
        
        Args:
            interests: User's interests or preferences
            book_summary: Optional summary of a book for similar recommendations
            
        Returns:
            List of book recommendations
        """
        try:
            # Choose appropriate prompt
            if book_summary:
                prompt = prompts.SIMILAR_BOOKS.format(summary=book_summary)
            else:
                context = "Consider popular and critically acclaimed books."
                prompt = prompts.RECOMMEND_BOOKS.format(
                    interests=interests,
                    context=context
                )
            
            logger.info("Generating book recommendations...")
            
            # Call OpenAI API
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert librarian. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.8,  # Higher temp for more creative recommendations
                max_tokens=1500
            )
            
            content = response.choices[0].message.content.strip()
            
            # Parse JSON response
            try:
                result = json.loads(content)
                recommendations = result.get("recommendations", [])
                logger.info(f"Generated {len(recommendations)} recommendations")
                return recommendations
            except json.JSONDecodeError:
                logger.warning("Failed to parse recommendations JSON")
                # Return a fallback structure
                return [{
                    "title": "Error parsing recommendations",
                    "author": "System",
                    "description": content[:200],
                    "reason": "Please try again"
                }]
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise Exception(f"Failed to generate recommendations: {str(e)}")
    
    async def get_embeddings(self, text: str) -> List[float]:
        """
        Generate embeddings for text using OpenAI
        
        Args:
            text: Text to embed
            
        Returns:
            List of embedding values
        """
        try:
            response = openai.embeddings.create(
                model=settings.EMBEDDING_MODEL,
                input=text[:8000]  # Limit input length
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise Exception(f"Failed to generate embeddings: {str(e)}")


# Global AI service instance
ai_service = AIService()
