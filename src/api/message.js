import request from "@/util/request";

export const findMessageList = ()=>request.post("/findMessageList")
export const findMsgByToUserAndFromUser = (fromUser)=>{
    let params = new URLSearchParams();
    params.append("fromUser",fromUser)
    return request.post("/findMsgByToUserAndFromUser",params)
}


export const sendMessage = (toUser,content)=>{
    let params = new URLSearchParams();
    params.append("toUser",toUser)
    params.append("content",content)
    return request.post("/sendMessage",params)
}