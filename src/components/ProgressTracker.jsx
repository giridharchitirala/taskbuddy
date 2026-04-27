/**
 * ProgressTracker Component
 * Displays the completion progress as a percentage and visual progress bar.
 * Recalculates in real-time as tasks are completed.
 */
function ProgressTracker({ tasks }) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length

  // Calculate percentage, avoid division by zero
  const percentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  // Determine color based on progress
  function getProgressColor(percent) {
    if (percent === 0) return 'bg-gray-300'
    if (percent < 30) return 'bg-red-500'
    if (percent < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Progress</h3>
        <span
          className="text-lg font-bold text-primary-600"
          data-testid="progress-percentage"
        >
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full transition-all duration-300 ease-in-out ${getProgressColor(
            percentage
          )}`}
          style={{ width: `${percentage}%` }}
          data-testid="progress-bar"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      {/* Task Count Summary */}
      <div className="flex justify-between text-sm text-gray-600">
        <span data-testid="completed-count">
          {completedTasks} of {totalTasks} completed
        </span>
        <span data-testid="remaining-count">
          {totalTasks - completedTasks} remaining
        </span>
      </div>
    </div>
  )
}

export default ProgressTracker

