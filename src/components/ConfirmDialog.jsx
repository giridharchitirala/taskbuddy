function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, darkMode }) {
  if (!isOpen) return null

  const overlay = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4'
  const card = `w-full max-w-sm p-6 rounded-xl border shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'}`

  return (
    <div className={overlay}>
      <div className={card}>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog

