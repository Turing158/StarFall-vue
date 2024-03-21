import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000
})

instance.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    ElMessage({
      message: '服务异常',
      type: 'error'
    })
    return Promise.reject(err)
  }
)

export default instance
