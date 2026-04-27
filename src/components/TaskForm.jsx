import { useState } from 'react'
import { validateNewTask } from '../utils/validation'

/**
 * TaskForm Component
 * Handles user input for adding new tasks with priority and category.
 * Validates input to prevent empty tasks and duplicates.
 */
function TaskForm({ tasks, onAddTask }) {
  const [taskName, setTaskName] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [error, setError] = useState('')

  /**
   * Handles input field changes.
   * Clears any previous error when user starts typing.
   */
  function handleInputChange(event) {
    setTaskName(event.target.value)
    if (error) {
      setError('')
    }
  }

  /**
   * Handles priority dropdown changes.
   */
  function handlePriorityChange(event) {
    setPriority(event.target.value)
  }

  /**
   * Handles category dropdown changes.
   */
  function handleCategoryChange(event) {
    setCategory(event.target.value)
  }

  /**
   * Handles form submission.
   * Validates the task and calls the parent handler if valid.
   */
  function handleSubmit(event) {
    event.preventDefault()

    const validation = validateNewTask(taskName, tasks)

    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    // Create new task object with priority and category
    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    onAddTask(newTask)
    setTaskName('')
    setPriority('medium')
    setCategory('general')
    setError('')
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={taskName}
            onChange={handleInputChange}
            placeholder="Enter a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Task name input"
            data-testid="task-input"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            data-testid="add-task-button"
          >
            Add Task
          </button>
        </div>

        {/* Priority and Category Dropdowns */}
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={handlePriorityChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
            aria-label="Task priority"
            data-testid="task-priority"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            value={category}
            onChange={handleCategoryChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm"
            aria-label="Task category"
            data-testid="task-category"
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-1" role="alert" data-testid="error-message">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

export default TaskForm

