// API configuration utility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Debug logging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API_BASE_URL:', API_BASE_URL)
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
}

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: `${API_BASE_URL}/auth/register`,
      login: `${API_BASE_URL}/auth/login`,
      logout: `${API_BASE_URL}/auth/logout`,
    },
    users: `${API_BASE_URL}/users`,
    vendors: `${API_BASE_URL}/vendors`,
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
    orders: `${API_BASE_URL}/orders`,
    cart: `${API_BASE_URL}/cart`,
    dropshipping: `${API_BASE_URL}/dropshipping`,
  }
}

// Helper function for making API requests
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    // Handle network errors and other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the server is running.')
    }
    throw error
  }
}

// Logout utility function
export const logout = async () => {
  try {
    // Call logout endpoint to clear server-side session/cookie
    await apiRequest(apiConfig.endpoints.auth.logout, {
      method: 'POST',
    })
  } catch (error) {
    // Even if the server request fails, we should still clear local storage
    console.error('Logout request failed:', error)
  } finally {
    // Always clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to home page
      window.location.href = '/'
    }
  }
}
