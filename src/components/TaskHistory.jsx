/**
 * TaskHistory Component
 * Displays completed tasks with options to restore to active or permanently delete.
 */
function TaskHistory({ tasks, onRestoreTask, onPermanentDelete }) {
  // Filter only completed tasks
  const completedTasks = tasks.filter((task) => task.completed)

  /**
   * Handles restoring a task to active status.
   */
  function handleRestore(taskId) {
    onRestoreTask(taskId)
  }

  /**
   * Handles permanently deleting a task from history.
   */
  function handlePermanentDelete(taskId) {
    onPermanentDelete(taskId)
  }

  if (completedTasks.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Task History
        </h2>
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p>No completed tasks yet.</p>
          <p className="text-sm mt-1">Complete a task to see it here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Task History ({completedTasks.length})
      </h2>
      <ul className="space-y-2" data-testid="task-history-list">
        {completedTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-75 hover:opacity-100 transition-opacity"
            data-testid={`history-item-${task.id}`}
          >
            <div className="flex items-center gap-3 flex-1">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="flex-1 line-through text-gray-500">
                {task.name}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRestore(task.id)}
                className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={`Restore ${task.name}`}
                data-testid={`restore-task-${task.id}`}
              >
                Restore
              </button>
              <button
                onClick={() => handlePermanentDelete(task.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Permanently delete ${task.name}`}
                data-testid={`permanent-delete-task-${task.id}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskHistory

