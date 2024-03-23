import request from '@/util/request'

export const login = (account,password,code)=>{
    let param = new URLSearchParams()
    param.append('account',account)
    param.append('password',password)
    param.append('code',code)
    return request.post('/login',param)
}


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