import api from '@/util/request'


// 公告列表
export const findAllNotice = ()=>api.post('/home/notice/find')

// 最新通知和未读数量
export const findLastNoticeAndUnreadNum = () =>api.post('/user/notice/last')

// 通知列表
export const findAllUserNotice = (index) => {
    const params = new URLSearchParams()
    params.append('index', index)
    return api.post('/user/notice/all', params)
}

// 通知已读
export const readNotice = (notices) => api.post('/user/notice/mark',notices)
