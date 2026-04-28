import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'

const ACHIEVEMENTS = {
  first_task: { label: 'First Steps', desc: 'Create your first task', icon: '🎯' },
  task_master_10: { label: 'Task Master', desc: 'Complete 10 tasks', icon: '⭐' },
  task_master_50: { label: 'Task Legend', desc: 'Complete 50 tasks', icon: '👑' },
  streak_3: { label: 'On Fire', desc: '3-day login streak', icon: '🔥' },
  streak_7: { label: 'Unstoppable', desc: '7-day login streak', icon: '⚡' },
  early_bird: { label: 'Early Bird', desc: 'Complete a task before 8 AM', icon: '🐦' },
  night_owl: { label: 'Night Owl', desc: 'Complete a task after 10 PM', icon: '🦉' },
  organizer: { label: 'Organizer', desc: 'Use 3 different categories', icon: '📁' },
  tag_master: { label: 'Tag Master', desc: 'Add tags to 5 tasks', icon: '🏷️' },
  subtask_pro: { label: 'Subtask Pro', desc: 'Complete all subtasks of a task', icon: '✅' },
}

function UserDashboard({ tasks, darkMode }) {
  const { currentUser, logout } = useAuth()

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const active = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date().setHours(0, 0, 0, 0)).length
    const categoriesUsed = new Set(tasks.map((t) => t.category)).size
    const taggedTasks = tasks.filter((t) => t.tags?.length > 0).length
    return { total, completed, active, completionRate, overdue, categoriesUsed, taggedTasks }
  }, [tasks])

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className={`rounded-xl border p-6 mb-6 ${cardBg}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${darkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'}`}>
            {currentUser?.displayName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textMain}`}>{currentUser?.displayName || 'User'}</h2>
            <p className={`text-sm ${textMuted}`}>@{currentUser?.username} • Level {currentUser?.level || 1}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
            🔥 Streak: {currentUser?.streak || 0} day{currentUser?.streak !== 1 ? 's' : ''}
          </div>
          <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${darkMode ? 'bg-primary-900 text-primary-300' : 'bg-primary-100 text-primary-700'}`}>
            ⭐ XP: {currentUser?.xp || 0}
          </div>
          <button
            onClick={logout}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-2xl font-bold ${textMain}`}>{stats.total}</p>
          <p className={`text-xs ${textMuted}`}>Total Tasks</p>
        </div>
        <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-2xl font-bold ${textMain}`}>{stats.active}</p>
          <p className={`text-xs ${textMuted}`}>Active</p>
        </div>
        <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-2xl font-bold ${textMain}`}>{stats.completed}</p>
          <p className={`text-xs ${textMuted}`}>Completed</p>
        </div>
        <div className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-2xl font-bold ${textMain}`}>{stats.completionRate}%</p>
          <p className={`text-xs ${textMuted}`}>Completion Rate</p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${textMuted}`}>Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ACHIEVEMENTS).map(([id, ach]) => {
            const unlocked = currentUser?.achievements?.includes(id)
            return (
              <div
                key={id}
                title={`${ach.label}: ${ach.desc}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-opacity ${
                  unlocked
                    ? darkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-200'
                      : 'bg-white border-gray-300 text-gray-800'
                    : darkMode
                    ? 'bg-gray-900 border-gray-800 text-gray-600 opacity-50'
                    : 'bg-gray-100 border-gray-200 text-gray-400 opacity-50'
                }`}
              >
                <span className="text-lg">{ach.icon}</span>
                <span className="font-medium">{ach.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

