import request from '@/util/request'

export const findAllTopic = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post('/findAllTopic', param)
}

export const getTopicInfo = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post('/getTopicInfo', param)
}

export const findAllTopicByUser = (page,user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return request.post('/findAllTopicByUser', param)
}
