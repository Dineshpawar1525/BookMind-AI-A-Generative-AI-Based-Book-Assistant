/**
 * FileUpload Component
 * Handles file upload with drag-and-drop support
 */

import { useState, useRef } from 'react'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { uploadFile } from '../../services/api'

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'text/plain']
    if (!validTypes.includes(file.type)) {
      onUploadError?.('Invalid file type. Please upload a PDF or TXT file.')
      return
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      onUploadError?.('File too large. Maximum size is 10MB.')
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const result = await uploadFile(selectedFile)
      onUploadSuccess?.(result)
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error.response?.data?.detail || 'Failed to upload file'
      onUploadError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center
            transition-all duration-300 cursor-pointer
            ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full">
              <Upload className="w-8 h-8 text-white" />
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {isDragging ? 'Drop your file here' : 'Upload a book'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag & drop or click to browse
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
              <span>Supported: PDF, TXT</span>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <File className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              onClick={clearFile}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={isUploading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Upload & Process</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
