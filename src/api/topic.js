import request, { url } from '@/util/request'
const urlHead = "/topic";

export const findAllTopic = (page, label, version,belong) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('label', label)
  param.append('version', version)
  param.append('belong', belong)
  return request.post(urlHead+'/findAllTopic', param)
}

export const getTopicInfo = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead+'/getTopicInfo', param)
}

export const findAllTopicByUser = (page, user) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user)
  return request.post(urlHead+'/findAllTopicByUser', param)
}

export const findCommentByTopic = (id, page) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('page', page)
  return request.post(urlHead+'/findCommentByTopic', param)
}

export const getLike = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead+'/getLike', param)
}
export const LikeOrDislike = (id, like) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('like', like)
  return request.post(urlHead+'/like', param)
}

export const appendComment = (id, content, code) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('content', content)
  param.append('code', code)
  return request.post(urlHead+'/appendComment', param)
}


export const deleteComment = (id,date) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('date', date)
  return request.post(urlHead+'/deleteComment', param)
}


export const appendTopic = (data)=>request.post(urlHead+'/appendTopic',data)


export const isPromiseToEdit = (id)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post(urlHead+'/isPromiseToEdit',param)
}


export const hasPromiseToEdit = (id)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post(urlHead+'/hasToPromiseToEdit',param)
}


export const editTopic = (data)=>request.post(urlHead+'/editTopic',data)


export const deleteTopic = (id)=> {
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post(urlHead+'/deleteTopic',param)
}


export const searchTopic = (key,classification,page)=>{
  let param = new URLSearchParams()
  param.append('key',key)
  param.append('classification',classification)
  param.append('page',page)
  return request.post(urlHead+'/search',param)
}

export const adjustTopicDisplay = (id,reason,display)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  param.append('reason',reason)
  param.append('display',display)
  return request.post(urlHead+'/adjustTopicDisplay',param)
}

export const findCollectStatus = (id)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post(urlHead+'/findCollectStatus',param)
}

export const findAllCollection = (page)=>{
  let param = new URLSearchParams()
  param.append('page',page)
  return request.post(urlHead+'/findAllCollection',param)
}

export const setCollectionStatus = (id)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post(urlHead+'/setCollectionStatus',param)
}

export const findFirstPublicTopic = ()=> request.post(urlHead+"/findFirstPublicTopic")

export const findFirstRefreshTopic = ()=> request.post(urlHead+"/findFirstRefreshTopic")  

export const findFirstCommentTopic = () => request.post(urlHead+"/findFirstCommentTopic")

export const getTopicContent = (user,id)=>request.get("/file/url/txt/user/"+user+"/topic/"+id+"/"+id+".md")

export const getTopicGalleryUrl = (path) => url+"/file/url/origin/"+path

export const findTopicGallery = (id) =>{
  let param = new URLSearchParams()
  param.append('id',id)
  return request.post(urlHead+"/findTopicGallery",param)
}

export const uploadTopicGallery = (id,label,base64)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  param.append('label',label)
  param.append('imgBase64',base64)
  return request.post(urlHead+"/uploadTopicGallery",param)
}

export const deleteTopicGallery = (id,topicId)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  param.append('topicId',topicId)
  return request.post(urlHead+"/deleteTopicGallery",param)
}

export const topTopicComment = (comment)=>request.post(urlHead+"/topTopicComment",comment)

export const getTopicFile = (id)=>{
  let param = new URLSearchParams()
  param.append('topicId',id)
  return request.post(urlHead+"/findTopicFiles",param)
}

export const uploadTopicFile = (file)=>{
  let param = new URLSearchParams()
  param.append('id',file.id)
  param.append('fileName',file.fileName)
  param.append('fileLabel',file.fileLabel)
  param.append('fileBase64',file.fileBase64)
  return request.post(urlHead+"/uploadTopicFile",param)
}

export const deleteTopicFile = (id,topicId)=>{
  let param = new URLSearchParams()
  param.append('id',id)
  param.append('topicId',topicId)
  return request.post(urlHead+"/deleteTopicFile",param)
}

export const downloadFile = (id)=> window.open(url+"/file/url/download/"+id)