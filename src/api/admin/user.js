import request, { url } from '@/util/request'

const urlHead = '/starfall/console/user'

export const findAllUsersForSelect = (keyword) => {
  let param = new URLSearchParams()
  param.append('keyword', keyword)
  return request.post(urlHead + '/adminFindAllUsersForSelect', param)
}

export const findAllUser = (page, keyword) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('keyword', keyword)
  return request.post(urlHead + '/adminFindAllUsers', param)
}

export const insertUser = (user) => request.post(urlHead + '/adminInsertUser', user)

export const updateUser = (user) => request.post(urlHead + '/adminUpdateUser', user)

export const deleteUser = (user) => {
  let param = new URLSearchParams()
  param.append('user', user)
  return request.post(urlHead + '/adminDeleteUser', param)
}

export const updateAvatar = (user, avatar) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('avatar', avatar)
  return request.post(urlHead + '/adminUpdateAvatar', param)
}

export const findAllSignIn = (page, keyword) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('keyword', keyword)
  return request.post(urlHead + '/adminFindAllSignIn', param)
}

export const appendSignIn = (signIn) => request.post(urlHead + '/adminAppendSignIn', signIn)

export const updateSignIn = (signIn) => request.post(urlHead + '/adminUpdateSignIn', signIn)

export const deleteSignIn = (signIn) => request.post(urlHead + '/adminDeleteSignIn', signIn)

export const getAvatarApi = url + '/file/url/origin/'

export const findAllPersonalized = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post(urlHead + '/admin/personalized/find', param)
}

export const updatePersonalized = (userPersonalized) =>
  request.post(urlHead + '/admin/personalized/update', userPersonalized)

export const findAllMedalMapper = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post(urlHead + '/admin/medalMapper/find', param)
}

export const insertMedalMapper = (medalMapper) =>
  request.post(urlHead + '/admin/medalMapper/insert', medalMapper)

export const updateMedalMapper = (medalMapper) =>
  request.post(urlHead + '/admin/medalMapper/update', medalMapper)

export const deleteMedalMapper = (user, id) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('id', id)
  return request.post(urlHead + '/admin/medalMapper/delete', param)
}

export const findAllMedal = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return request.post(urlHead + '/admin/medal/find', param)
}

export const insertMedal = (medal) => request.post(urlHead + '/admin/medal/insert', medal)

export const updateMedal = (medal) => request.post(urlHead + '/admin/medal/update', medal)

export const deleteMedal = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return request.post(urlHead + '/admin/medal/delete', param)
}
