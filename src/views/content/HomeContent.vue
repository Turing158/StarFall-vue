<template>
  <div>
    <Book>
      <div class="content">
        <div class="daily">
          <div class="datetime" :title="`现在是${dateStr}${timeStr.split(' ')[0]} ${weekStr}`">
            <span>
              {{ dateStr }}
            </span>
            <span>
              {{ timeStr }}
            </span>
          </div>
        </div>
        <div class="divide"></div>
        <div class="firstTopic">
          <HomeList class="firstTopicChild" title="最新回复" :data="replys" v-loading="replysLoading" element-loading-background="#f3debf" element-loading-text="加载中..."/>
          <HomeList class="firstTopicChild" title="最近更新" :data="updates" v-loading="updatesLoading" element-loading-background="#f3debf" element-loading-text="加载中..."/>
          <HomeList class="firstTopicChild" title="最新发布" :data="publics" v-loading="publicsLoading" element-loading-background="#f3debf" element-loading-text="加载中..."/>
        </div>
        <div class="divide"></div>
        <HomeTalk></HomeTalk>
      </div>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import HomeList from '@/components/HomeList.vue'
import HomeTalk from '@/components/HomeTalk.vue'
import { onMounted, ref,onUnmounted } from 'vue'
import { findFirstRefreshTopic, findFirstCommentTopic,findFirstPublicTopic} from '@/api/topic.js'
const replys = ref([])
const updates = ref([])
const publics = ref([])
const replysLoading = ref(true)
const updatesLoading = ref(true)
const publicsLoading = ref(true)
let timeTimer;
const init = async()=>{
  timeInit()
  timeTimer = setInterval(()=>{
    timeInit()
  },1000)
  await findFirstCommentTopic().then(res=>{
    if(res.data.msg == "SUCCESS"){
      replys.value = res.data.object
    }
    
  }).catch(e=>{

  })
  replysLoading.value = false
  await findFirstRefreshTopic().then(res=>{
    if(res.data.msg == "SUCCESS"){
      updates.value = res.data.object
    }
    
  }).catch(e=>{

  })
  updatesLoading.value = false
  await findFirstPublicTopic().then(res=>{
    if(res.data.msg == "SUCCESS"){
      publics.value = res.data.object
    }
  }).catch(e=>{

  })
  publicsLoading.value = false
}
const dateStr = ref("0000-00-00")
const timeStr = ref("00:00:00 SUN")
const weekStr = ref("")
const timeInit = ()=>{
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let week = date.getDay()
  let weekArr = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  let weekCN = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
  if(month < 10){
    month = "0" + month
  }
  if(day < 10){
    day = "0" + day
  }
  if(hour < 10){
    hour = "0" + hour
  }
  if(minute < 10){
    minute = "0" + minute
  }
  if(second < 10){
    second = "0" + second
  }
  dateStr.value = year + "-" + month + "-" + day
  timeStr.value = hour + ":" + minute + ":" + second + " " + weekArr[week]
  weekStr.value = weekCN[week]
}
onMounted(init)
onUnmounted(()=>{
  clearInterval(timeTimer)
})
</script>
<style scoped>
.daily{
  display: inline-flex;
  width: 100%;
  background-image: url(/img/Header-background.png);
  background-size: auto 100%;
}
.datetime{
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  padding: 16px;
  background: linear-gradient(to bottom, #71a033 0%, #71a033 40%, #8b5a2b 40%, #8b5a2b 100%);
  border: 4px solid #3c2e1c;
  box-shadow: 0 0 0 2px #000, inset 0 0 0 2px #000;
  min-width: 280px;
  text-align: center;
  position: relative;
  animation: datetimeStartAnim 0.5s ease-in-out;
}
.datetime::before{
  content: '';
  position: absolute;
  top: -8px; left: -8px; right: -8px; bottom: -8px;
  border: 2px solid #d4c89d;
  pointer-events: none;
}

@keyframes datetimeStartAnim {
  0%{
    transform: scaleX(0) scaley(0.1);
  }
  25%{
    transform: scaleX(1) scaley(0.1);
  }
  50%{
    transform: scaleX(1.1) scaley(1);
  }
  75%{
    transform: scaleX(1) scaley(1.1);
  }
  100%{
    transform: scaleX(1) scaley(1);
  }
}

.datetime span:first-child{
  font-size: 20px;
  font-weight: bold;
  color: #f1f1f1;
  text-shadow: 2px 2px 0 #333;
  margin-bottom: 8px;
  position: relative;
  bottom: 5px;
  font-family: 'Pixel', monospace;
  letter-spacing: 2px;
}
.datetime span:last-child{

  margin-top: 10px;
  font-size: 30px;
  color: #e0e0e0;
  text-shadow: 2px 2px 0 #333;
  font-family: 'Pixel', monospace;
}
.firstTopic{
  height: 223px;
  display: flex;
}
.firstTopic .firstTopicChild{
  flex: 1;
}
.divide{
  height: 1px;
  background-color: #a58960;
  margin: 0 5px;
}

</style>