import request from "@/util/request";

const urlHead = "/admin/user";

export const findAllUsersForSelect = ()=>request.post(urlHead+"/adminFindAllUsersForSelect")

export const findAllUser = (page)=>{
    let param = new URLSearchParams();
    param.append("page",page)
    return request.post(urlHead+"/adminFindAllUsers",param)
}