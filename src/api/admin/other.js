import request from "@/util/request";

const urlHead = "/admin";
const urlActuator = "/admin/actuator";

export const getHealth = () => request.get(urlActuator + "/health");

const metrics = '/metrics';
export const getRequestActive = () => request.get(urlActuator + metrics + "/spring.security.http.secured.requests.active");
export const getJVMMemoryUsed = () => request.get(urlActuator + metrics + "/jvm.memory.used");
export const getJVMMemoryTotal = () => request.get(urlActuator + metrics + "/jvm.memory.max");
export const getCPUUsed = () => request.get(urlActuator + metrics + "/system.cpu.usage");

export const getTopImgs = () => request.post(urlHead + "/other/findAllTopImgInfo");
export const uploadTopImg = (imgBase64) =>{
    let param = new URLSearchParams();
    param.append("imgBase64", imgBase64);
    return request.post(urlHead + "/other/uploadTopImg",param);
}
export const upMoveTopImg = (imgName) => {
    let param = new URLSearchParams();
    param.append("imgName", imgName);
    return request.post(urlHead + "/other/upMoveTopImg",param);
}

export const downMoveTopImg = (imgName) => {
    let param = new URLSearchParams();
    param.append("imgName", imgName);
    return request.post(urlHead + "/other/downMoveTopImg",param);
}

export const deleteTopImg = (imgName) => {
    let param = new URLSearchParams();
    param.append("imgName", imgName);
    return request.post(urlHead + "/other/deleteTopImg",param);
}


export const getAdImg = () => request.post( "/admin/other/findAllAdImgInfo");

export const uploadAdImg = (imgBase64) =>{
    let param = new URLSearchParams();
    param.append("imgBase64", imgBase64);
    return request.post(urlHead + "/other/uploadAdImg",param);
}

export const upMoveAdImg = (imgName)=>{
    let param = new URLSearchParams();
    param.append("imgName", imgName);
    return request.post(urlHead+"/other/upMoveAdImg",param);
}

export const downMoveAdImg = (imgName)=>{
    let param = new URLSearchParams();
    param.append("imgName", imgName);
    return request.post(urlHead+"/other/downMoveAdImg",param);
}
export const deleteAdImg = (imgName)=>{
    let param = new URLSearchParams();
    param.append("imgName", imgName);
    return request.post(urlHead+"/other/deleteAdImg",param);
}
