// src/components/NavBar.jsx
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const role = (localStorage.getItem('role') || 'STUDENT').toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('email')
    navigate('/login')
  }

  const navLinkClass = (path) =>
    'text-sm px-3 py-1 rounded-full transition-colors ' +
    (location.pathname.startsWith(path)
      ? 'bg-white/10 text-white'
      : 'text-slate-300 hover:text-white hover:bg-white/5')

  return (
    <header className="fixed top-0 inset-x-0 z-20 backdrop-blur bg-slate-950/70 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to={token ? '/feed' : '/login'} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            C
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            <span className="text-slate-200">Connect</span>
            <span className="text-indigo-400">Here</span>
          </span>
        </Link>

        {/* Middle links (only when logged in) */}
        {token && (
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/feed" className={navLinkClass('/feed')}>
              Feed
            </Link>
            <Link to="/channels" className={navLinkClass('/channels')}>
              Channels
            </Link>
            <Link to="/resources" className={navLinkClass('/resources')}>
              Resources
            </Link>
            <Link to="/profile" className={navLinkClass('/profile')}>
              Profile
            </Link>
            {role === 'ADMIN' && (
              <Link to="/admin" className={navLinkClass('/admin')}>
                Admin
              </Link>
            )}
          </nav>
        )}

        {/* Right side: auth buttons */}
        <div className="flex items-center gap-2">
          {!token ? (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs px-3 py-1.5 rounded-full text-slate-200 hover:text-white hover:bg-white/10"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-xs px-4 py-1.5 rounded-full bg-indigo-500 text-white font-medium shadow-md shadow-indigo-500/40 hover:bg-indigo-600"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-200 hover:bg-white/10"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
