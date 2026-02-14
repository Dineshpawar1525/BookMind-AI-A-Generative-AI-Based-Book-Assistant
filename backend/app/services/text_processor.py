"""
Text Processing Service - Handles text extraction from files
"""

import logging
from typing import Optional
import PyPDF2
import io

logger = logging.getLogger(__name__)


class TextProcessor:
    """Service for extracting and processing text from various file formats"""
    
    @staticmethod
    async def extract_text_from_pdf(file_content: bytes) -> str:
        """
        Extract text from PDF file
        
        Args:
            file_content: Raw PDF file bytes
            
        Returns:
            Extracted text from PDF
        """
        try:
            # Create a PDF reader object
            pdf_file = io.BytesIO(file_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Extract text from all pages
            text_content = []
            total_pages = len(pdf_reader.pages)
            
            logger.info(f"Extracting text from {total_pages} pages...")
            
            for page_num in range(total_pages):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                if text.strip():
                    text_content.append(text)
            
            full_text = "\n\n".join(text_content)
            
            if not full_text.strip():
                raise ValueError("No text could be extracted from the PDF")
            
            logger.info(f"Successfully extracted {len(full_text)} characters")
            return full_text
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    @staticmethod
    async def extract_text_from_txt(file_content: bytes) -> str:
        """
        Extract text from TXT file
        
        Args:
            file_content: Raw text file bytes
            
        Returns:
            Decoded text content
        """
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            
            for encoding in encodings:
                try:
                    text = file_content.decode(encoding)
                    logger.info(f"Successfully decoded with {encoding}")
                    return text
                except UnicodeDecodeError:
                    continue
            
            # If all encodings fail
            raise ValueError("Could not decode text file with any common encoding")
            
        except Exception as e:
            logger.error(f"Error extracting text from TXT: {str(e)}")
            raise Exception(f"Failed to extract text from TXT: {str(e)}")
    
    @staticmethod
    async def extract_text(file_content: bytes, filename: str) -> str:
        """
        Extract text from file based on extension
        
        Args:
            file_content: Raw file bytes
            filename: Original filename with extension
            
        Returns:
            Extracted text
        """
        file_extension = filename.lower().split('.')[-1]
        
        if file_extension == 'pdf':
            return await TextProcessor.extract_text_from_pdf(file_content)
        elif file_extension == 'txt':
            return await TextProcessor.extract_text_from_txt(file_content)
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
    
    @staticmethod
    def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list:
        """
        Split text into overlapping chunks for processing
        
        Args:
            text: Text to chunk
            chunk_size: Size of each chunk in characters
            overlap: Number of overlapping characters between chunks
            
        Returns:
            List of text chunks
        """
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start = end - overlap
        
        logger.info(f"Created {len(chunks)} chunks from text")
        return chunks
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and normalize text
        
        Args:
            text: Raw text
            
        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Remove non-printable characters
        text = ''.join(char for char in text if char.isprintable() or char in '\n\t')
        
        return text.strip()
    
    @staticmethod
    def get_preview(text: str, max_length: int = 500) -> str:
        """
        Get a preview of the text
        
        Args:
            text: Full text
            max_length: Maximum preview length
            
        Returns:
            Text preview
        """
        if len(text) <= max_length:
            return text
        
        return text[:max_length] + "..."


# Global text processor instance
text_processor = TextProcessor()
