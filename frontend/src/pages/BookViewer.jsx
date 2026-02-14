/**
 * BookViewer Page
 * Interactive page for viewing book details, summary, and chatting
 */

import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, MessageCircle, Sparkles } from 'lucide-react'
import SummaryView from '../components/Summary/SummaryView'
import ChatInterface from '../components/Chat/ChatInterface'
import RecommendationView from '../components/Recommend/RecommendationView'

const BookViewer = () => {
  const { fileId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [fileName, setFileName] = useState(
    location.state?.fileName || 'Unknown Book'
  )
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    if (!fileId) {
      navigate('/')
    }
  }, [fileId, navigate])

  const tabs = [
    {
      id: 'summary',
      label: 'Summary',
      icon: FileText,
      color: 'blue',
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      color: 'purple',
    },
    {
      id: 'recommend',
      label: 'Similar Books',
      icon: Sparkles,
      color: 'pink',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 fade-in">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {fileName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore your book with AI-powered tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300
                ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 shadow-md text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-soft overflow-hidden fade-in">
        <div className="p-6">
          {activeTab === 'summary' && (
            <SummaryView fileId={fileId} fileName={fileName} />
          )}

          {activeTab === 'chat' && (
            <div className="h-[600px]">
              <ChatInterface fileId={fileId} fileName={fileName} />
            </div>
          )}

          {activeTab === 'recommend' && (
            <RecommendationView fileId={fileId} />
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          💡 Tips for Best Experience
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-primary-600 dark:text-primary-400">•</span>
            <span>
              <strong>Summary:</strong> Get a quick overview of the main themes and key points
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-600 dark:text-purple-400">•</span>
            <span>
              <strong>Chat:</strong> Ask specific questions about characters, plot, or concepts
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-pink-600 dark:text-pink-400">•</span>
            <span>
              <strong>Similar Books:</strong> Discover books with related themes and topics
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BookViewer
