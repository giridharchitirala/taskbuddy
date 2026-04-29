import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DarkModeToggle from './DarkModeToggle'

function NavBar({ darkMode, onToggleDarkMode, currentUser, setShowSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()

  const navBg = darkMode ? 'bg-gray-900/95 backdrop-blur-md shadow-gradient-glow border-gray-700' : 'bg-white/80 backdrop-blur-md shadow-glow border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'
  const hoverClass = darkMode ? 'hover:text-emerald-400 hover:bg-gray-800' : 'hover:text-emerald-600 hover:bg-emerald-50'

  return (
    <nav className={`sticky top-0 z-40 border-b ${navBg} transition-all duration-300 animate-slide-up`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-text">TaskBuddy</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className={`font-medium ${hoverClass} px-3 py-2 rounded-lg transition-all ${textMain}`}>Dashboard</a>
            <a href="#tasks" className={`font-medium ${hoverClass} px-3 py-2 rounded-lg transition-all ${textMain}`}>Tasks</a>
            <button 
              onClick={() => setShowSettings(true)}
              className={`font-medium ${hoverClass} px-3 py-2 rounded-lg transition-all ${textMain}`}
            >
              ⚙️ Settings
            </button>
            <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
            <button
              onClick={logout}
              className={`ml-2 px-4 py-2 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500 transition-all shadow-glow ${textMain}`}
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DarkModeToggle darkMode={darkMode} onToggle={onToggleDarkMode} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`ml-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className={`md:hidden pb-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#dashboard" className={`block px-3 py-2 font-medium rounded-lg ${hoverClass} ${textMain}`}>Dashboard</a>
              <a href="#tasks" className={`block px-3 py-2 font-medium rounded-lg ${hoverClass} ${textMain}`}>Tasks</a>
              <button onClick={() => setMobileOpen(false); setShowSettings(true)} className={`block w-full text-left px-3 py-2 font-medium rounded-lg ${hoverClass} ${textMain}`}>⚙️ Settings</button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar

