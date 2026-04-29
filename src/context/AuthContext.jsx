import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskbuddy-users')) || {}
    } catch {
      return {}
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem('taskbuddy-current-user')
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem('taskbuddy-current-user')
      }
    }
    setIsLoading(false)
  }, [])

  // Persist users object
  useEffect(() => {
    localStorage.setItem('taskbuddy-users', JSON.stringify(users))
  }, [users])

  // Persist current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('taskbuddy-current-user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('taskbuddy-current-user')
    }
  }, [currentUser])

  const signup = useCallback((username, password, displayName) => {
    if (!username.trim() || !password.trim()) return { success: false, error: 'Username and password are required' }
    if (users[username]) return { success: false, error: 'Username already exists' }
    if (password.length < 4) return { success: false, error: 'Password must be at least 4 characters' }

    const newUser = {
      id: `user_${Date.now()}`,
      username: username.trim().toLowerCase(),
      displayName: displayName?.trim() || username.trim(),
      password, // Simulated auth - NOT secure, for demo only
      createdAt: new Date().toISOString(),
      xp: 0,
      level: 1,
      streak: 0,
      lastLoginDate: null,
      achievements: [],
      preferences: {
        defaultView: 'list',
        notifications: true,
      },
    }

    setUsers((prev) => ({ ...prev, [newUser.username]: newUser }))
    setCurrentUser(newUser)
    return { success: true }
  }, [users])

  const login = useCallback((username, password) => {
    const user = users[username.trim().toLowerCase()]
    if (!user) return { success: false, error: 'User not found' }
    if (user.password !== password) return { success: false, error: 'Incorrect password' }

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const lastLogin = user.lastLoginDate
    let newStreak = user.streak || 0
    if (lastLogin) {
      const last = new Date(lastLogin)
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
      if (last.toISOString().split('T')[0] === today) {
        // Same day, streak unchanged
      } else if (last.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        newStreak += 1
      } else {
        newStreak = 1
      }
    } else {
      newStreak = 1
    }

    const updatedUser = { ...user, streak: newStreak, lastLoginDate: today }
    setUsers((prev) => ({ ...prev, [user.username]: updatedUser }))
    setCurrentUser(updatedUser)
    return { success: true }
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
    setUsers((prev) => ({ ...prev, [currentUser.username]: updated }))
  }, [currentUser])

  const addXp = useCallback((amount) => {
    if (!currentUser) return
    const newXp = (currentUser.xp || 0) + amount
    const newLevel = Math.floor(newXp / 100) + 1
    updateUser({ xp: newXp, level: newLevel })
  }, [currentUser, updateUser])

  const awardAchievement = useCallback((achievementId) => {
    if (!currentUser) return
    const achievements = currentUser.achievements || []
    if (achievements.includes(achievementId)) return
    updateUser({ achievements: [...achievements, achievementId] })
  }, [currentUser, updateUser])

  const resetPassword = useCallback((username, newPassword) => {
    const userKey = username?.trim().toLowerCase()
    if (!userKey || !newPassword || newPassword.length < 4) {
      return { success: false, error: 'Invalid username or password (min 4 chars)' }
    }
    const user = users[userKey]
    if (!user) return { success: false, error: 'User not found' }
    setUsers(prev => ({ ...prev, [userKey]: { ...user, password: newPassword } }))
    return { success: true }
  }, [users])

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    signup,
    login,
    logout,
    updateUser,
    addXp,
    awardAchievement,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

