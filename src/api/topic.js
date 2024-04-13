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

export const getLike = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post('/getLike', param)
}
export const LikeOrDislike = (id, like) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('like', like)
  return request.post('/like', param)
}

export const appendComment = (id, content, code) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('content', content)
  param.append('code', code)
  return request.post('/appendComment', param)
}


export const deleteComment = (id,date) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('date', date)
  return request.post('/deleteComment', param)
}


export const appendTopic = (data)=>request.post('/appendTopic',data)


export const isPromiseToEdit = (id)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post('/isPromiseToEdit',param)
}


export const hasPromiseToEdit = (id)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post('/hasToPromiseToEdit',param)
}


export const editTopic = (data)=>request.post('/editTopic',data)


export const deleteTopic = (id)=> {
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post('/deleteTopic',param)
}


export const searchTopic = (key,classification,page)=>{
  let param = new URLSearchParams()
  param.append('key',key)
  param.append('classification',classification)
  param.append('page',page)
  return request.post('/search',param)
}