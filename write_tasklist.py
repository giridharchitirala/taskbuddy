import os

content = r'''import { useState } from 'react'

function TaskList({ tasks, allTasks, onToggleComplete, onDeleteTask, onEditTask, onToggleSubtask, darkMode }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPriority, setEditPriority] = useState('medium')
  const [editCategory, setEditCategory] = useState('general')
  const [editDueDate, setEditDueDate] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const activeTasks = tasks.filter((task) => !task.completed)

  function handleToggle(taskId) { onToggleComplete(taskId) }
  function handleDelete(taskId) { onDeleteTask(taskId) }

  function startEdit(task) {
    setEditingId(task.id)
    setEditName(task.name)
    setEditPriority(task.priority || 'medium')
    setEditCategory(task.category || 'general')
    setEditDueDate(task.dueDate || '')
    setEditDescription(task.description || '')
  }

  function saveEdit(taskId) {
    onEditTask(taskId, {
      name: editName.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || null,
      description: editDescription.trim() || null,
    })
    setEditingId(null)
  }

  function cancelEdit() { setEditingId(null) }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  function getCategoryColor(category) {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'personal': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'shopping': return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'health': return 'bg-teal-100 text-teal-700 border-teal-200'
      case 'education': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  function isOverdue(dueDate) {
    if (!dueDate) return false
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0)
  }

  const cardClass = darkMode
    ? 'flex flex-col p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-800 border-gray-700'
    : 'flex flex-col p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white border-gray-200'

  const textClass = darkMode ? 'text-gray-100' : 'text-gray-800'
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-500'
  const tagClass = darkMode
    ? 'text-xs px-2 py-0.5 rounded-full border bg-gray-700 text-gray-300 border-gray-600'
    : 'text-xs px-2 py-0.5 rounded-full border bg-gray-200 text-gray-600 border-gray-300'

  function getStrikeClass(completed) {
    if (completed) return darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
    return darkMode ? 'text-gray-300' : 'text-gray-700'
  }

  if (activeTasks.length === 0) {
    const emptyClass = darkMode ? 'text-center py-8 text-gray-400' : 'text-center py-8 text-gray-500'
    return (
      <div className={emptyClass} data-testid="empty-task-list">
        <p className="text-lg">No active tasks!</p>
        <p className="text-sm mt-1">Add a task above to get started.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className={'text-xl font-semibold mb-4 ' + textClass}>
        Active Tasks ({activeTasks.length})
      </h2>
      <ul className="space-y-2" data-testid="task-list">
        {activeTasks.map((task) => (
          <li key={task.id} className={cardClass} data-testid={'task-item-' + task.id}>
            {editingId === task.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={'px-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 ' + (darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-800')}
                />
                <div className="flex gap-2">
                  <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className={'flex-1 px-2 py-1 border rounded text-sm ' + (darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={'flex-1 px-2 py-1 border rounded text-sm ' + (darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}>
                    <option value="general">General</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className={'px-2 py-1 border rounded text-sm ' + (darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description..."
                  rows={2}
                  className={'px-2 py-1 border rounded text-sm resize-none ' + (darkMode ? 'bg-gray-900 border-gray-600 text-gray-100' : 'bg-white border-gray-300')}
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => saveEdit(task.id)} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">Save</button>
                  <button onClick={cancelEdit} className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600">Cancel</button>
                </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                      aria-label={'Mark ' + task.name + ' as complete'}
                      data-testid={'toggle-task-' + task.id}
                    />
                    <span className={'flex-1 ' + textClass}>{task.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(task)}
                      className={'px-2 py-1 text-sm rounded-md transition-colors ' + (darkMode ? 'text-primary-400 hover:bg-gray-700' : 'text-primary-600 hover:bg-primary-50')}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className={'px-2 py-1 text-sm rounded-md transition-colors ' + (darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50')}
                      data-testid={'delete-task-' + task.id}
                    >
                      Delete
                    </button>
                  </div>
                {task.description && (
                  <p className={'ml-8 text-sm ' + mutedClass}>{task.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1 ml-8">
                  {task.priority && (
                    <span className={'text-xs px-2 py-0.5 rounded-full border ' + getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  )}
                  {task.category && (
                    <span className={'text-xs px-2 py-0.5 rounded-full border ' + getCategoryColor(task.category)}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className={'text-xs px-2 py-0.5 rounded-full border ' + (isOverdue(task.dueDate) ? 'bg-red-100 text-red-700 border-red-200' : 'bg-blue-100 text-blue-700 border-blue-200')}>
                      {(isOverdue(task.dueDate) ? 'Overdue: ' : 'Due: ') + new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.tags?.map((tag) => (
                    <span key={tag} className={tagClass}>
                      {'#' + tag}
                    </span>
                  ))}
                </div>
                {task.subtasks && task.subtasks.length > 0 && (
                  <ul className="ml-8 mt-2 space-y-1">
                    {task.subtasks.map((st) => (
                      <li key={st.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => onToggleSubtask(task.id, st.id)}
                          className="w-4 h-4 text-primary-600 rounded cursor-pointer"
                        />
                        <span className={'text-sm ' + getStrikeClass(st.completed)}>
                          {st.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList
'''

with open('src/components/TaskList.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
