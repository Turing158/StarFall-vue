import axios from 'axios'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 3000,
  withCredentials: true
})

request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = userStore.token
  }
  return config
})

export default request
