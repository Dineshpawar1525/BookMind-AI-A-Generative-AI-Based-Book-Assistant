/**
 * App.jsx - Main Application Component
 * Handles routing, theme management, and global state
 */

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import BookViewer from './pages/BookViewer'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/book/:fileId" element={<BookViewer />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App