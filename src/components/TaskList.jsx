/**
 * TaskList Component
 * Displays active (incomplete) tasks with toggle and delete functionality.
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
            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            data-testid={`task-item-${task.id}`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                aria-label={`Mark ${task.name} as complete`}
                data-testid={`toggle-task-${task.id}`}
              />
              <span
                className={`flex-1 ${
                  task.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-800'
                }`}
              >
                {task.name}
              </span>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Delete ${task.name}`}
              data-testid={`delete-task-${task.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList

