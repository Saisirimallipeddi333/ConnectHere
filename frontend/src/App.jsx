// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import FeedPage from './pages/FeedPage.jsx'
import ChannelsPage from './pages/ChannelsPage.jsx'
import ResourcesPage from './pages/ResourcesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import NavBar from './components/NavBar.jsx'

export default function App() {
  const token = localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 text-slate-900">
      {/* top nav */}
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 pb-12 pt-24">
        <Routes>
          {/* default: if logged in go to feed, else go to login */}
          <Route
            path="/"
            element={token ? <Navigate to="/feed" replace /> : <Navigate to="/login" replace />}
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/feed" element={<FeedPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
