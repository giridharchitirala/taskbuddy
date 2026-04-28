import { useState } from 'react'

function TrashBin({ trash, onRestore, onPermanentDelete, darkMode }) {
  const [isOpen, setIsOpen] = useState(false)

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textMain = darkMode ? 'text-gray-100' : 'text-gray-800'
  const muted = darkMode ? 'text-gray-400' : 'text-gray-600'

  return (
    <div className={`rounded-xl border mb-4 overflow-hidden ${cardBg}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-4 py-3 text-left ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
      >
        <span className={`font-medium ${textMain}`}>🗑️ Trash ({trash.length})</span>
        <span className={`text-sm ${muted}`}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {trash.length === 0 ? (
            <p className={`text-sm ${muted}`}>Trash is empty</p>
          ) : (
            <ul className="space-y-2 mt-2">
              {trash.map((task) => (
                <li key={task.id} className={`flex justify-between items-center p-2 rounded border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <span className={`text-sm ${muted}`}>{task.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRestore(task)}
                      className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => onPermanentDelete(task.id)}
                      className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default TrashBin

