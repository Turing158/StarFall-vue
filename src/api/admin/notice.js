import request from "@/util/request";

const urlHead = "/admin/notice";

export const findAllNotice = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    return request.post(urlHead+"/adminFindAllNotice",params)
}


export const addNotice = (notice)=>{
    return request.post(urlHead+"/adminAddNotice",notice)
}

export const deleteNotice = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteNotice",params)
}
export const updateNotice = (notice)=>{
    return request.post(urlHead+"/adminUpdateNotice",notice)
}