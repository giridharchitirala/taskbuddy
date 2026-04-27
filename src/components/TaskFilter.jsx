import { useState } from 'react'

function TaskFilter({ searchQuery, onSearchChange, filterPriority, onFilterPriorityChange, filterCategory, onFilterCategoryChange, sortBy, onSortChange, darkMode }) {
  const inputClass = darkMode
    ? 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 border-gray-600 text-gray-100'
    : 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white border-gray-300 text-gray-800'

  const selectClass = darkMode
    ? 'px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 border-gray-600 text-gray-100'
    : 'px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white border-gray-300 text-gray-800'

  const textClass = darkMode ? 'text-gray-300' : 'text-gray-700'

  return (
    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-opacity-50 rounded-lg border border-opacity-50">
      <div className="mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className={'w-full ' + inputClass}
        />
      </div>
      <div className="flex gap-2 mb-3">
        <select value={filterPriority} onChange={(e) => onFilterPriorityChange(e.target.value)} className={'flex-1 ' + selectClass}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={filterCategory} onChange={(e) => onFilterCategoryChange(e.target.value)} className={'flex-1 ' + selectClass}>
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className={'text-sm ' + textClass}>Sort by:</span>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={'flex-1 ' + selectClass}>
          <option value="createdAt">Date Created</option>
          <option value="name">Name</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>
    </div>
  )
}

export default TaskFilter
