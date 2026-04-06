import api, { url } from '@/util/request'

const urlHead = '/user'

export const login = (account, password, code) => {
  let param = new URLSearchParams()
  param.append('account', account)
  param.append('password', password)
  param.append('code', code)
  return api.post(urlHead + '/login', param)
}

export const getUserInfo = () => api.post(urlHead + '/info/find')

export const getEmailCode = (email, isRegister) => {
  let param = new URLSearchParams()
  param.append('email', email)
  param.append('isRegister', isRegister)
  return api.post(urlHead + '/email/code', param) 
}

export const register = (user, password, email, emailCode, code) => {
  let param = new URLSearchParams()
  param.append('user', user)
  param.append('password', password)
  param.append('email', email)
  param.append('emailCode', emailCode)
  param.append('code', code)
  return api.post(urlHead + '/register', param)
}

export const checkForget = (email, emailCode, code) => {
  let param = new URLSearchParams()
  param.append('email', email)
  param.append('emailCode', emailCode)
  param.append('code', code)
  return api.post(urlHead + '/forget/password/check', param)
}

export const forgetPassword = (changeToken, password) => {
  let param = new URLSearchParams()
  param.append('changeToken', changeToken)
  param.append('password', password)
  return api.post(urlHead + '/forget/password/update', param)
}

export const findUserinfo = (user) => {
  let param = new URLSearchParams()
  param.append('user', user)
  return api.post(urlHead + '/info/user/find', param)
}

export const saveInfo = (name, gender, birthday, code) => {
  let param = new URLSearchParams()
  param.append('name', name)
  param.append('gender', gender)
  param.append('birthday', birthday)
  param.append('code', code)
  return api.post(urlHead + '/info/update', param)
}

export const settingPassword = (oldPassword, newPassword, code) => {
  let param = new URLSearchParams()
  param.append('oldPassword', oldPassword)
  param.append('newPassword', newPassword)
  param.append('code', code)
  return api.post(urlHead + '/password/update', param)
}

export const settingAvatar = (avatarBase64) => {
  let param = new URLSearchParams()
  param.append('avatarBase64', avatarBase64)
  return api.post(urlHead + '/avatar/update', param)
}

export const exit = () => api.post(urlHead + '/exit')

export const findAllSignIn = (page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  return api.post(urlHead + '/sign-in/find', param)
}

export const checkSignIn = () => api.post(urlHead + '/sign-in/check')

export const signIn = (msg, emotion) => {
  let param = new URLSearchParams()
  param.append('msg', msg)
  param.append('emotion', emotion)
  return api.post(urlHead + '/sign-in', param)
}

export const getOldEmailCode = () => api.post(urlHead + '/email/old/code')

export const getNewEmailCode = (newEmail) => {
  let param = new URLSearchParams()
  param.append('newEmail', newEmail)
  return api.post(urlHead + '/email/new/code', param)
}

export const updateEmail = (oldEmailCode, newEmail, newEmailCode) => {
  let param = new URLSearchParams()
  param.append('newEmail', newEmail)
  param.append('oldEmailCode', oldEmailCode)
  param.append('newEmailCode', newEmailCode)
  return api.post(urlHead + '/email/update', param)
}

export const hasPermission = () => api.post(urlHead + '/permission/admin')

export const isExpire = () => api.post(urlHead + '/login/expire')

export const getSelfPersonalized = () => api.post(urlHead + '/personalized/find')

export const updatePersonalized = (personlized) =>
  api.post(urlHead + '/personalized/update', personlized)

export const updateSignature = (signature, code) => {
  let param = new URLSearchParams()
  param.append('signature', signature)
  param.append('code', code)
  return api.post(urlHead + '/signature/update', param)
}

export const getMedalOnMenu = () => api.post(urlHead + '/medal/menu/find')

export const getMedalOnPerson = (user) => {
  let param = new URLSearchParams()
  param.append('user', user)
  return api.post(urlHead + '/medal/person/find', param)
}

export const getMedalOnAll = (user, page) => {
  let param = new URLSearchParams()
  param.append('page', page)
  param.append('user', user ? user : '')
  return api.post(urlHead + '/medals/find', param)
}

export const getMedalById = (id) => {
  let param = new URLSearchParams()
  param.append('id', id)
  return api.post(urlHead + '/medal/find', param)
}
//获取链接，但是只保留域名
const getAvatarApi = url + '/file/url/origin/'
export const getAvatarSrc = (avatar) => {
  if(!avatar){
    return avatar
  }
  if(avatar.startsWith("http") || avatar.startsWith("https")){
        return avatar
    } else if(avatar.startsWith("/")) {
        return getAvatarApi + avatar.slice(1)
    }
    return getAvatarApi + avatar
}

export const getDeviceCode = () => api.post(urlHead + '/minecraft/code/get')

export const verifyDeviceCode = (deviceCode) => {
  let param = new URLSearchParams()
  param.append('deviceCode', deviceCode)
  return api.post(urlHead + '/minecraft/code/verify', param)
}

export const getMinecraftInfo = (token) => {
  let param = new URLSearchParams()
  param.append('minecraftToken', token)
  return api.post(urlHead + '/minecraft/verify', param)
}