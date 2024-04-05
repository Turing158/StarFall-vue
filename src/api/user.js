import request from '@/util/request'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
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

export const exit = ()=>request.post('/exit')
