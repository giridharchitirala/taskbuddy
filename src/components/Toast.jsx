function Toast({ toasts, onRemove, darkMode }) {
  if (toasts.length === 0) return null

  const base = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
  const getStyles = (type) => {
    switch (type) {
      case 'success': return darkMode ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-300'
      case 'error': return darkMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-300'
      case 'warning': return darkMode ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return darkMode ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'
    }
  }

  return (
    <div className={base}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg border shadow-lg min-w-[240px] flex justify-between items-center ${getStyles(toast.type)}`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-3 text-lg leading-none opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default Toast

