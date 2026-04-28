function PinnedTasks({ tasks, onToggleComplete, onDeleteTask, onEditTask, onToggleSubtask, darkMode }) {
  const pinned = tasks.filter((t) => t.pinned && !t.completed)
  if (pinned.length === 0) return null

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'

  return (
    <div className={`rounded-xl border p-4 mb-4 ${cardBg}`}>
      <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>📌 Pinned Tasks</h3>
      <ul className="space-y-2">
        {pinned.map((task) => (
          <li key={task.id} className={`flex items-center justify-between p-2 rounded border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleComplete(task.id)}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <span className={`text-sm ${textMain}`}>{task.name}</span>
            </div>
            <button
              onClick={() => onEditTask(task.id, { pinned: false })}
              className={`text-xs px-2 py-1 rounded ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Unpin
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PinnedTasks

