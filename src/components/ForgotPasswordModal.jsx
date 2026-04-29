import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'

function ForgotPasswordModal({ isOpen, onClose, darkMode }) {
  const [username, setUsername] = useState('')
  const [step, setStep] = useState('username') // 'username' | 'reset'
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const { addToast } = useToast()

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    if (!users[username.trim().toLowerCase()]) {
      setError('Username not found')
      return
    }
    // Mock "send email"
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('reset')
      addToast('Reset code sent! (mock)', 'info')
    }, 1000)
  }

  const handleResetSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    const result = resetPassword(username, newPassword)
    if (result.success) {
      addToast('Password reset successful!', 'success')
      onClose()
    } else {
      setError(result.error)
    }
  }


  const modalBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600'
  const inputClass = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${modalBg}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${textMain}`}>{step === 'username' ? 'Forgot Password?' : 'Reset Password'}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-gray-200 ${darkMode ? 'hover:bg-gray-700' : ''}`}>&times;</button>
        </div>

        {step === 'username' ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textMuted}`}>Enter your username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={inputClass}
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm p-2 bg-red-100/50 rounded-lg border border-red-200">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-glow"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textMuted}`}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${textMuted}`}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={inputClass}
              />
            </div>
            {error && <p className="text-red-500 text-sm p-2 bg-red-100/50 rounded-lg border border-red-200">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('username')}
                className={`flex-1 py-2.5 border rounded-xl font-medium transition-colors ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-gradient-success text-white font-medium rounded-xl hover:shadow-gradient-glow focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-offset-2 transition-all"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordModal

