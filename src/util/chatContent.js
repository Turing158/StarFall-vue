import { itemEmojis } from '@/assets/img/emoji/getItemEmoji'

const wwwRegex = /(^|\s)(www\.[^\s<]+)/g
const urlRegex = /(https?:\/\/[^\s<]+)/g
const emojiRegex = /:[a-zA-Z0-9_+.]+:/g
export const handleContent = (content) => {
  if (!content) return ''
  // 转义HTML特殊字符，防止HTML和CSS注入
  let escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  // 将URL转换为可点击的链接
  // 匹配http://、https://、ftp://等链接
  escaped = escaped.replace(urlRegex, (url) => {
    return `<a class="link" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  })

  // 匹配www.开头的链接（没有协议）
  escaped = escaped.replace(wwwRegex, (match, space, url) => {
    return `${space}<a class="link" href="https://${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  })

  // 处理换行
  escaped = escaped.replace(/\n/g, '<br>')

  //  匹配 :emoji: 格式的表情符号
  escaped = escaped.replace(emojiRegex, (emoji) => {
    let item = itemEmojis[emoji.slice(1, -1)]
    if (!item) {
      return emoji
    }
    return `<img class="chat_emoji" src="${item.src}" alt="${emoji}" draggable="true" title="${item.name}"/>`
  })

  return escaped
}

export const handleLastContent = (content) => {
  if (!content) return ''
  let escaped = content.trim()
  escaped = escaped.replace(emojiRegex, (emoji) => {
    let item = itemEmojis[emoji.slice(1, -1)]
    if (!item) {
      return emoji
    }
    return `[${item.name}]`
  })
  return escaped
}
