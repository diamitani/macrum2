
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  serializer?: {
    serialize: (value: T) => string
    deserialize: (value: string) => T
  }
) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default serializer
  const defaultSerializer = {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  }

  const { serialize, deserialize } = serializer || defaultSerializer

  // Load value from localStorage on mount
  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(deserialize(item))
      }
    } catch (err) {
      setError(`Failed to load ${key} from storage`)
      console.error(`Error loading ${key} from localStorage:`, err)
    } finally {
      setIsLoading(false)
    }
  }, [key, deserialize])

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(key, serialize(storedValue))
        setError(null)
      } catch (err) {
        setError(`Failed to save ${key} to storage`)
        console.error(`Error saving ${key} to localStorage:`, err)
      }
    }
  }, [key, storedValue, serialize, isLoading])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
    } catch (err) {
      setError(`Failed to set ${key}`)
      console.error(`Error setting ${key}:`, err)
    }
  }

  return [storedValue, setValue, { isLoading, error }] as const
}
