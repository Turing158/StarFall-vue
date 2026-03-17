import request, { url } from '@/util/request'
const urlHead = '/topic'

export const findAllTopic = (page, label, version, belong) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('label', label)
  param.append('version', version)
  param.append('belong', belong)
  return request.post(urlHead + '/item/find', param)
}

export const getTopicInfo = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/info/find', param)
}

export const findAllTopicByUser = (page, user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return request.post(urlHead + '/user/find', param)
}

export const findCommentByTopic = (id, page) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('page', page)
  return request.post(urlHead + '/comment/find', param)
}

export const getLike = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/like/find', param)
}
export const LikeOrDislike = (id, like) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('like', like)
  return request.post(urlHead + '/like/update', param)
}

export const appendComment = (id, content, code) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('content', content)
  param.append('code', code)
  return request.post(urlHead + '/comment/insert', param)
}

export const deleteComment = (id, date) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('date', date)
  return request.post(urlHead + '/comment/delete', param)
}

export const appendTopic = (data) => request.post(urlHead + '/info/insert', data)

export const isPromiseToEdit = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/edit/promise', param)
}

export const hasPromiseToEdit = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/edit/find', param)
}

export const editTopic = (data) => request.post(urlHead + '/info/update', data)

export const deleteTopic = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/delete', param)
}

export const searchTopic = (key, classification, page) => {
  let param = new URLSearchParams()
  param.append('key', key)
  param.append('classification', classification)
  param.append('page', page)
  return request.post(urlHead + '/search', param)
}

export const adjustTopicDisplay = (id, reason, display) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('reason', reason)
  param.append('display', display)
  return request.post(urlHead + '/adjust', param)
}

export const adjustTopicDisplayAgain = (id, reason, display, noticeId) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('reason', reason)
  param.append('display', display)
  param.append('noticeId', noticeId)
  return request.post(urlHead + '/adjust/again', param)
}

export const completeAdjustTopic = (noticeId ,topicId) => {
  let param = new URLSearchParams()
  param.append('topicId', topicId)
  param.append('noticeId', noticeId)
  return request.post(urlHead + '/adjust/complete', param)
}

export const findCollectStatus = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/collect/status', param)
}

export const findAllCollection = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post(urlHead + '/collection/find', param)
}

export const findAllUserCollection = (page, user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return request.post(urlHead + '/collection/user/find', param)
}

export const setCollectionStatus = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/collect', param)
}

export const findFirstPublicTopic = () => request.post(urlHead + '/public/first/find')

export const findFirstRefreshTopic = () => request.post(urlHead + '/refresh/first/find')

export const findFirstCommentTopic = () => request.post(urlHead + '/comment/first/find')

export const getTopicContent = (user, id) =>
  request.get('/file/url/txt/user/' + user + '/topic/' + id + '/' + id + '.md')

export const getTopicGalleryUrl = (path) => url + '/file/url/origin/' + path

export const findTopicGallery = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/gallery/find', param)
}

export const uploadTopicGallery = (id, label, base64) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('label', label)
  param.append('imgBase64', base64)
  return request.post(urlHead + '/gallery/upload', param)
}

export const deleteTopicGallery = (id, topicId) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('topicId', topicId)
  return request.post(urlHead + '/gallery/delete', param)
}

export const topTopicComment = (comment) => request.post(urlHead + '/comment/top', comment)

export const getTopicFile = (id) => {
  let param = new URLSearchParams()
  param.append('topicId', id)
  return request.post(urlHead + '/files/find', param)
}

export const uploadTopicFile = (file) => {
  let param = new URLSearchParams()
  param.append('id', file.id)
  param.append('fileName', file.fileName)
  param.append('fileLabel', file.fileLabel)
  param.append('fileBase64', file.fileBase64)
  return request.post(urlHead + '/files/upload', param)
}

export const deleteTopicFile = (id, topicId) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('topicId', topicId)
  return request.post(urlHead + '/files/delete', param)
}

export const downloadFile = (id) => {
  if(!id){
    return
  }
  window.open(url + '/file/url/download/' + id)
}
