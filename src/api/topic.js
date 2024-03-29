import request from '@/util/request'

export const findAllTopic = (page, label, version) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('label', label)
  param.append('version', version)
  return request.post('/findAllTopic', param)
}

export const getTopicInfo = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post('/getTopicInfo', param)
}

export const findAllTopicByUser = (page, user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return request.post('/findAllTopicByUser', param)
}

export const findTopicVersion = () => request.post('/findTopicVersion')

export const findCommentByTopic = (id, page) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('page', page)
  return request.post('/findCommentByTopic', param)
}

export const getLike = (id, user) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('user', user)
  return request.post('/getLike', param)
}
export const LikeOrDislike = (id, user, like) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('user', user)
  param.append('like', like)
  return request.post('/like', param)
}

export const appendComment = (id, user, content, code) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('user', user)
  param.append('content', content)
  param.append('code', code)
  return request.post('/appendComment', param)
}
