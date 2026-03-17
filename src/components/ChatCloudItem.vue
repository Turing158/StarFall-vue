<template>
  <div>
    <div class="datetime" v-show="isShowTime(props.previousDate, props.chats.date)">
      <div>{{ handleTime(props.chats.date,true) }}</div>
    </div>
    <div v-for="(item, index) in props.chats.contents" :key="index">
      <div class="item" v-if="props.chats.fromUser != userStore.user">
        <div class="avatar">
          <img :src="(props.chats.fromAvatar.includes('http') ? '' : getAvatarApi) + props.chats.fromAvatar" alt="" />
        </div>
        <div class="chatCloud" v-html="handleContent(item)"></div>
      </div>
      <div class="item self" v-else>
        <div class="sending-animation" v-show="!props.chats.date">
          <div class="spinner"></div>
        </div>
        <div class="chatCloud" v-html="handleContent(item)"></div>
        <div class="avatar">
          <img :src="userStore.avatar" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import useUserStore from '@/stores/user'
import { ref } from 'vue'
import { marked } from 'marked'
import { getAvatarApi } from '@/api/user'
import { handleTime } from '@/util/handleNotice'
import { handleContent } from '@/util/chatContent'
const props = defineProps({
  chats: Object,
  previousDate: String
})
const renderer = new marked.Renderer()
renderer.link = function (href, title, text) {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" ${
    title ? `title="${title}"` : ''
  }>${text}</a>`
}
const userStore = useUserStore()
const isShowTime = (previousDate , currentDate)=>{
    if(!previousDate){
        return true
    }
    const previous = new Date(previousDate)
    const current = new Date(currentDate)
    return current.getFullYear() != previous.getFullYear() || current.getMonth() != previous.getMonth() || current.getDate() != previous.getDate() || current.getHours() != previous.getHours() || current.getMinutes() != previous.getMinutes()
}

</script>
<style scoped>
.datetime {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #666;
  padding: 10px 0;
}
.item {
  width: 100%;
  min-height: 40px;
  display: flex;
  padding: 10px 5px;
}
.item .avatar {
  width: 40px;
  height: 40px;
  background-color: #f1f1f1;
  margin: 0 10px;
}
.item .avatar img {
  width: 36px;
  height: 36px;
  margin: 2px;
  border-radius: 10px;
}
.chatCloud {
  width: fit-content;
  height: fit-content;
  background-color: #f8f6ef;
  padding: 8px 10px;
  border-radius: 10px;
  max-width: 600px;
  word-break: break-all;
  z-index: 1;
  user-select: text;
}
.self {
  justify-content: flex-end;
}
.self .chatCloud {
  background-color: #b3f3b8;
}
.sending-animation {
  display: flex;
  align-items: center;
  margin: 0 5px;
}
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(102, 102, 102, 0.3);
  border-radius: 50%;
  border-top-color: #666;
  animation: spin 1s ease-in-out infinite;
}
.link{
  color: #007bff !important;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
