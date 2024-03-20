import axios from 'axios'

const instance = axios.create({
  baseURL: 'localhost:8080/',
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
