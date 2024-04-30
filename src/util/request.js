import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

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

request.interceptors.response.use(res=>{
  let msg = res.data.msg
  if(msg == "NOT_PERMISSION"){
    ElMessage.error("权限不足，你想干嘛？")
  }
  return res
})
export default request
