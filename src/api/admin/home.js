import api, { url } from '@/util/request'

const urlHead = "/starfall/console/home";
const urlLive = "/starfall/console/live";

export const findAllAdvertisement = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page)
    return api.post(urlHead+"/adminFindAllAdvertisement",params)
}

export const addAdvertisement = (ad)=>api.post(urlHead+"/adminInsertAdvertisement",ad)

export const deleteAdvertisement = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return api.post(urlHead+"/adminDeleteAdvertisement",params)
}

export const updateAdvertisement = (ad)=>api.post(urlHead+"/adminUpdateAdvertisement",ad)

export const adPictureApi = url + "/file/url/origin/"

export const findAllHomeTalk = (page,keyword)=>{
    let params = new URLSearchParams();
    params.append("page",page)
    params.append("keyword",keyword)
    return api.post(urlHead+"/adminFindAllHomeTalk",params)
}

export const deleteHomeTalk = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return api.post(urlHead+"/adminDeleteHomeTalk",params)
}

export const updateHomeTalk = (homeTalk)=>api.post(urlHead+"/adminUpdateHomeTalk",homeTalk)

export const addHomeTalk = (homeTalk)=>api.post(urlHead+"/adminInsertHomeTalk",homeTalk)

export const findAllLive = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page)
    return api.post(urlLive+"/adminFindAll",params)
}

export const appendLiveApply = (liveApply)=>api.post(urlLive+"/adminAppend",liveApply)

export const updateLiveApply = (liveApply)=>api.post(urlLive+"/adminUpdate",liveApply)

export const deleteLive = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return api.post(urlLive+"/adminDelete",params)
}
