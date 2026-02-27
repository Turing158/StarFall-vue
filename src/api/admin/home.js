import request, { url } from '@/util/request'

const urlHead = "/starfall/console/home";
const urlLive = "/starfall/console/live";

export const findAllAdvertisement = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page)
    return request.post(urlHead+"/adminFindAllAdvertisement",params)
}

export const addAdvertisement = (ad)=>request.post(urlHead+"/adminInsertAdvertisement",ad)

export const deleteAdvertisement = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteAdvertisement",params)
}

export const updateAdvertisement = (ad)=>request.post(urlHead+"/adminUpdateAdvertisement",ad)

export const adPictureApi = url + "/file/url/origin/"

export const findAllHomeTalk = (page,keyword)=>{
    let params = new URLSearchParams();
    params.append("page",page)
    params.append("keyword",keyword)
    return request.post(urlHead+"/adminFindAllHomeTalk",params)
}

export const deleteHomeTalk = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteHomeTalk",params)
}

export const updateHomeTalk = (homeTalk)=>request.post(urlHead+"/adminUpdateHomeTalk",homeTalk)

export const addHomeTalk = (homeTalk)=>request.post(urlHead+"/adminInsertHomeTalk",homeTalk)

export const findAllLive = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page)
    return request.post(urlLive+"/adminFindAll",params)
}

export const appendLiveApply = (liveApply)=>request.post(urlLive+"/adminAppend",liveApply)

export const updateLiveApply = (liveApply)=>request.post(urlLive+"/adminUpdate",liveApply)

export const deleteLive = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlLive+"/adminDelete",params)
}
