import { useState, useEffect } from 'react'

/**
 * Custom hook to synchronize state with localStorage.
 * 
 * @param {string} key - The localStorage key to use
 * @param {any} initialValue - Default value if localStorage is empty
 * @returns {[any, Function]} - Tuple of stored value and setter function
 * 
 * How it works:
 * 1. On initial mount, reads from localStorage. If empty, uses initialValue.
 * 2. Whenever the state changes, useEffect updates localStorage.
 * 3. Uses JSON.parse/stringify to handle complex data types (objects, arrays).
 * 4. Wrapped in try/catch to handle storage quota errors or private mode.
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state with a function to avoid reading localStorage on every render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      // Parse stored json or return initialValue if nothing stored
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // useEffect to update localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

