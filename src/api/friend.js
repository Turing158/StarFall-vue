import request from "@/util/request";

const urlHead = "/user/friend"

export const applyFriend = (friend,reason)=>{
    let param = new URLSearchParams()
    param.append('friend',friend)
    param.append('reason',reason)
    return request.post(urlHead+'/application/send',param)
}

export const handleFriendApplication = (noticeId,applicationId,accept) =>{
    let param = new URLSearchParams()
    param.append('noticeId',noticeId)
    param.append('applicationId',applicationId)
    param.append('accept',accept)
    return request.post(urlHead+'/application/handle',param)
}


export const getAllFriend =(index) => {
    let param = new URLSearchParams()
    param.append('index',index)
    return request.post(urlHead+'/all',param)
}

export const findMsgByFriend = (friend,index)=>{
    let params = new URLSearchParams();
    params.append("friend",friend)
    params.append("index",index)
    return request.post(urlHead+"/msg/get",params)
}

export const sendMessage = (friend,content)=>{
    let params = new URLSearchParams();
    params.append("friend",friend)
    params.append("content",content)
    return request.post(urlHead+"/msg/send",params)
}

export const changeAlias = (friend,alias) =>{
    let params = new URLSearchParams();
    params.append("friend",friend)
    params.append("alias",alias)
    return request.post(urlHead+"/set/alias",params)
}

export const changeTop = (friend,isTop) =>{
    let params = new URLSearchParams();
    params.append("friend",friend)
    params.append("isTop",isTop)
    return request.post(urlHead+"/set/top",params)
}

export const changeRelation = (friend,relation) =>{
    let params = new URLSearchParams();
    params.append("friend",friend)
    params.append("relation",relation)
    return request.post(urlHead+"/set/relation",params)
}

export const deleteFriend = (friend, deleteChatRecord) =>{
    let params = new URLSearchParams();
    params.append("friend",friend)
    params.append("deleteChatRecord",deleteChatRecord)
    return request.post(urlHead+"/delete",params)
}

