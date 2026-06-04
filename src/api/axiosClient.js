import axios from 'axios'
import { clearSessionAndRedirect, getStoredToken } from '../features/auth/authSession'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status

    if (statusCode === 401 || statusCode === 403) {
      clearSessionAndRedirect()
    }

    return Promise.reject(error)
  },
)

export default axiosClient
