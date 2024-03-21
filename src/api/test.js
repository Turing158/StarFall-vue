import request from '@/util/request'


export const getAll = ()=> {
    console.log(request.get('/test'));
}