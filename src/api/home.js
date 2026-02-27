import request, { bilibiliApi, url } from '@/util/request'
export const homeApi = "/home"
export const liveApi = "/live"

export const findAllHomeTalk = (num)=>{
    let params = new URLSearchParams();
    params.append("num",num)
    return request.post(homeApi+"/findAllHomeTalk",params)
}

export const publicHomeTalk = (content)=>{
    let params = new URLSearchParams();
    params.append("content",content)
    return request.post(homeApi+"/publicHomeTalk",params)
}

export const findAdvertisementByPosition = (position)=>{
    let params = new URLSearchParams();
    params.append("position",position)
    return request.post(homeApi+"/findAdvertisementByPosition",params)
}

export const adPictureApi = url + "/file/url/origin/"

export const findAllLive = (index,platform) =>{
    let params = new URLSearchParams();
    params.append("index",index)
    params.append("platform",platform)
    return request.post(liveApi+"/findLiveBroadcast",params)
}

export const findAllLiveByUser = (page) => {
    let params = new URLSearchParams();
    params.append("page",page)
    return request.post(liveApi+"/findAllLiveByUser",params)
}

export const publicLiveApply = (url,platform) =>{
    let params = new URLSearchParams();
    params.append("url",url)
    params.append("platform",platform)
    return request.post(liveApi+"/appendLiveApply",params)
}

export const deleteLive = (id) =>{
    let params = new URLSearchParams();
    params.append("id",id)
    return request.post(liveApi+"/deleteLiveApply",params)
}

export const findAllLiveApplyOnAudit = (page) =>{
    let params = new URLSearchParams();
    params.append("page",page)
    return request.post(liveApi+"/findAllLiveApplyOnAudit",params)
}

export const updateLiveStatus = (id,playUid,reason,status) =>{
    let params = new URLSearchParams();
    params.append("id",id)
    params.append("playUid",playUid)
    params.append("reason",reason)
    params.append("status",status)
    return request.post(liveApi+"/updateLiveStatus",params)
}


export const getLiveRoomInfo = (id)=> bilibiliApi.get("/room/v1/Room/get_info?room_id=" + id)

export const getLiveUserInfo = (uid)=> bilibiliApi.get("/room/v1/Room/get_status_info_by_uids?uids[]=" + uid)