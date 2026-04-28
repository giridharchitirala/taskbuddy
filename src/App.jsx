import { useCallback, useState, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ProgressTracker from './components/ProgressTracker'
import TaskHistory from './components/TaskHistory'
import TaskFilter from './components/TaskFilter'
import DarkModeToggle from './components/DarkModeToggle'

/**
 * App Component - Main Application Container
 * 
 * Features:
 * - State managed via useLocalStorage hook for persistence
 * - Dark mode with localStorage persistence
 * - Search, filter, and sort tasks
 * - Inline editing, subtasks, tags, due dates
 */
function App() {
  // Use custom hook for localStorage persistence
  const [tasks, setTasks] = useLocalStorage('taskbuddy-tasks', [])
  const [darkMode, setDarkMode] = useLocalStorage('taskbuddy-darkmode', false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev)
  }, [setDarkMode])

  /**
   * Adds a new task to the task list.
   */
  const handleAddTask = useCallback(function addTask(newTask) {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }, [setTasks])

  /**
   * Toggles a task's completion status.
   */
  const handleToggleComplete = useCallback(function toggleComplete(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }, [setTasks])

  /**
   * Deletes a task from the active list.
   */
  const handleDeleteTask = useCallback(function deleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }, [setTasks])

  /**
   * Restores a completed task back to active status.
   */
  const handleRestoreTask = useCallback(function restoreTask(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: false } : task
      )
    )
  }, [setTasks])

  /**
   * Permanently deletes a task from history.
   */
  const handlePermanentDelete = useCallback(function permanentDelete(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }, [setTasks])

  /**
   * Edits an existing task.
   */
  const handleEditTask = useCallback(function editTask(taskId, updatedFields) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    )
  }, [setTasks])

  /**
   * Toggles a subtask's completion status.
   */
  const handleToggleSubtask = useCallback(function toggleSubtask(taskId, subtaskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) return task
        return {
          ...task,
          subtasks: task.subtasks?.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ) || [],
        }
      })
    )
  }, [setTasks])

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = tasks

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((task) =>
        task.name.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Priority filter
    if (filterPriority !== 'all') {
      result = result.filter((task) => task.priority === filterPriority)
    }

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter((task) => task.category === filterCategory)
    }

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
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

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
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
        {/* Progress Tracker */}
        <ProgressTracker tasks={tasks} darkMode={darkMode} />

        {/* Task Form */}
        <TaskForm tasks={tasks} onAddTask={handleAddTask} darkMode={darkMode} />

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
      </main>

      {/* Footer */}
      <footer className={`text-center mt-12 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <p>TaskBuddy - Built with React, Tailwind CSS & Vitest</p>
      </footer>
    </div>
  )
}

export default App

