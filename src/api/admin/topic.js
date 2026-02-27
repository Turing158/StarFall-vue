import request,{url} from "@/util/request";


const urlHead = "/starfall/console/topic";

export const findAllTopic = (page,keyword)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    params.append("keyword",keyword);
    return request.post(urlHead+"/adminFindAllTopic",params)
}


export const addTopic = (topic)=>request.post(urlHead+"/adminAddTopic",topic)
export const deleteTopic = (id)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteTopic",params)
}


export const updateTopic = (topic)=>request.post(urlHead+"/adminUpdateTopic",topic)

export const findAllTopicComment = (id,page,keyword)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    params.append("page",page);
    params.append("keyword",keyword);
    return request.post(urlHead+"/adminFindAllTopicComment",params)
}

export const findAllTopicForSelect = (keyword)=>{
    let params = new URLSearchParams();
    params.append("keyword",keyword);
    return request.post(urlHead+"/adminFindAllTopicForSelect",params)
}

export const addTopicComment = (comment)=>request.post(urlHead+"/adminAddTopicComment",comment)

export const updateTopicComment = (comment)=>request.post(urlHead+"/adminUpdateTopicComment",comment)

export const deleteTopicComment = (comment)=>request.post(urlHead+"/adminDeleteTopicComment",comment)

export const findAllTopicLikeItem = (page,keyword)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    params.append("keyword",keyword);
    return request.post(urlHead+"/adminFindAllTopicLikeItem",params)
}

export const findAllLikeItem = (id,page,keyword)=>{
    let params = new URLSearchParams();
    params.append("id",id);
    params.append("page",page);
    params.append("keyword",keyword);
    return request.post(urlHead+"/adminFindLikeItem",params)
}

export const addTopicLikeItem = (likeLog) =>request.post(urlHead+"/adminAddLikeItem",likeLog)

export const updateTopicLikeItem = (likeLog) =>request.post(urlHead+"/adminUpdateLikeItem",likeLog)

export const getTopicContent = (user,id)=>request.get("/file/url/txt/user/"+user+"/topic/"+id+"/"+id+".md")

export const getImageUrl = (path) => url + "/file/url/origin/" + path

export const findAllTopicGallery = (id) => {
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminFindAllTopicGallery",params)
}

export const uploadTopicGallery = (id,label,user,base64) => {
    let params = new URLSearchParams();
    params.append("id",id);
    params.append("label",label);
    params.append("user",user);
    params.append("imgBase64",base64);
    return request.post(urlHead+"/adminAddTopicGallery",params)
}

export const deleteTopicGallery = (id) => {
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteTopicGallery",params)
}

export const getUserCollection = (user,page) =>{
    let param = new URLSearchParams();
    param.append("user",user)
    param.append("page",page)
    return request.post(urlHead+"/adminFindAllUserCollection",param)
}

export const addUserCollection = (collection) => request.post(urlHead+"/adminAddUserCollection",collection)

export const deleteUserCollection = (id,user) =>{
    let param = new URLSearchParams();
    param.append("id",id)
    param.append("user",user)
    return request.post(urlHead+"/adminDeleteUserCollection",param)
}

export const getTopicFile = (id) => {
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminFindAllTopicFile",params)
}

export const uploadTopicFile = (id,fileName,fileLabel,base64) => {
    let params = new URLSearchParams();
    params.append("id",id);
    params.append("fileName",fileName);
    params.append("fileLabel",fileLabel);
    params.append("fileBase64",base64);
    return request.post(urlHead+"/adminAddTopicFile",params)
}

export const deleteTopicFile = (id) => {
    let params = new URLSearchParams();
    params.append("id",id);
    return request.post(urlHead+"/adminDeleteTopicFile",params)
}