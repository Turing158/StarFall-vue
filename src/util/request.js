import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

export const url = window.location.href.split("/").slice(0,3).join("/") + "/api"
export const getUrl = ()=>url
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

api.interceptors.response.use(res=>{
  let msg = res.data.msg
  if(msg == "NOT_PERMISSION"){
    ElMessage.error("权限不足，你想干嘛？")
  }
  return res
})

export const bilibiliApi = axios.create({
  baseURL: "/bilibiliApi",
  timeout: 10000,
  withCredentials: true
})

export const request = axios.create({
  timeout: 10000
})
export const minecraftApi = axios.create({
  baseURL: "/minecraftApi",
  timeout: 10000,
  withCredentials: true
})
export default api
