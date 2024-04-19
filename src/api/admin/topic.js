import request from "@/util/request";


const urlHead = "/admin/topic";

export const findAllTopic = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    return request.post(urlHead+"/adminFindAllTopic",params)
}


export const addTopic = (topic)=>request.post(urlHead+"/adminAddTopic",topic)
export const deleteTopic = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteTopic",params)
}


export const updateTopic = (topic)=>request.post(urlHead+"/adminUpdateTopic",topic)

export const findAllTopicComment = (id,page)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    params.append("page",page);
    return request.post(urlHead+"/adminFindAllTopicComment",params)
}

export const findAllTopicForSelect = ()=>request.post(urlHead+"/adminFindAllTopicForSelect")

export const addTopicComment = (comment)=>request.post(urlHead+"/adminAddTopicComment",comment)

export const updateTopicComment = (comment)=>request.post(urlHead+"/adminUpdateTopicComment",comment)

export const deleteTopicComment = (comment)=>request.post(urlHead+"/adminDeleteTopicComment",comment)

export const findAllTopicLikeItem = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    return request.post(urlHead+"/adminFindAllTopicItem",params)
}

export const findAllLikeItem = (id,page)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    params.append("page",page);
    return request.post(urlHead+"/adminFindLikeItem",params)
}

export const addTopicLikeItem = (likeLog) =>request.post(urlHead+"/adminAddLikeItem",likeLog)

export const updateTopicLikeItem = (likeLog) =>request.post(urlHead+"/adminUpdateLikeItem",likeLog)