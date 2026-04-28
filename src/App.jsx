import { useCallback, useState, useMemo, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useToast } from './hooks/useToast'
import LoginPage from './components/LoginPage'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ProgressTracker from './components/ProgressTracker'
import TaskHistory from './components/TaskHistory'
import TaskFilter from './components/TaskFilter'
import DarkModeToggle from './components/DarkModeToggle'
import UserDashboard from './components/UserDashboard'
import Toast from './components/Toast'
import ConfirmDialog from './components/ConfirmDialog'
import TrashBin from './components/TrashBin'
import PinnedTasks from './components/PinnedTasks'
import OnboardingModal from './components/OnboardingModal'

function App() {
  const { currentUser, isAuthenticated, isLoading, logout, addXp, awardAchievement } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const [darkMode, setDarkMode] = useLocalStorage('taskbuddy-darkmode', false)

  // User-specific keys
  const tasksKey = currentUser ? `taskbuddy-tasks-${currentUser.id}` : 'taskbuddy-tasks'
  const trashKey = currentUser ? `taskbuddy-trash-${currentUser.id}` : 'taskbuddy-trash'
  const onboardingKey = currentUser ? `taskbuddy-onboarding-${currentUser.id}` : 'taskbuddy-onboarding'

  const [tasks, setTasks] = useLocalStorage(tasksKey, [])
  const [trash, setTrash] = useLocalStorage(trashKey, [])
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage(onboardingKey, false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [selectedTaskIds, setSelectedTaskIds] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Undo/Redo history
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Confirm dialog
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null })

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), [setDarkMode])

  // Show onboarding for new users after auth loads
  useEffect(() => {
    if (isAuthenticated && !hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [isAuthenticated, hasSeenOnboarding])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'd') {
          e.preventDefault()
          toggleDarkMode()
        }
        if (e.key === 'z') {
          e.preventDefault()
          handleUndo()
        }
        if (e.key === 'y') {
          e.preventDefault()
          handleRedo()
        }
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        document.querySelector('[data-testid="search-input"]')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleDarkMode, history, historyIndex, tasks])

  // Push state to history for undo
  const pushHistory = useCallback((newTasks) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1)
      next.push(newTasks)
      if (next.length > 50) next.shift()
      return next
    })
    setHistoryIndex((prev) => Math.min(prev + 1, 49))
  }, [historyIndex])

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setTasks(history[newIndex])
      addToast('Undo successful', 'info')
    }
  }, [history, historyIndex, setTasks, addToast])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setTasks(history[newIndex])
      addToast('Redo successful', 'info')
    }
  }, [history, historyIndex, setTasks, addToast])

  // Achievement checking
  const checkAchievements = useCallback((updatedTasks) => {
    if (!currentUser) return
    const totalCompleted = updatedTasks.filter((t) => t.completed).length
    const categoriesUsed = new Set(updatedTasks.map((t) => t.category)).size
    const taggedTasks = updatedTasks.filter((t) => t.tags?.length > 0).length
    const subtaskPro = updatedTasks.some((t) => t.subtasks?.length > 0 && t.subtasks.every((st) => st.completed))

    if (updatedTasks.length >= 1) awardAchievement('first_task')
    if (totalCompleted >= 10) awardAchievement('task_master_10')
    if (totalCompleted >= 50) awardAchievement('task_master_50')
    if ((currentUser.streak || 0) >= 3) awardAchievement('streak_3')
    if ((currentUser.streak || 0) >= 7) awardAchievement('streak_7')
    if (categoriesUsed >= 3) awardAchievement('organizer')
    if (taggedTasks >= 5) awardAchievement('tag_master')
    if (subtaskPro) awardAchievement('subtask_pro')

    const hour = new Date().getHours()
    if (hour < 8) awardAchievement('early_bird')
    if (hour >= 22) awardAchievement('night_owl')
  }, [currentUser, awardAchievement])

  // Task handlers
  const handleAddTask = useCallback((newTask) => {
    setTasks((prev) => {
      const next = [...prev, newTask]
      pushHistory(next)
      checkAchievements(next)
      addXp(10)
      addToast('Task added', 'success')
      return next
    })
  }, [setTasks, pushHistory, checkAchievements, addXp, addToast])

  const handleToggleComplete = useCallback((taskId) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
      pushHistory(next)
      checkAchievements(next)
      const task = next.find((t) => t.id === taskId)
      if (task?.completed) {
        addXp(15)
        addToast('Task completed! +15 XP', 'success')
      }
      return next
    })
  }, [setTasks, pushHistory, checkAchievements, addXp, addToast])

  const handleDeleteTask = useCallback((taskId) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId)
      if (task) setTrash((t) => [...t, { ...task, deletedAt: new Date().toISOString() }])
      const next = prev.filter((t) => t.id !== taskId)
      pushHistory(next)
      addToast('Task moved to trash', 'warning')
      return next
    })
    setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId))
  }, [setTasks, setTrash, pushHistory, addToast])

  const handleRestoreFromTrash = useCallback((task) => {
    setTrash((prev) => prev.filter((t) => t.id !== task.id))
    setTasks((prev) => {
      const next = [...prev, task]
      pushHistory(next)
      addToast('Task restored', 'success')
      return next
    })
  }, [setTrash, setTasks, pushHistory, addToast])

  const handlePermanentDeleteTrash = useCallback((taskId) => {
    setTrash((prev) => prev.filter((t) => t.id !== taskId))
    addToast('Task permanently deleted', 'info')
  }, [setTrash, addToast])

  const handleRestoreTask = useCallback((taskId) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === taskId ? { ...task, completed: false } : task
      )
      pushHistory(next)
      addToast('Task restored to active', 'info')
      return next
    })
  }, [setTasks, pushHistory, addToast])

  const handlePermanentDelete = useCallback((taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    addToast('Task deleted permanently', 'info')
  }, [setTasks, addToast])

  const handleEditTask = useCallback((taskId, updatedFields) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
      pushHistory(next)
      addToast('Task updated', 'success')
      return next
    })
  }, [setTasks, pushHistory, addToast])

  const handleToggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) => {
      const next = prev.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          subtasks: task.subtasks?.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ) || [],
        }
      })
      pushHistory(next)
      checkAchievements(next)
      return next
    })
  }, [setTasks, pushHistory, checkAchievements])

  // Bulk actions
  const toggleSelectTask = useCallback((taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }, [])

  const handleBulkComplete = useCallback(() => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        selectedTaskIds.includes(task.id) ? { ...task, completed: true } : task
      )
      pushHistory(next)
      checkAchievements(next)
      addXp(selectedTaskIds.length * 15)
      addToast(`${selectedTaskIds.length} tasks completed`, 'success')
      return next
    })
    setSelectedTaskIds([])
  }, [selectedTaskIds, setTasks, pushHistory, checkAchievements, addXp, addToast])

  const handleBulkDelete = useCallback(() => {
    setTasks((prev) => {
      const toDelete = prev.filter((t) => selectedTaskIds.includes(t.id))
      setTrash((tr) => [...tr, ...toDelete.map((t) => ({ ...t, deletedAt: new Date().toISOString() }))])
      const next = prev.filter((t) => !selectedTaskIds.includes(t.id))
      pushHistory(next)
      addToast(`${selectedTaskIds.length} tasks moved to trash`, 'warning')
      return next
    })
    setSelectedTaskIds([])
  }, [selectedTaskIds, setTasks, setTrash, pushHistory, addToast])

  const handlePinTask = useCallback((taskId) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === taskId ? { ...task, pinned: !task.pinned } : task
      )
      pushHistory(next)
      addToast('Task pinned', 'success')
      return next
    })
  }, [setTasks, pushHistory, addToast])

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false)
    setHasSeenOnboarding(true)
  }, [setHasSeenOnboarding])

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = tasks
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((task) =>
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    if (filterPriority !== 'all') result = result.filter((task) => task.priority === filterPriority)
    if (filterCategory !== 'all') result = result.filter((task) => task.category === filterCategory)
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    return result
  }, [tasks, searchQuery, filterPriority, filterCategory, sortBy])

  const activeTasks = filteredTasks.filter((task) => !task.completed)
  const completedTasks = filteredTasks.filter((task) => task.completed)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
  }

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <Toast toasts={toasts} onRemove={removeToast} darkMode={darkMode} />
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} darkMode={darkMode} />
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={() => { confirmConfig.onConfirm?.(); setConfirmConfig((c) => ({ ...c, isOpen: false })) }}
        onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
        darkMode={darkMode}
      />

      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-primary-400' : 'text-primary-700'}`}>
            TaskBuddy
          </h1>
          <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
        </div>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Your personal task management companion
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        {/* User Dashboard */}
        <UserDashboard tasks={tasks} darkMode={darkMode} />

        {/* Progress Tracker */}
        <ProgressTracker tasks={tasks} darkMode={darkMode} />

        {/* Pinned Tasks */}
        <PinnedTasks
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleSubtask={handleToggleSubtask}
          darkMode={darkMode}
        />

        {/* Task Form */}
        <TaskForm tasks={tasks} onAddTask={handleAddTask} darkMode={darkMode} />

        {/* Bulk Actions */}
        {selectedTaskIds.length > 0 && (
          <div className={`flex items-center justify-between p-3 rounded-lg border mb-4 ${darkMode ? 'bg-primary-900 border-primary-700' : 'bg-primary-50 border-primary-200'}`}>
            <span className={`text-sm font-medium ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>
              {selectedTaskIds.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkComplete}
                className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Complete
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedTaskIds([])}
                className={`px-3 py-1.5 text-sm rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Task Filter & Sort */}
        <TaskFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterPriority={filterPriority}
          onFilterPriorityChange={setFilterPriority}
          filterCategory={filterCategory}
          onFilterCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          darkMode={darkMode}
        />

        {/* Active Tasks List */}
        <TaskList
          tasks={activeTasks}
          allTasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onToggleSubtask={handleToggleSubtask}
          onPinTask={handlePinTask}
          selectedTaskIds={selectedTaskIds}
          onToggleSelect={toggleSelectTask}
          darkMode={darkMode}
        />

        {/* Task History */}
        <TaskHistory
          tasks={completedTasks}
          allTasks={tasks}
          onRestoreTask={handleRestoreTask}
          onPermanentDelete={handlePermanentDelete}
          onEditTask={handleEditTask}
          darkMode={darkMode}
        />

        {/* Trash Bin */}
        <TrashBin
          trash={trash}
          onRestore={handleRestoreFromTrash}
          onPermanentDelete={handlePermanentDeleteTrash}
          darkMode={darkMode}
        />
      </main>

      {/* Footer */}
      <footer className={`text-center mt-12 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <p>TaskBuddy - Built with React, Tailwind CSS & Vitest</p>
        <p className="mt-1 text-xs opacity-75">Shortcuts: Ctrl+D dark mode • Ctrl+Z undo • Ctrl+Y redo • / search</p>
      </footer>
    </div>
  )
}

export default App

