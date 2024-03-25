import request from '@/util/request'

export const findAllTopic = (page,label,version) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('label',label)
  param.append('version',version)
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


export const findTopicVersion = ()=>request.post('/findTopicVersion')