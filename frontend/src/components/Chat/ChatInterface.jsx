/**
 * ChatInterface Component
 * Interactive Q&A chat with uploaded books
 */

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Loader2, BookOpen } from 'lucide-react'
import { chatWithBook } from '../../services/api'

const ChatInterface = ({ fileId, fileName }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm ready to answer questions about "${fileName}". What would you like to know?`,
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')

    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: 'user', content: userMessage },
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Prepare chat history (last 10 messages for context)
      const chatHistory = newMessages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const result = await chatWithBook(fileId, userMessage, chatHistory)

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: result.response },
      ])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chat with Book
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {fileName}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-primary-600 to-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                )}
                <p
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question about the book..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Ask questions about themes, characters, plot, or specific topics
        </p>
      </div>
    </div>
  )
}

export default ChatInterface
