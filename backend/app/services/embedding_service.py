"""
Embedding Service - Handles vector embeddings and semantic search
"""

import math
from typing import List, Dict, Tuple
import logging
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for managing embeddings and semantic search"""
    
    def __init__(self):
        self.embeddings_cache = {}  # Simple in-memory cache
        self.chunks_cache = {}      # Store chunks with their embeddings
    
    async def create_embeddings_for_chunks(
        self, 
        file_id: str, 
        chunks: List[str]
    ) -> None:
        """
        Create and store embeddings for text chunks
        
        Args:
            file_id: Unique identifier for the file
            chunks: List of text chunks
        """
        try:
            logger.info(f"Creating embeddings for {len(chunks)} chunks...")
            
            embeddings = []
            
            for i, chunk in enumerate(chunks):
                if not chunk.strip():
                    continue
                
                # Get embedding for chunk
                embedding = await ai_service.get_embeddings(chunk)
                embeddings.append(embedding)
                
                if (i + 1) % 10 == 0:
                    logger.info(f"Processed {i + 1}/{len(chunks)} chunks")
            
            # Store in cache
            self.embeddings_cache[file_id] = embeddings
            self.chunks_cache[file_id] = chunks
            
            logger.info(f"Successfully created embeddings for file {file_id}")
            
        except Exception as e:
            logger.error(f"Error creating embeddings: {str(e)}")
            raise Exception(f"Failed to create embeddings: {str(e)}")
    
    async def find_relevant_chunks(
        self,
        file_id: str,
        query: str,
        top_k: int = 3
    ) -> List[str]:
        """
        Find most relevant chunks for a query using semantic search
        
        Args:
            file_id: File identifier
            query: Search query
            top_k: Number of top chunks to return
            
        Returns:
            List of most relevant text chunks
        """
        try:
            # Check if embeddings exist
            if file_id not in self.embeddings_cache:
                logger.warning(f"No embeddings found for file {file_id}")
                return []
            
            # Get query embedding
            query_embedding = await ai_service.get_embeddings(query)
            
            # Get stored embeddings
            doc_embeddings = self.embeddings_cache[file_id]
            chunks = self.chunks_cache[file_id]
            
            # Calculate cosine similarity for all documents
            similarities = []
            for doc_embedding in doc_embeddings:
                sim = self._cosine_similarity(query_embedding, doc_embedding)
                similarities.append(sim)
            
            # Get top k indices
            indexed_sims = list(enumerate(similarities))
            indexed_sims.sort(key=lambda x: x[1], reverse=True)
            top_indices = [idx for idx, sim in indexed_sims[:top_k]]
            
            # Return top chunks
            relevant_chunks = [chunks[i] for i in top_indices if i < len(chunks)]
            
            logger.info(f"Found {len(relevant_chunks)} relevant chunks")
            return relevant_chunks
            
        except Exception as e:
            logger.error(f"Error finding relevant chunks: {str(e)}")
            # Fallback: return first few chunks
            if file_id in self.chunks_cache:
                return self.chunks_cache[file_id][:top_k]
            return []
    
    @staticmethod
    def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """
        Calculate cosine similarity between two vectors
        
        Args:
            vec1: First embedding vector
            vec2: Second embedding vector
            
        Returns:
            Similarity score between -1 and 1
        """
        # Calculate dot product
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        
        # Calculate magnitudes
        magnitude1 = math.sqrt(sum(a * a for a in vec1))
        magnitude2 = math.sqrt(sum(b * b for b in vec2))
        
        # Calculate cosine similarity
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def clear_cache(self, file_id: str) -> None:
        """
        Clear embeddings cache for a specific file
        
        Args:
            file_id: File identifier
        """
        if file_id in self.embeddings_cache:
            del self.embeddings_cache[file_id]
        if file_id in self.chunks_cache:
            del self.chunks_cache[file_id]
        
        logger.info(f"Cleared cache for file {file_id}")
    
    def get_cache_info(self) -> Dict:
        """Get information about cached embeddings"""
        return {
            "cached_files": list(self.embeddings_cache.keys()),
            "total_files": len(self.embeddings_cache)
        }


# Global embedding service instance
embedding_service = EmbeddingService()
