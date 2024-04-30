import request from '@/util/request'



export const login = (account,password,code)=>{
    let param = new URLSearchParams()
    param.append('account',account)
    param.append('password',password)
    param.append('code',code)
    return request.post('/login',param)
}

export const getUserInfo = ()=>request.post('/getUserInfo')

export const getEmailCode = (email)=>{
    let param = new URLSearchParams()
    param.append('email',email)
    return request.post('/getEmailCode',param)
}


export const register = (user,password,email,emailCode,code)=>{
    let param = new URLSearchParams()
    param.append('user',user)
    param.append('password',password)
    param.append('email',email)
    param.append('emailCode',emailCode)
    param.append('code',code)
    return request.post('/register',param)
}


export const checkForget = (email,emailCode,code)=>{
    let param = new URLSearchParams()
    param.append('email',email)
    param.append('emailCode',emailCode)
    param.append('code',code)
    return request.post('/checkForgetPassword',param)
}

export const forgetPassword = (password)=>{
    let param = new URLSearchParams()
    param.append('password',password)
    return request.post('/forgetPassword',param)
}

export const findUserinfo = (user)=>{
    let param = new URLSearchParams()
    param.append('user',user)
    return request.post('/findUserByUser',param)
}


export const saveInfo = (name,gender,birthday,code)=>{
    let param = new URLSearchParams()
    param.append('name',name)
    param.append('gender',gender)
    param.append('birthday',birthday)
    param.append('code',code)
    return request.post('/updateUserInfo',param)
}


export const settingPassword = (oldPassword,newPassword,code)=>{
    let param = new URLSearchParams()
    param.append('oldPassword',oldPassword)
    param.append('newPassword',newPassword)
    param.append('code',code)
    return request.post('/updatePassword',param)
}

export const settingAvatar = (avatarBase64)=>{
    let param = new URLSearchParams()
    param.append('avatarBase64',avatarBase64)
    return request.post('/updateAvatar',param)
}

export const exit = ()=>request.post('/exit')


export const findAllSignIn = (page)=>{
    let param = new URLSearchParams()
    param.append('page',page)
    return request.post('/findAllSignIn',param)
}


export const countSignIn = ()=>request.post('/countAllSignIn')


export const signIn = (msg,emotion)=>{
    let param = new URLSearchParams()
    param.append('msg',msg)
    param.append('emotion',emotion)
    return request.post('/signIn',param)
}

export const getOldEmailCode = ()=>request.post('/getOldEmailCode')

export const getNewEmailCode = (newEmail)=>{
    let param = new URLSearchParams()
    param.append('newEmail',newEmail)
    return request.post('/getNewEmailCode',param)
}

export const updateEmail = (oldEmailCode,newEmail,newEmailCode)=>{
    let param = new URLSearchParams()
    param.append('newEmail',newEmail)
    param.append('oldEmailCode',oldEmailCode)
    param.append('newEmailCode',newEmailCode)
    return request.post('/updateEmail',param)
}

export const hasPermission = ()=>request.post('/toAdmin')