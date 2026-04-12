import api, { url } from '@/util/request'
const urlHead = '/topic'

export const findAllTopic = (page, label, version, belong) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('label', label)
  param.append('version', version)
  param.append('belong', belong)
  return api.post(urlHead + '/item/find', param)
}

export const getTopicInfo = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/info/find', param)
}

export const findAllTopicByUser = (page, user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return api.post(urlHead + '/user/find', param)
}

export const findCommentByTopic = (id, page) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('page', page)
  return api.post(urlHead + '/comment/find', param)
}

export const getLike = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/like/find', param)
}
export const LikeOrDislike = (id, like) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('like', like)
  return api.post(urlHead + '/like/update', param)
}

export const appendComment = (id, content, code) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('content', content)
  param.append('code', code)
  return api.post(urlHead + '/comment/insert', param)
}

export const deleteComment = (id, date) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('date', date)
  return api.post(urlHead + '/comment/delete', param)
}

export const appendTopic = (data) => api.post(urlHead + '/info/insert', data)

export const isPromiseToEdit = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/edit/promise', param)
}

export const hasPromiseToEdit = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/edit/find', param)
}

export const editTopic = (data) => api.post(urlHead + '/info/update', data)

export const deleteTopic = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/delete', param)
}

export const searchTopic = (key, classification, page) => {
  let param = new URLSearchParams()
  param.append('key', key)
  param.append('classification', classification)
  param.append('page', page)
  return api.post(urlHead + '/search', param)
}

export const adjustTopicDisplay = (id, reason, display) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('reason', reason)
  param.append('display', display)
  return api.post(urlHead + '/adjust', param)
}

export const adjustTopicDisplayAgain = (id, reason, display, noticeId) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('reason', reason)
  param.append('display', display)
  param.append('noticeId', noticeId)
  return api.post(urlHead + '/adjust/again', param)
}

export const completeAdjustTopic = (noticeId, topicId) => {
  let param = new URLSearchParams()
  param.append('topicId', topicId)
  param.append('noticeId', noticeId)
  return api.post(urlHead + '/adjust/complete', param)
}

export const findCollectStatus = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/collect/status', param)
}

export const findAllCollection = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return api.post(urlHead + '/collection/find', param)
}

export const findAllUserCollection = (page, user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return api.post(urlHead + '/collection/user/find', param)
}

export const setCollectionStatus = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/collect', param)
}

export const findFirstPublicTopic = () => api.post(urlHead + '/public/first/find')

export const findFirstRefreshTopic = () => api.post(urlHead + '/refresh/first/find')

export const findFirstCommentTopic = () => api.post(urlHead + '/comment/first/find')

export const getTopicContent = (user, id) =>
  api.get('/file/url/txt/user/' + user + '/topic/' + id + '/' + id + '.md')

export const getTopicGalleryUrl = (path) => url + '/file/url/origin/' + path

export const findTopicGallery = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/gallery/find', param)
}

export const uploadTopicGallery = (id, label, base64) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('label', label)
  param.append('imgBase64', base64)
  return api.post(urlHead + '/gallery/upload', param)
}

export const deleteTopicGallery = (id, topicId) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('topicId', topicId)
  return api.post(urlHead + '/gallery/delete', param)
}

export const topTopicComment = (comment) => api.post(urlHead + '/comment/top/update', comment)

export const getTopTopicComment = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/comment/top/find', param)
}

export const getTopicFile = (id) => {
  let param = new URLSearchParams()
  param.append('topicId', id)
  return api.post(urlHead + '/files/find', param)
}

export const uploadTopicFile = (file) => {
  let param = new URLSearchParams()
  param.append('id', file.id)
  param.append('fileName', file.fileName)
  param.append('fileLabel', file.fileLabel)
  param.append('fileBase64', file.fileBase64)
  return api.post(urlHead + '/files/upload', param)
}

export const deleteTopicFile = (id, topicId) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('topicId', topicId)
  return api.post(urlHead + '/files/delete', param)
}

export const downloadFile = (id) => {
  if (!id) {
    return
  }
  api
    .get('/file/url/download/' + id, {
      responseType: 'blob'
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const contentDisposition = res.headers['content-disposition']
      let filename = '未知文件'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
          filename = new TextDecoder('utf-8').decode(
            new Uint8Array([...filename].map((c) => c.charCodeAt(0)))
          )
        }
      }
      else{
        return
      }
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
}
