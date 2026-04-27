import { useState } from 'react'
import { validateNewTask } from '../utils/validation'

/**
 * TaskForm Component
 * Handles user input for adding new tasks with priority, category,
 * due date, description, subtasks, and tags.
 */
function TaskForm({ tasks, onAddTask, darkMode }) {
  const [taskName, setTaskName] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [subtaskInput, setSubtaskInput] = useState('')
  const [subtasks, setSubtasks] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  function handleInputChange(event) {
    setTaskName(event.target.value)
    if (error) setError('')
  }

  function handleAddSubtask() {
    if (!subtaskInput.trim()) return
    setSubtasks([...subtasks, { id: Date.now(), text: subtaskInput.trim(), completed: false }])
    setSubtaskInput('')
  }

  function handleRemoveSubtask(id) {
    setSubtasks(subtasks.filter((st) => st.id !== id))
  }

  function handleAddTag() {
    if (!tagInput.trim()) return
    if (tags.includes(tagInput.trim())) return
    setTags([...tags, tagInput.trim()])
    setTagInput('')
  }

  function handleRemoveTag(tag) {
    setTags(tags.filter((t) => t !== tag))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const validation = validateNewTask(taskName, tasks)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      description: description.trim() || null,
      subtasks: subtasks.length > 0 ? subtasks : [],
      tags: tags.length > 0 ? tags : [],
      completed: false,
      createdAt: new Date().toISOString(),
    }

    onAddTask(newTask)
    // Reset form
    setTaskName('')
    setPriority('medium')
    setCategory('general')
    setDueDate('')
    setDescription('')
    setSubtasks([])
    setTags([])
    setError('')
    setShowAdvanced(false)
  }

  const inputBase = `flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
    darkMode
      ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
  }`

  const selectBase = `flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-colors ${
    darkMode
      ? 'bg-gray-800 border-gray-600 text-gray-100'
      : 'bg-white border-gray-300 text-gray-800'
  }`

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Main Input Row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={taskName}
            onChange={handleInputChange}
            placeholder="Enter a new task..."
            className={inputBase}
            aria-label="Task name input"
            data-testid="task-input"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            data-testid="add-task-button"
          >
            Add Task
          </button>
        </div>

        {/* Priority and Category */}
        <div className="flex gap-2">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectBase} aria-label="Task priority" data-testid="task-priority">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectBase} aria-label="Task category" data-testid="task-category">
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`text-sm text-left underline ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}
        >
          {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
        </button>

        {showAdvanced && (
          <div className="flex flex-col gap-2 mt-1">
            {/* Due Date */}
            <div className="flex gap-2 items-center">
              <label className={`text-sm w-24 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`${inputBase} py-1.5 text-sm`}
                data-testid="task-due-date"
              />
            </div>

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={2}
              className={`${inputBase} resize-none text-sm`}
              data-testid="task-description"
            />

            {/* Tags */}
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag..."
                  className={`${inputBase} text-sm`}
                  data-testid="tag-input"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Add Tag
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-400 hover:text-red-600">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Subtasks */}
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  placeholder="Add a subtask..."
                  className={`${inputBase} text-sm`}
                  data-testid="subtask-input"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Add
                </button>
              </div>
              {subtasks.length > 0 && (
                <ul className="flex flex-col gap-1 mt-1">
                  {subtasks.map((st) => (
                    <li key={st.id} className={`flex justify-between items-center text-sm px-2 py-1 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{st.text}</span>
                      <button type="button" onClick={() => handleRemoveSubtask(st.id)} className="text-red-400 hover:text-red-600 text-xs">&times;</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm mt-1" role="alert" data-testid="error-message">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

export default TaskForm

