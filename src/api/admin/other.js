import request from "@/util/request";

const urlHead = "/admin/actuator";

export const getHealth = () => request.get(urlHead + "/health");

const metrics = '/metrics';
export const getRequestActive = () => request.get(urlHead + metrics + "/spring.security.http.secured.requests.active");
export const getJVMMemoryUsed = () => request.get(urlHead + metrics + "/jvm.memory.used");
export const getJVMMemoryTotal = () => request.get(urlHead + metrics + "/jvm.memory.max");
export const getCPUUsed = () => request.get(urlHead + metrics + "/system.cpu.usage");