/**
 * API Service - Handles all backend communication
 * Uses Axios for HTTP requests to FastAPI backend
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * Upload a PDF or TXT file
 */
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

/**
 * Generate summary for an uploaded file
 */
export const summarizeBook = async (fileId) => {
  const response = await api.post('/api/summarize', { file_id: fileId })
  return response.data
}

/**
 * Chat with a book
 */
export const chatWithBook = async (fileId, message, chatHistory = []) => {
  const response = await api.post('/api/chat', {
    file_id: fileId,
    message: message,
    chat_history: chatHistory,
  })
  return response.data
}

/**
 * Get book recommendations
 */
export const getRecommendations = async (interests, basedOnFileId = null) => {
  const response = await api.post('/api/recommend', {
    interests: interests,
    based_on_file_id: basedOnFileId,
  })
  return response.data
}

/**
 * Get popular genres
 */
export const getGenres = async () => {
  const response = await api.get('/api/recommend/genres')
  return response.data
}

/**
 * Get file information
 */
export const getFileInfo = async (fileId) => {
  const response = await api.get(`/api/files/${fileId}`)
  return response.data
}

/**
 * Delete a file
 */
export const deleteFile = async (fileId) => {
  const response = await api.delete(`/api/files/${fileId}`)
  return response.data
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

export default api
