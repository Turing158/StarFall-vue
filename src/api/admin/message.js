import api from "@/util/request";

const urlHead = "/starfall/console/chat";

export const findAllMessage = (page,keyword)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    params.append("keyword",keyword);
    return api.post(urlHead+"/adminFindAllMessage",params)
}

export const insertMessage = (message)=>api.post(urlHead+"/adminInsertMessage",message)

export const updateMessage = (messages)=>api.post(urlHead+"/adminUpdateMessage",messages)

export const deleteMessage = (message)=>api.post(urlHead+"/adminDeleteMessage",message)