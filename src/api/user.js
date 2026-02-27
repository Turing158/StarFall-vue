import request, { url } from '@/util/request'

const urlHead = "/user";

export const login = (account,password,code)=>{
    let param = new URLSearchParams()
    param.append('account',account)
    param.append('password',password)
    param.append('code',code)
    return request.post(urlHead+'/login',param)
}

export const getUserInfo = ()=>request.post(urlHead+'/getUserInfo')

export const getEmailCode = (email,isRegister)=>{
    let param = new URLSearchParams()
    param.append('email',email)
    param.append('isRegister',isRegister)
    return request.post(urlHead+'/getEmailCode',param)
}


export const register = (user,password,email,emailCode,code)=>{
    let param = new URLSearchParams()
    param.append('user',user)
    param.append('password',password)
    param.append('email',email)
    param.append('emailCode',emailCode)
    param.append('code',code)
    return request.post(urlHead+'/register',param)
}


export const checkForget = (email,emailCode,code)=>{
    let param = new URLSearchParams()
    param.append('email',email)
    param.append('emailCode',emailCode)
    param.append('code',code)
    return request.post(urlHead+'/checkForgetPassword',param)
}

export const forgetPassword = (changeToken,password)=>{
    let param = new URLSearchParams()
    param.append('changeToken',changeToken)
    param.append('password',password)
    return request.post(urlHead+'/forgetPassword',param)
}

export const findUserinfo = (user)=>{
    let param = new URLSearchParams()
    param.append('user',user)
    return request.post(urlHead+'/findUserByUser',param)
}


export const saveInfo = (name,gender,birthday,code)=>{
    let param = new URLSearchParams()
    param.append('name',name)
    param.append('gender',gender)
    param.append('birthday',birthday)
    param.append('code',code)
    return request.post(urlHead+'/updateUserInfo',param)
}


export const settingPassword = (oldPassword,newPassword,code)=>{
    let param = new URLSearchParams()
    param.append('oldPassword',oldPassword)
    param.append('newPassword',newPassword)
    param.append('code',code)
    return request.post(urlHead+'/updatePassword',param)
}

export const settingAvatar = (avatarBase64)=>{
    let param = new URLSearchParams()
    param.append('avatarBase64',avatarBase64)
    return request.post(urlHead+'/updateAvatar',param)
}

export const exit = ()=>request.post(urlHead+'/exit')


export const findAllSignIn = (page)=>{
    let param = new URLSearchParams()
    param.append('page',page)
    return request.post(urlHead+'/findAllSignIn',param)
}


export const countSignIn = ()=>request.post(urlHead+'/countAllSignIn')


export const signIn = (msg,emotion)=>{
    let param = new URLSearchParams()
    param.append('msg',msg)
    param.append('emotion',emotion)
    return request.post(urlHead+'/signIn',param)
}

export const getOldEmailCode = ()=>request.post(urlHead+'/getOldEmailCode')

export const getNewEmailCode = (newEmail)=>{
    let param = new URLSearchParams()
    param.append('newEmail',newEmail)
    return request.post(urlHead+'/getNewEmailCode',param)
}

export const updateEmail = (oldEmailCode,newEmail,newEmailCode)=>{
    let param = new URLSearchParams()
    param.append('newEmail',newEmail)
    param.append('oldEmailCode',oldEmailCode)
    param.append('newEmailCode',newEmailCode)
    return request.post(urlHead+'/updateEmail',param)
}

export const hasPermission = ()=>request.post(urlHead+'/toAdmin')

export const isExpire = () =>request.post(urlHead+'/isExpire')
//获取链接，但是只保留域名
export const getAvatarApi = url + "/file/url/origin/"