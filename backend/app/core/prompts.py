"""
AI Prompt Templates
Contains all prompt templates used for various AI tasks
"""


class PromptTemplates:
    """Collection of AI prompt templates"""
    
    # Summarization Prompts
    SUMMARIZE_BOOK = """You are an expert book analyst. Analyze the following book content and provide a comprehensive summary.

Book Content:
{book_content}

Please provide:
1. A concise 2-3 paragraph summary capturing the main themes and ideas
2. 5-7 key bullet points highlighting the most important takeaways

Format your response as JSON:
{{
  "summary": "Your 2-3 paragraph summary here",
  "key_points": [
    "Key point 1",
    "Key point 2",
    ...
  ]
}}

Be concise, clear, and focus on the most important insights."""

    # Short Summary (for previews)
    QUICK_SUMMARY = """Provide a brief 1-2 sentence summary of the following text:

{text}

Summary:"""

    # Chat/Q&A Prompts
    CHAT_WITH_BOOK = """You are a helpful AI assistant that answers questions about a book. 
Use the following context from the book to answer the user's question. If the answer cannot be found in the context, say so politely.

Book Context:
{context}

Conversation History:
{chat_history}

User Question: {question}

Provide a clear, accurate answer based on the book content. If relevant, quote specific passages."""

    # First message in chat
    CHAT_WELCOME = """You are a helpful AI assistant for the book "{book_title}". 
Greet the user and let them know you can answer questions about the book."""

    # Recommendation Prompts
    RECOMMEND_BOOKS = """You are an expert librarian and book recommendation specialist.

Based on the user's interests and preferences, recommend 5 books that would be perfect for them.

User Interests: {interests}

{context}

For each book, provide:
1. Title
2. Author
3. Brief description (2-3 sentences)
4. Why it matches their interests

Format as JSON:
{{
  "recommendations": [
    {{
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description of the book",
      "reason": "Why this book matches user interests"
    }},
    ...
  ]
}}"""

    # Book-based Recommendations
    SIMILAR_BOOKS = """Based on the following book summary, recommend 5 similar books:

Book Summary:
{summary}

Provide diverse recommendations that share themes, style, or topics with this book.

Format as JSON:
{{
  "recommendations": [
    {{
      "title": "Book Title",
      "author": "Author Name",
      "description": "Brief description",
      "reason": "Why it's similar"
    }},
    ...
  ]
}}"""

    # Text Extraction/Processing
    EXTRACT_KEY_INFO = """Extract key information from this text:

{text}

Provide:
- Main topic/theme
- Key concepts (up to 5)
- Target audience
- Writing style (academic, casual, technical, etc.)

Format as JSON."""

    # Content Validation
    VALIDATE_CONTENT = """Analyze if the following text appears to be from a book or meaningful document:

{text}

Return "valid" if it's book content, or "invalid" with a reason if not."""

    @staticmethod
    def format_chat_history(history: list) -> str:
        """Format chat history for prompt inclusion"""
        if not history:
            return "No previous conversation."
        
        formatted = []
        for msg in history[-5:]:  # Last 5 messages
            role = msg.get("role", "user")
            content = msg.get("content", "")
            formatted.append(f"{role.title()}: {content}")
        
        return "\n".join(formatted)

    @staticmethod
    def truncate_text(text: str, max_length: int = 4000) -> str:
        """Truncate text to fit within token limits"""
        if len(text) <= max_length:
            return text
        
        return text[:max_length] + "\n\n[Content truncated due to length...]"


# Instantiate for easy import
prompts = PromptTemplates()
