function ExportImport({ tasks, onImport, darkMode }) {
  function handleExport() {
    const dataStr = JSON.stringify(tasks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `taskbuddy-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  function handleImport(event) {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result)
        if (Array.isArray(importedTasks)) {
          onImport(importedTasks)
        } else {
          alert('Invalid file format. Expected an array of tasks.')
        }
      } catch (error) {
        alert('Error parsing JSON file.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const buttonClass = darkMode
    ? 'px-3 py-1.5 text-sm rounded-md border transition-colors bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
    : 'px-3 py-1.5 text-sm rounded-md border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50'

  return (
    <div className="flex gap-2 justify-end mb-4">
      <button onClick={handleExport} className={buttonClass} data-testid="export-button">
        Export JSON
      </button>
      <label className={`cursor-pointer ${buttonClass}`}>
        Import JSON
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          data-testid="import-input"
        />
      </label>
    </div>
  )
}

export default ExportImport

