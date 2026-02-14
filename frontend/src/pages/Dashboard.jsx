/**
 * Dashboard Page
 * Main landing page with upload and recommendations
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Upload as UploadIcon, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import FileUpload from '../components/Upload/FileUpload'
import RecommendationView from '../components/Recommend/RecommendationView'

const Dashboard = () => {
  const navigate = useNavigate()
  const [alert, setAlert] = useState(null)

  const handleUploadSuccess = (result) => {
    setAlert({
      type: 'success',
      message: `"${result.filename}" uploaded successfully!`,
    })

    // Navigate to book viewer after a short delay
    setTimeout(() => {
      navigate(`/book/${result.file_id}`, {
        state: { fileName: result.filename, fileId: result.file_id },
      })
    }, 1500)
  }

  const handleUploadError = (error) => {
    setAlert({
      type: 'error',
      message: error,
    })

    setTimeout(() => setAlert(null), 5000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Alert */}
      {alert && (
        <div
          className={`mb-6 p-4 rounded-lg border fade-in ${
            alert.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12 fade-in">
        <div className="inline-block p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4 shadow-soft-lg">
          <BookOpen className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Welcome to BookMind AI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your intelligent book assistant powered by AI. Upload a book, get instant summaries,
          chat with the content, and discover personalized recommendations.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: UploadIcon,
            title: 'Upload & Process',
            description: 'Upload PDF or TXT files and let AI analyze the content',
            color: 'from-blue-500 to-blue-600',
          },
          {
            icon: MessageCircle,
            title: 'Chat & Explore',
            description: 'Ask questions and get instant answers from your books',
            color: 'from-purple-500 to-purple-600',
          },
          {
            icon: Sparkles,
            title: 'Smart Recommendations',
            description: 'Get personalized book suggestions based on your interests',
            color: 'from-pink-500 to-pink-600',
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-soft-lg transition-all duration-300 card-hover"
          >
            <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg w-fit mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content - Upload and Recommendations */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
              <UploadIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Upload Your Book
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start by uploading a PDF or TXT file
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'File Types', value: 'PDF, TXT' },
              { label: 'Max Size', value: '10 MB' },
              { label: 'Processing', value: '~30s' },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Discover Books
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get AI-powered recommendations
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
            <RecommendationView />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-16 p-8 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
        <h2 className="text-2xl font-bold text-center gradient-text mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Upload', description: 'Upload your book file' },
            { step: '2', title: 'Process', description: 'AI analyzes the content' },
            { step: '3', title: 'Interact', description: 'Chat and get summaries' },
            { step: '4', title: 'Discover', description: 'Get recommendations' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
