import { ElNotification, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { isExpire } from '@/api/user'
import request from '@/util/request'
import { useRouter } from 'vue-router'

const router = useRouter()

const onOpen = (e) => {
  console.log('WebSocket连接成功')
}
const onError = (e) => {
  ElMessage.error('服务异常')
  console.log('onError', e)
}
const onSend = (e) => {
  console.log('onSend', e)
}
const onMessage = (e) => {
  let data = JSON.parse(e.data)
  handleNotification(data)
  messageCallbacks.value.forEach((callback) => {
    try {
      callback(data)
    } catch (error) {
      console.error('Message callback error:', error)
    }
  })
}
const onClose = (e) => {
  console.log('WebSocket关闭')
}

const webSocket = ref()
const isReadyWebSocket = ref(false)
const messageCallbacks = ref([])

export const registerMessageCallback = (callback) => {
  if (typeof callback === 'function') {
    messageCallbacks.value.push(callback)
  }
}

export const unregisterMessageCallback = (callback) => {
  const index = messageCallbacks.value.indexOf(callback)
  if (index > -1) {
    messageCallbacks.value.splice(index, 1)
  }
}

export const initWebSocket = async () => {
  const userStroe = useUserStore()
  if (userStroe.isLogin) {
    await isExpire()
      .then((res) => {
        if (res.data.msg == 'EXPIRE_TOKEN') {
          console.log('过期')
          userStroe.exit()
          router.push('/')
        }
      })
      .catch()
  }
  let url = 'ws://' + window.location.href.split('/')[2] + '/api/message/' + userStroe.token
  if (userStroe.isLogin) {
    webSocket.value = new WebSocket(url)
    webSocket.value.onopen = onOpen
    webSocket.value.onerror = onError
    webSocket.value.onmessage = onMessage
    webSocket.value.onclose = onClose
    webSocket.value.send = onSend
  }
  isReadyWebSocket.value = true
}

export const handleNoticeNum = (num) => {
  if (num > 99) {
    return '99+'
  }
  return num
}
const gettypeTitle = (type) => {
  switch (type) {
    case 'friend':
      return '好友'
    case 'msg':
      return '消息'
    case 'topic':
      return '帖子'
    case 'live':
      return '直播'
    case 'all':
      return '所有'
    default:
      return '其他'
  }
}
const getIconPath = (name) => `/src/assets/img/emoji/item/${name}.png`
export const getNoticeIcon = (type) => {
  switch (type) {
    case 'friend':
      return getIconPath('campfire')
    case 'msg':
      return getIconPath('knowledge_book')
    case 'topic':
      return getIconPath('experience_bottle')
    case 'live':
      return getIconPath('redstone')
    case 'all':
      return getIconPath('emerald')
    default:
      return getIconPath('jungle_hanging_sign')
  }
}
const getNoticeContent = (action, type) => {
  let ope = JSON.parse(action)
  console.log(ope)
  if (type == 'live') {
    return `直播申请${ope.url ? `(<a href="${ope.url}" target="_blank" title="点击跳转">${ope.url}</a>)` : ''}<span class="${ope.status == 1 ? 'green' : 'red'}"> ${ope.status == 1 ? '已通过' : ope.status == -1 ? '未通过' : '暂未审核'}</span><br/>原因：${ope.reason}`
  } else if (type == 'topic') {
    return `主题帖(<a href="/topic/detail/${ope.id}" target="_blank" title="点击跳转">${ope.title}</a>)状态已更新：<span class="${ope.status == -1 ? 'red' : 'green'}">${ope.status == -1 ? '待整改' : '正常发布'}</span><br/>审核员：<a href="/personal/other/${ope.operator}">${ope.operator}</a><br/>原因：${ope.reason}`
  } else if (type == 'friend') {
    return ope.name
      ? `<a href="/personal/other/${ope.user}" target="_blank" title="点击跳转">${ope.name}(${ope.user})</a> 向你发出好友申请 !<br/>[${ope.reason}]`
      : `对方(<a href="/personal/other/${ope.user}" target="_blank" title="点击跳转">${ope.user}</a>) <span class="${ope.status == 1 ? 'green' : 'red'}">${ope.status == 1 ? '已同意' : '已拒绝'}</span> 你的好友申请`
  } else if (type == 'all') {
    return `${ope.subContent || ope.content}<br/><div class="rightContent"><a href="/topic/detail/${ope.id}">查看详情</a></div>`
  }
  return action
}
export const handleNotification = (notice, isLast, num) => {
  if (!notice) {
    return
  }
  if (notice.type) {
    const messageHtml = `
            <div class="notice-message">
                <div class="notice-content">${getNoticeContent(notice.action, notice.type) || ''}</div>
                <div class="notice-footer">
                    <img class="notice-icon" src="${getNoticeIcon(notice.type)}" title="${gettypeTitle(notice.type)}"/>
                    <span class="notice-time">${handleTime(notice.createTime, true)}</span>
                </div>
                ${isLast ? `<div class="notice-last" onclick="window.location.href='/notices'">这是最新消息，点击查看更多消息${num ? `(${num > 99 ? '99+' : num})</div>` : ''}` : ''}
            </div>
            <style>
                .notice-message {
                    line-height: 1.6;
                    width: 280px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .notice-content {
                    flex: 1;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 8px;
                }
                .notice-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    color: #99876c;
                    padding-top: 8px;
                    border-top: 1px solid #99876c;
                    ${isLast ? 'border-bottom: 1px solid #99876c;' : ''}
                    margin-top: auto;
                }
                .notice-icon {
                    width:20px;
                    height:20px;
                }
                .notice-time {
                    font-size: 12px;
                }
                .notice-last {
                    font-size: 12px;
                    color: #99876c;
                    text-align: center;
                    cursor: pointer;
                    margin-top: 4px;
                }
                .notice-last:hover {
                    color: #63533d;
                }
                .red {
                    color: #770000;
                }
                .green {
                    color: #006d00;
                }
                .rightContent{
                    text-align: right;
                }
            </style>
        `
    ElNotification({
      title: notice.title || '通知',
      dangerouslyUseHTMLString: true,
      message: messageHtml
    })
    const userStroe = useUserStore()
    userStroe.setUnreadNum(userStroe.unreadNum + 1)
  } else {
    ElNotification({
      title: '新消息-来自' + notice.fromUser + '的消息',
      message: notice.content,
      type: 'success'
    })
  }
}
export const handleTime = (time,isNotice) => {
  if (!time) return ''

  const inputDate = new Date(time)
  const now = new Date()

  const inputYear = inputDate.getFullYear()
  const inputMonth = inputDate.getMonth()
  const inputDay = inputDate.getDate()

  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDay = now.getDate()

  const isSameDay = inputYear === nowYear && inputMonth === nowMonth && inputDay === nowDay

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday =
    inputYear === yesterday.getFullYear() &&
    inputMonth === yesterday.getMonth() &&
    inputDay === yesterday.getDate()

  const hours = String(inputDate.getHours()).padStart(2, '0')
  const minutes = String(inputDate.getMinutes()).padStart(2, '0')
  if (isSameDay) {
    return `${hours}:${minutes}`
  } else if (isYesterday) {
    return `昨天${hours}:${minutes}`
  } else {
    const year = String(inputYear)
    const month = String(inputMonth + 1).padStart(2, '0')
    const day = String(inputDay).padStart(2, '0')
    return isNotice ? `${year}-${month}-${day} ${hours}:${minutes}` : `${year}-${month}-${day}`
  }
}