# 📚 BookMind AI: Generative AI-Based Book Assistant

A modern, production-ready web application that leverages AI to help users interact with their books through intelligent summarization, Q&A, and personalized recommendations.

![BookMind AI](https://img.shields.io/badge/AI-Powered-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688)
![Python](https://img.shields.io/badge/Python-3.9+-3776ab)

## 🌟 Features

- **📤 Smart Upload**: Upload PDF or text files
- **📝 AI Summarization**: Get concise summaries with key bullet points
- **💬 Interactive Chat**: Ask questions and chat with your uploaded books
- **🎯 Personalized Recommendations**: Get book suggestions based on your interests
- **🌓 Dark/Light Mode**: Toggle between themes for comfortable reading
- **📱 Responsive Design**: Works seamlessly on mobile and desktop

## 🏗️ Architecture

```
BookMind AI
├── backend/          # FastAPI server with AI integration
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── core/     # Configuration & settings
│   │   ├── models/   # Data models
│   │   ├── services/ # Business logic & AI services
│   │   └── utils/    # Helper functions
│   └── uploads/      # Temporary file storage
│
└── frontend/         # React + Vite + Tailwind UI
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── services/    # API integration
    │   ├── hooks/       # Custom React hooks
    │   └── utils/       # Helper functions
    └── public/          # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.9+
- **OpenAI API Key** (or any compatible LLM API)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
OPENAI_API_KEY=your_api_key_here
ENVIRONMENT=development
DEBUG=True
```

5. Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

## 📁 Project Structure Details

### Backend (`/backend`)

- **`app/api/endpoints/`**: REST API route handlers
  - `upload.py`: File upload handling
  - `summarize.py`: Book summarization
  - `chat.py`: Q&A chat functionality
  - `recommend.py`: Book recommendations

- **`app/services/`**: Core business logic
  - `ai_service.py`: LLM integration (OpenAI)
  - `embedding_service.py`: Vector embeddings for retrieval
  - `text_processor.py`: Text extraction & processing

- **`app/core/`**: Configuration
  - `config.py`: Environment settings
  - `prompts.py`: AI prompt templates

### Frontend (`/frontend`)

- **`src/components/`**: Reusable UI components
  - `Layout/`: App layout with header/sidebar
  - `Upload/`: File upload component
  - `Summary/`: Summary display
  - `Chat/`: Chat interface
  - `Recommend/`: Recommendation cards

- **`src/pages/`**: Main application pages
  - `Dashboard.jsx`: Homepage
  - `BookViewer.jsx`: Book interaction page

- **`src/services/`**: API communication
  - `api.js`: Axios setup & API calls

## 🎨 UI/UX Design

- **Color Palette**: Blue-purple gradient theme
- **Typography**: Clean, modern fonts (Inter/System UI)
- **Components**: Soft shadows, rounded corners
- **Layout**: Spacious with proper whitespace
- **Interactions**: Smooth hover effects and transitions

## 🤖 AI Integration

### LLM Features:
- **Summarization**: Extracts key insights and main themes
- **Q&A System**: Context-aware question answering
- **Recommendations**: Interest-based book suggestions

### Embedding Strategy:
- Text chunking for large documents
- Semantic search for relevant context
- Efficient retrieval for chat functionality

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints:

```
POST   /api/upload       - Upload book file
POST   /api/summarize    - Generate book summary
POST   /api/chat         - Chat with book
POST   /api/recommend    - Get recommendations
GET    /api/health       - Health check
```

## 🔧 Configuration

### Backend Environment Variables:
```env
OPENAI_API_KEY=sk-...
ENVIRONMENT=development|production
DEBUG=True|False
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=pdf,txt
```

### Frontend Environment Variables:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🧪 Testing

### Backend:
```bash
cd backend
pytest tests/ -v
```

### Frontend:
```bash
cd frontend
npm run test
```

## 📦 Production Deployment

### Backend:
```bash
# Use production ASGI server
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend:
```bash
# Build for production
npm run build

# Serve with nginx or any static host
```

## 🛡️ Security Features

- CORS protection
- File type validation
- File size limits
- Input sanitization
- API rate limiting (recommended for production)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- OpenAI for GPT models
- FastAPI for the amazing backend framework
- React team for the frontend library
- Tailwind CSS for styling utilities

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for book lovers and AI enthusiasts**
