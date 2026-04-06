<template>
  <div class="item" :class="handleClass()">
    <div class="ItemTop">
      <img class="avatar" :src="getAvatarSrc(props.item.avatar)" alt="" />
      <div class="info">
        <div class="username">{{ props.item.alias ? props.item.alias : props.item.name }}</div>
        <div class="content">{{ handleLastContent(props.item.lastMsg) }}</div>
      </div>
    </div>
    <div class="ItemBottom">
      <div class="status-icons">
        <img class="status-icon" v-if="props.item.alias" title="备注" src="@/assets/img/icon/alias.png"/>
        <img class="status-icon" v-if="props.item.isTop" title="顶置聊天" src="@/assets/img/icon/isTop.png"/>
        <img class="status-icon" v-if="props.item.relation == 0" title="免打扰" src="@/assets/img/icon/DND.png"/>
        <img class="status-icon" v-if="props.item.relation == -1" title="拉黑" src="@/assets/img/icon/isBlack.png"/>
      </div>
      <div class="time">{{ handleTime(props.item.date) }}</div>
    </div>
  </div>
</template>
<script setup>
import { getAvatarSrc } from '@/api/user'
import { handleLastContent } from '@/util/chatContent';
import { handleTime } from '@/util/handleNotice';
const props = defineProps({
  item: Object,
  active: Boolean
})
const handleClass = () => {
  let className = ''
  if(props.item.isTop){
    className += 'top'
  }
  if(className){
    className += ' '
  }
  if(props.active){
    className += 'active'
  }
  return className
}
</script>
<style scoped>
.item {
  padding: 0 5px;
  height: 80px;
  background-color: #f7edd8;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
}
.top{
  background-color: #00000008;
}
.item:hover:not(.active) {
  background-color: #e2dbc5;
}
.active {
  background-color: #f3e4c3;
}
.ItemTop {
  display: flex;
}
.item .avatar {
  width: 45px;
  height: 45px;
  background-color: #f1f1f1;
  margin-top: 12px;
  margin-right: 8px;
  border-radius: 10px;
  border: 2px solid #5e4b32;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item .info {
  position: relative;
  margin-left: -3px;
}
.username {
  width: 120px;
  height: 35px;
  font-size: 15px;
  font-weight: bold;
  line-height: 50px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color: #5e4b32;
}
.content {
  width: 125px;
  height: 30px;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
  line-height: 30px;
  display: inline-block;
  vertical-align: bottom;
}
.ItemBottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.status-icons {
  margin-left: 5px;
  display: flex;
  gap: 5px;
}
.status-icon {
  width: 12px;
  height: 12px;
  display: inline-block;
  image-rendering: auto;
}
.status-icon.online {
  background-color: #4caf50;
}
.status-icon.offline {
  background-color: #999;
}
.status-icon.top {
  background-color: #ff9800;
}
.time {
  font-size: 12px;
  color: #999;
}
</style>
