/**
 * Validation utilities for TaskBuddy.
 * These are pure functions, making them easy to test with Vitest.
 */

/**
 * Checks if a task name is empty or contains only whitespace.
 * @param {string} taskName - The task name to validate
 * @returns {boolean} - True if the task name is empty
 */
export function isTaskEmpty(taskName) {
  return !taskName || taskName.trim().length === 0
}

/**
 * Checks if a task with the given name already exists in the task list.
 * @param {string} taskName - The task name to check
 * @param {Array} tasks - The existing tasks array
 * @returns {boolean} - True if a duplicate exists
 */
export function isDuplicateTask(taskName, tasks) {
  if (!tasks || !Array.isArray(tasks)) return false
  const normalizedName = taskName.trim().toLowerCase()
  return tasks.some(
    (task) => task.name.trim().toLowerCase() === normalizedName
  )
}

/**
 * Validates a new task against all rules.
 * Returns an object with isValid flag and error message.
 * @param {string} taskName - The task name to validate
 * @param {Array} tasks - The existing tasks array
 * @returns {Object} - { isValid: boolean, error: string | null }
 */
export function validateNewTask(taskName, tasks) {
  if (isTaskEmpty(taskName)) {
    return {
      isValid: false,
      error: 'Task name cannot be empty. Please enter a valid task.',
    }
  }

  if (isDuplicateTask(taskName, tasks)) {
    return {
      isValid: false,
      error: 'A task with this name already exists. Please use a different name.',
    }
  }

  return {
    isValid: true,
    error: null,
  }
}

