const DEV_API_URL = 'http://localhost:4242'

/** Backend base URL without a trailing slash. Set via VITE_API_URL (see .env.example). */
export const API_URL = (import.meta.env.VITE_API_URL || DEV_API_URL).replace(/\/+$/, '')
