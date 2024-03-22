<template>
  <div class="notice-con">
    <div class="notice-main-con">
      <div class="notice-main" :style="{width:NoticeMainWidth+'px',animation:'move '+notices.length+'0s infinite linear'}">
        <div class="notice-item" ref="noticeItem" v-for="(item,index) in notices" :key="index">{{ item }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import {findAllNotice} from '@/api/notice'
import { ElMessage } from 'element-plus'
const notices = ref([])
const NoticeMainWidth = ref(0)
const noticeItem = ref()
const setWidth = () => {
  for(let i=0;i<notices.value.length;i++){
    let width = noticeItem.value[1].offsetWidth
    NoticeMainWidth.value += (width)
  }
}
const getNotice = async()=>{
  await findAllNotice().then(res=>{
    let data = res.data.object
    for(let i=0;i<data.length;i++){
      notices.value.push(data[i].content)
    }
  }).catch(err=>{
    ElMessage.error("获取公告失败")
  })
  setWidth()
}
onMounted(getNotice)
</script>
<style scoped>
.notice-con {
  width: 100%;
  height: 40px;
  line-height: 24px;
  margin: 0 auto 15px;
  color: #fff;
  font-size: 15px;
  overflow: hidden;
  background-color: #131313aa;
}

.notice-main-con {
  margin: 0 16px 0 25px;
  overflow: hidden;
}

.notice-main {
  display: inline-block;
  white-space: nowrap;
  width: auto;
}

.notice-item {
  display: inline-block;
  padding-right: 500px;
  line-height: 40px;
}
</style>
