import request from "@/util/request";

export const findAllMsgByToUser = ()=>request.post("/findAllMsgByToUser")
export const findMsgByToUserAndFromUser = (fromUser)=>{
    let params = new URLSearchParams();
    params.append("fromUser",fromUser)
    return request.post("/findMsgByToUserAndFromUser",params)
}