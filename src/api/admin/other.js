import api from '@/util/request'

const urlHead = '/starfall/console'
const urlActuator = '/admin/actuator'

export const getHealth = () => api.get(urlActuator + '/health')

const metrics = '/metrics'
export const getRequestActive = () =>
  api.get(urlActuator + metrics + '/spring.security.http.secured.requests.active')
export const getJVMMemoryUsed = () => api.get(urlActuator + metrics + '/jvm.memory.used')
export const getJVMMemoryTotal = () => api.get(urlActuator + metrics + '/jvm.memory.max')
export const getCPUUsed = () => api.get(urlActuator + metrics + '/system.cpu.usage')

export const getTopImgs = () => api.post(urlHead + '/other/findAllTopImgInfo')
export const uploadTopImg = (imgBase64) => {
  let param = new URLSearchParams()
  param.append('imgBase64', imgBase64)
  return api.post(urlHead + '/other/uploadTopImg', param)
}
export const upMoveTopImg = (imgName) => {
  let param = new URLSearchParams()
  param.append('imgName', imgName)
  return api.post(urlHead + '/other/upMoveTopImg', param)
}

export const downMoveTopImg = (imgName) => {
  let param = new URLSearchParams()
  param.append('imgName', imgName)
  return api.post(urlHead + '/other/downMoveTopImg', param)
}

export const deleteTopImg = (imgName) => {
  let param = new URLSearchParams()
  param.append('imgName', imgName)
  return api.post(urlHead + '/other/deleteTopImg', param)
}

export const getAdImg = () => api.post('/admin/other/findAllAdImgInfo')

export const uploadAdImg = (imgBase64) => {
  let param = new URLSearchParams()
  param.append('imgBase64', imgBase64)
  return api.post(urlHead + '/other/uploadAdImg', param)
}

export const upMoveAdImg = (imgName) => {
  let param = new URLSearchParams()
  param.append('imgName', imgName)
  return api.post(urlHead + '/other/upMoveAdImg', param)
}

export const downMoveAdImg = (imgName) => {
  let param = new URLSearchParams()
  param.append('imgName', imgName)
  return api.post(urlHead + '/other/downMoveAdImg', param)
}
export const deleteAdImg = (imgName) => {
  let param = new URLSearchParams()
  param.append('imgName', imgName)
  return api.post(urlHead + '/other/deleteAdImg', param)
}

export const getRedisStatus = () => api.get(urlHead + '/other/redis/status')
export const getNacosStatus = () => api.get(urlHead + '/other/nacos/status')
export const getMinioStatus = () => api.get(urlHead + '/other/minio/status')
export const getMinioBuckets = (bucketName, page, pageSize) => {
  let param = new URLSearchParams()
  param.append('bucketName', bucketName)
  param.append('startAfter', '')
  param.append('page', page)
  param.append('pageSize', pageSize)
  return api.post(urlHead + '/other/minio/buckets', param)
}

export const uploadMedalImg = (name, imgBase64) => {
  let param = new URLSearchParams()
  param.append('name', name)
  param.append('base64', imgBase64)
  return api.post(urlHead + '/other/uploadMedalImg', param)
}

export const getMedalImg = () => api.get(urlHead + '/other/getMedalImg')
