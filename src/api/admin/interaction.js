import request, { url } from '@/util/request'

const urlHead = '/starfall/console/admin'

export const findAllUserNotice = (user,page, type) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('page', page)
  param.append('type', type)
  return request.post(urlHead + '/userNotice/find', param)
}

export const insertUserNotice = (userNoticeAdminVO) =>
  request.post(urlHead + '/userNotice/insert', userNoticeAdminVO)

export const updateUserNotice = (userNoticeAdminVO) =>
  request.post(urlHead + '/userNotice/update', userNoticeAdminVO)

export const updateUserNoticeRead = (id, isRead) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('isRead', isRead)
  return request.post(urlHead + '/userNotice/read', param)
}

export const deleteUserNotice = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/userNotice/delete', param)
}

export const findAllFriendApplication = (user,page) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('page', page)
  return request.post(urlHead + '/friendApplication/find', param)
}

export const insertFriendApplication = (friendApplication) =>
  request.post(urlHead + '/friendApplication/insert', friendApplication)

export const updateFriendApplication = (friendApplication) =>
  request.post(urlHead + '/friendApplication/update', friendApplication)

export const deleteFriendApplication = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/friendApplication/delete', param)
}

export const findAllFriendRelation = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post(urlHead + '/friendRelation/find', param)
}

export const insertFriendRelation = (friendRelationAdminVO) =>
  request.post(urlHead + '/friendRelation/insert', friendRelationAdminVO)

export const updateFriendRelation = (friendRelationAdminVO) =>
  request.post(urlHead + '/friendRelation/update', friendRelationAdminVO)

export const deleteFriendRelation = (id, isDeleteOtherRelation) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('isDeleteOtherRelation', isDeleteOtherRelation)
  return request.post(urlHead + '/friendRelation/delete', param)
}
