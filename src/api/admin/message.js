import request from "@/util/request";

const urlHead = "/admin/chat";

export const findAllMessage = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    return request.post(urlHead+"/adminFindAllMessage",params)
}

export const insertMessage = (message)=>request.post(urlHead+"/adminInsertMessage",message)

export const updateMessage = (messages)=>request.post(urlHead+"/adminUpdateMessage",messages)

export const deleteMessage = (message)=>request.post(urlHead+"/adminDeleteMessage",message)