import { useCallback } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import ProgressTracker from './components/ProgressTracker'
import TaskHistory from './components/TaskHistory'

/**
 * App Component - Main Application Container
 * 
 * Architecture:
 * - State managed via useLocalStorage hook for persistence
 * - Callbacks defined as named functions (not inline) for testability
 * - Clean separation of concerns: App handles state, components handle UI
 * 
 * localStorage Sync Explanation:
 * The useLocalStorage hook handles all localStorage operations.
 * 1. On initial mount, it checks localStorage for existing tasks.
 * 2. If found, it parses the JSON and sets the initial state.
 * 3. If not found, it uses the default empty array.
 * 4. A useEffect watches the tasks state and writes to localStorage on every change.
 * 5. This ensures data persists across browser sessions without manual intervention.
 */
function App() {
  // Use custom hook for localStorage persistence
  const [tasks, setTasks] = useLocalStorage('taskbuddy-tasks', [])

  /**
   * Adds a new task to the task list.
   * Validation is handled in the TaskForm component before calling this.
   */
  const handleAddTask = useCallback(function addTask(newTask) {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }, [setTasks])

  /**
   * Toggles a task's completion status.
   * Moves task between active list and history.
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
   * Note: Completed tasks use permanentDelete instead.
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">
          TaskBuddy
        </h1>
        <p className="text-gray-600">Your personal task management companion</p>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto">
        {/* Progress Tracker - Shows completion percentage */}
        <ProgressTracker tasks={tasks} />

        {/* Task Form - Add new tasks */}
        <TaskForm tasks={tasks} onAddTask={handleAddTask} />

        {/* Active Tasks List */}
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />

        {/* Task History - Completed tasks */}
        <TaskHistory
          tasks={tasks}
          onRestoreTask={handleRestoreTask}
          onPermanentDelete={handlePermanentDelete}
        />
      </main>

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>TaskBuddy - Built with React, Tailwind CSS & Vitest</p>
      </footer>
    </div>
  )
}

export default App

