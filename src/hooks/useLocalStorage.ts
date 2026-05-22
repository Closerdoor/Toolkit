import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  const updateValue = useCallback((nextValue: T | ((current: T) => T)) => {
    setValue((current) =>
      typeof nextValue === 'function' ? (nextValue as (current: T) => T)(current) : nextValue,
    )
  }, [])

  return [value, updateValue] as const
}
