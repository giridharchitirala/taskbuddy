/**
 * TaskList Component
 * Displays active (incomplete) tasks with toggle, delete, priority, and category.
 */
function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  // Filter only incomplete tasks
  const activeTasks = tasks.filter((task) => !task.completed)

  /**
   * Handles toggling a task's completion status.
   */
  function handleToggle(taskId) {
    onToggleComplete(taskId)
  }

  /**
   * Handles deleting a task.
   */
  function handleDelete(taskId) {
    onDeleteTask(taskId)
  }

  /**
   * Returns color classes based on priority.
   */
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  /**
   * Returns color classes based on category.
   */
  function getCategoryColor(category) {
    switch (category) {
      case 'work':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'personal':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'shopping':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'health':
        return 'bg-teal-100 text-teal-700 border-teal-200'
      case 'education':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (activeTasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" data-testid="empty-task-list">
        <p className="text-lg">No active tasks!</p>
        <p className="text-sm mt-1">Add a task above to get started.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Active Tasks ({activeTasks.length})
      </h2>
      <ul className="space-y-2" data-testid="task-list">
        {activeTasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            data-testid={`task-item-${task.id}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                  aria-label={`Mark ${task.name} as complete`}
                  data-testid={`toggle-task-${task.id}`}
                />
                <span className="flex-1 text-gray-800">{task.name}</span>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Delete ${task.name}`}
                data-testid={`delete-task-${task.id}`}
              >
                Delete
              </button>
            </div>
            {/* Priority and Category Badges */}
            <div className="flex gap-2 mt-2 ml-8">
              {task.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}
                  data-testid={`task-priority-${task.id}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}
              {task.category && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}
                  data-testid={`task-category-${task.id}`}
                >
                  {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList

