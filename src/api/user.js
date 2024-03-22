import request from '@/util/request'

export const login = (account,password,code)=>{
    let param = new URLSearchParams()
    param.append('account',account)
    param.append('password',password)
    param.append('code',code)
    return request.post('/login',param)
}