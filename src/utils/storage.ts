/**
 * Local storage utilities with type safety
 */

export const storage = {
  /**
   * Get item from local storage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error)
      return defaultValue || null
    }
  },

  /**
   * Set item in local storage
   */
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error)
    }
  },

  /**
   * Remove item from local storage
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error)
    }
  },

  /**
   * Clear all items from local storage
   */
  clear: (): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage', error)
    }
  },
}

/**
 * Session storage utilities
 */
export const sessionStorage = {
  /**
   * Get item from session storage
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error(`Error getting item from sessionStorage: ${key}`, error)
      return defaultValue || null
    }
  },

  /**
   * Set item in session storage
   */
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item in sessionStorage: ${key}`, error)
    }
  },

  /**
   * Remove item from session storage
   */
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from sessionStorage: ${key}`, error)
    }
  },

  /**
   * Clear all items from session storage
   */
  clear: (): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing sessionStorage', error)
    }
  },
}
