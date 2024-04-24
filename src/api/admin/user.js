import request from "@/util/request";

const urlHead = "/admin/user";

export const findAllUsersForSelect = ()=>request.post(urlHead+"/adminFindAllUsersForSelect")

export const findAllUser = (page)=>{
    let param = new URLSearchParams();
    param.append("page",page)
    return request.post(urlHead+"/adminFindAllUsers",param)
}


export const insertUser = (user)=>request.post(urlHead+"/adminInsertUser",user)

export const updateUser = (user)=>request.post(urlHead+"/adminUpdateUser",user)

export const deleteUser = (user)=>{
    let param = new URLSearchParams();
    param.append("user",user)
    return request.post(urlHead+"/adminDeleteUser",param)
}


export const updateAvatar = (user,avatar) =>{
    let param = new URLSearchParams();
    param.append("user",user)
    param.append("avatar",avatar)
    return request.post(urlHead+"/adminUpdateAvatar",param)
}


export const findAllSignIn = (page)=>{
    let param = new URLSearchParams();
    param.append("page",page)
    return request.post(urlHead+"/adminFindAllSignIn",param)
}

export const appendSignIn = (signIn)=>request.post(urlHead+"/adminAppendSignIn",signIn)

export const updateSignIn = (signIn)=>request.post(urlHead+"/adminUpdateSignIn",signIn)

export const deleteSignIn = (signIn)=>request.post(urlHead+"/adminDeleteSignIn",signIn)
