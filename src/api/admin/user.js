import request from "@/util/request";

const urlHead = "/admin/user";

export const findAllUsersForSelect = ()=>request.post(urlHead+"/adminFindAllUsersForSelect")