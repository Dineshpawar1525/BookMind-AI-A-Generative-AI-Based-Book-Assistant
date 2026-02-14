/**
 * RecommendationView Component
 * Displays personalized book recommendations
 */

import { useState } from 'react'
import { Sparkles, Loader2, BookOpen, ExternalLink } from 'lucide-react'
import { getRecommendations } from '../../services/api'

const RecommendationView = ({ fileId = null }) => {
  const [interests, setInterests] = useState('')
  const [recommendations, setRecommendations] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGetRecommendations = async (e) => {
    e.preventDefault()

    if (!interests.trim()) {
      setError('Please enter your interests')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await getRecommendations(interests, fileId)
      setRecommendations(result)
    } catch (err) {
      console.error('Recommendation error:', err)
      setError(err.response?.data?.detail || 'Failed to get recommendations')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What are you interested in?
          </label>
          <form onSubmit={handleGetRecommendations} className="space-y-3">
            <textarea
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="E.g., Science fiction with AI themes, mystery novels, personal development..."
              className="input-field min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !interests.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                  Generating Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Get Recommendations
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>

        {fileId && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Recommendations will also be based on your uploaded book
            </p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.recommendations && (
        <div className="space-y-4 fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recommended Books
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {recommendations.recommendations.length} suggestions
            </span>
          </div>

          <div className="grid gap-4">
            {recommendations.recommendations.map((book, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-soft-lg transition-all duration-300 card-hover"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      by {book.author}
                    </p>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        <strong>Why this book:</strong> {book.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Search Button */}
          <button
            onClick={() => {
              setRecommendations(null)
              setInterests('')
            }}
            className="btn-secondary w-full"
          >
            Get New Recommendations
          </button>
        </div>
      )}

      {/* Popular Genres Hints */}
      {!recommendations && !isLoading && (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            💡 Popular genres to explore:
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Science Fiction',
              'Fantasy',
              'Mystery',
              'Self-Help',
              'Biography',
              'Psychology',
              'Business',
              'Philosophy',
            ].map((genre) => (
              <button
                key={genre}
                onClick={() => setInterests(genre)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommendationView
