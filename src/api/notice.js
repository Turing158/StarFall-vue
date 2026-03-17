import request from '@/util/request'


// 公告列表
export const findAllNotice = ()=>request.post('/home/notice/find')

// 最新通知和未读数量
export const findLastNoticeAndUnreadNum = () =>request.post('/user/notice/last')

// 通知列表
export const findAllUserNotice = (index) => {
    const params = new URLSearchParams()
    params.append('index', index)
    return request.post('/user/notice/all', params)
}

// 通知已读
export const readNotice = (notices) => request.post('/user/notice/mark',notices)