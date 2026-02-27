import request, { url } from "@/util/request";

const urlHead = "/starfall/console/user";

export const findAllUsersForSelect = (keyword)=>{
    let param = new URLSearchParams();
    param.append("keyword",keyword)
    return request.post(urlHead+"/adminFindAllUsersForSelect",param)
}

export const findAllUser = (page,keyword)=>{
    let param = new URLSearchParams();
    param.append("page",page)
    param.append("keyword",keyword)
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


export const findAllSignIn = (page,keyword)=>{
    let param = new URLSearchParams();
    param.append("page",page)
    param.append("keyword",keyword)
    return request.post(urlHead+"/adminFindAllSignIn",param)
}

export const appendSignIn = (signIn)=>request.post(urlHead+"/adminAppendSignIn",signIn)

export const updateSignIn = (signIn)=>request.post(urlHead+"/adminUpdateSignIn",signIn)

export const deleteSignIn = (signIn)=>request.post(urlHead+"/adminDeleteSignIn",signIn)

export const getAvatarApi = url + "/file/url/origin/"
