import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'

function SettingsModal({ isOpen, onClose, darkMode, currentUser }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef()
  const { currentUser: user, resetPassword, updateUser } = useAuth()
  const { addToast } = useToast()

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || newPassword.length < 4) {
      setError('All fields required, new password min 4 chars')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (user.password !== oldPassword) {
      setError('Old password incorrect')
      return
    }
    const result = resetPassword(user.username, newPassword)
    if (result.success) {
      addToast('Password updated successfully!', 'success')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    } else {
      setError(result.error)
    }
  }

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newUser = { ...user, avatar: ev.target.result }
        updateUser(newUser)
        addToast('Profile picture updated!', 'success')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNameChange = (e) => {
    setDisplayName(e.target.value)
    updateUser({ displayName: e.target.value })
    addToast('Display name updated!', 'success')
  }

  const modalBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600'
  const inputClass = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${darkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${modalBg}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gradient-start bg-gradient-text">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
        </div>

        {/* Profile Pic */}
        <div className="text-center mb-6">
          <div className={`w-24 h-24 rounded-full mx-auto mb-4 shadow-glow flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gradient-to-r from-violet-900 to-emerald-900' : 'bg-gradient-to-r from-violet-100 to-emerald-100 border-4 border-white shadow-lg'}`}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white dark:text-gray-200">{user?.displayName?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 focus:ring-4 focus:ring-violet-500 shadow-glow transition-all"
          >
            Upload Profile Picture
          </button>
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">Display Name</label>
          <input
            type="text"
            value={displayName}
            onBlur={handleNameChange}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          {error && <p className="text-orange-500 text-sm p-3 bg-orange-100/20 rounded-xl border border-orange-200">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-success text-white font-bold rounded-xl hover:shadow-gradient-glow focus:ring-4 focus:ring-emerald-500 transition-all shadow-lg"
          >
            Update Password
          </button>
        </form>

        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-xl font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal

