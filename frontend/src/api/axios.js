import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    const data = error.response?.data
    let message = 'Une erreur est survenue. Veuillez réessayer.'
    if (!error.response) {
      message = 'Impossible de joindre le serveur.'
    } else if (data && typeof data === 'object') {
      message =
        data.detail ||
        Object.values(data).map((v) => (Array.isArray(v) ? v.join(' ') : String(v))).join(' ') ||
        message
    }
    error.friendlyMessage = message
    return Promise.reject(error)
  }
)

export default api
