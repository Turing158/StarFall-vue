import request from "@/util/request";


const urlHead = "/admin/topic";

export const findAllTopic = (page)=>{
    let params = new URLSearchParams();
    params.append("page",page);
    return request.post(urlHead+"/adminFindAllTopic",params)
}