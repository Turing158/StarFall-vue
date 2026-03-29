import api, { url } from '@/util/request'

const urlHead = '/starfall/console/admin'

export const findAllUserNotice = (user,page, type) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('page', page)
  param.append('type', type)
  return api.post(urlHead + '/userNotice/find', param)
}

export const insertUserNotice = (userNoticeAdminVO) =>
  api.post(urlHead + '/userNotice/insert', userNoticeAdminVO)

export const updateUserNotice = (userNoticeAdminVO) =>
  api.post(urlHead + '/userNotice/update', userNoticeAdminVO)

export const updateUserNoticeRead = (id, isRead) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('isRead', isRead)
  return api.post(urlHead + '/userNotice/read', param)
}

export const deleteUserNotice = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/userNotice/delete', param)
}

export const findAllFriendApplication = (user,page) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('page', page)
  return api.post(urlHead + '/friendApplication/find', param)
}

export const insertFriendApplication = (friendApplication) =>
  api.post(urlHead + '/friendApplication/insert', friendApplication)

export const updateFriendApplication = (friendApplication) =>
  api.post(urlHead + '/friendApplication/update', friendApplication)

export const deleteFriendApplication = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/friendApplication/delete', param)
}

export const findAllFriendRelation = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return api.post(urlHead + '/friendRelation/find', param)
}

export const insertFriendRelation = (friendRelationAdminVO) =>
  api.post(urlHead + '/friendRelation/insert', friendRelationAdminVO)

export const updateFriendRelation = (friendRelationAdminVO) =>
  api.post(urlHead + '/friendRelation/update', friendRelationAdminVO)

export const deleteFriendRelation = (id, isDeleteOtherRelation) => {
  let param = new URLSearchParams()
  param.append('id', id)
  param.append('isDeleteOtherRelation', isDeleteOtherRelation)
  return api.post(urlHead + '/friendRelation/delete', param)
}
