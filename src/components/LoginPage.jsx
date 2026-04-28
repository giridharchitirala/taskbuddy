import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function LoginPage({ darkMode, onToggleDarkMode }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login') // login | signup
  const [displayName, setDisplayName] = useState('')
  const { login, signup } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'login') {
      const result = login(username, password)
      if (!result.success) setError(result.error)
    } else {
      const result = signup(username, password, displayName)
      if (!result.success) setError(result.error)
    }
  }

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600'
  const inputClass = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl border shadow-lg ${cardBg}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${textMain}`}>TaskBuddy</h1>
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <h2 className={`text-xl font-semibold mb-1 ${textMain}`}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className={`text-sm mb-6 ${textMuted}`}>
          {mode === 'login' ? 'Sign in to manage your tasks' : 'Start your productivity journey'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${textMuted}`}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className={inputClass}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className={`block text-sm font-medium mb-1 ${textMuted}`}>Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1 ${textMuted}`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={inputClass}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm" role="alert">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${textMuted}`}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

