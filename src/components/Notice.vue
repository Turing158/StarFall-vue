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
const notices = ref([
  "6666666666",
  "你真是个天才",
  "好不错已占据"
])
const NoticeMainWidth = ref(0)
const noticeItem = ref()
const setWidth = () => {
  for(let i=0;i<notices.value.length;i++){
    let width = noticeItem.value[1].offsetWidth
    NoticeMainWidth.value += (width)
  }

  console.log();
}
onMounted(setWidth)
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
