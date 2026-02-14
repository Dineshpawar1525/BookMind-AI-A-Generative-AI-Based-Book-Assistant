/**
 * SummaryView Component
 * Displays AI-generated book summary with key points
 */

import { useState } from 'react'
import { FileText, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import { summarizeBook } from '../../services/api'

const SummaryView = ({ fileId, fileName }) => {
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleGenerateSummary = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await summarizeBook(fileId)
      setSummary(result)
    } catch (err) {
      console.error('Summary error:', err)
      setError(err.response?.data?.detail || 'Failed to generate summary')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    const text = `${summary.summary}\n\nKey Points:\n${summary.key_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Generating Summary...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            AI is analyzing your book
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={handleGenerateSummary}
          className="mt-4 btn-secondary text-sm"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Generate AI Summary
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get a comprehensive summary with key insights
          </p>
        </div>
        <button onClick={handleGenerateSummary} className="btn-primary">
          <Sparkles className="w-5 h-5 inline mr-2" />
          Generate Summary
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Book Summary
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {fileName}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Copy summary"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Summary Text */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {summary.summary}
        </p>
      </div>

      {/* Key Points */}
      {summary.key_points && summary.key_points.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Key Points
          </h4>
          <ul className="space-y-3">
            {summary.key_points.map((point, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Regenerate Button */}
      <button
        onClick={handleGenerateSummary}
        className="btn-secondary w-full"
      >
        <Sparkles className="w-5 h-5 inline mr-2" />
        Regenerate Summary
      </button>
    </div>
  )
}

export default SummaryView
