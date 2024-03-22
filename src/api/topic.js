import request from '@/util/request'

export const findAllTopic = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post('/findAllTopic', param)
}
