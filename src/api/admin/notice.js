import api from "@/util/request";

const urlHead = "/starfall/console/notice";

export const findAllNotice = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    return api.post(urlHead+"/adminFindAllNotice",params)
}


export const addNotice = (notice)=>{
    return api.post(urlHead+"/adminAddNotice",notice)
}

export const deleteNotice = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return api.post(urlHead+"/adminDeleteNotice",params)
}
export const updateNotice = (notice)=>{
    return api.post(urlHead+"/adminUpdateNotice",notice)
}