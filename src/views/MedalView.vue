<!-- 聊天页面 -->
<template>
  <div>
    <Ul class="ul"></Ul>
    <div class="content">
      <div>
        <Book>
          <div class="main">
            <div class="medal-header">
              <h1 class="medal-title">勋章展示架</h1>
            </div>
            <div class="medal-container">
              <div class="medal-item" v-for="(medal, index) in medals" :key="index" @click="getMedal(medal.id)">
                <span v-if="isExpired(medal.expireTime)" class="expired-badge" :class="{ 'hide-badge': hoverMedalIndex === index }">过期</span>
                <img class="medal-img" :src="`/img${medal.icon}`" alt=""
                     @mouseenter="hoverMedalIndex = index"
                     @mouseleave="hoverMedalIndex = -1">
                <div class="medal-name">{{ medal.name }}</div>
                <div class="medal-description">{{ medal.description }}</div>
                <div class="medal-source">{{ medal.source }}</div>
                <div class="medal-time">
                  <div class="medal-gain-expire">
                    <span class="medal-gainTime" :class="medal.expireTime ? 'gain_anim' : ''" v-show="medal.gainTime">获得:{{ medal.gainTime }}</span>
                    <span class="medal-expireTime" :class="medal.expireTime ? 'expire_anim' : 'hide'">过期:{{ medal.expireTime }}</span>
                  </div>
                  <div class="medal-createTime">
                    {{ medal.createTime.split(' ')[0] }}
                  </div>
                </div>
              </div>
            </div>
            <div class="medal-footer">
              <el-pagination
                v-model:current-page="page"
                layout="prev, pager, next"
                :total="total"
                @current-change="getMedal"
              />
            </div>
          </div>
          <el-dialog width="500px" v-model="dialogVisible" @close="dialogClose">
            <template #title>
              <span>勋章详细</span>
            </template>
            <div class="medal-dialog-content" v-if="medal">
              <div class="medal-dialog-img">
                <img :src="`/img${medal.icon}`" alt="">
              </div>
              <div class="medal-dialog-info">
                <div class="medal-dialog-name">{{ medal.name }}</div>
                <div class="medal-dialog-description">{{ medal.description }}</div>
                <div class="medal-dialog-source">来源：{{ medal.source }}</div>
                <div class="medal-dialog-createTime">创建时间：{{ medal.createTime.split(' ')[0] }}</div>

              </div>
              </div>
          </el-dialog>
        </Book>
      </div>
    </div>
  </div>
</template>
<script setup>
import Ul from '@/components/UlBar.vue'
import Book from '@/components/Book.vue'
import { ElLoading, ElMessage, ElMessageBox, } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserStore from '@/stores/user'
import useTimerStore from '@/stores/timer'
import { getMedalById, getMedalOnAll } from '@/api/user'

const userStore = useUserStore()
const timerStore = useTimerStore()
const router = useRouter()
const hoverMedalIndex = ref(-1)
const goBack = () => {
  router.back()
}
const dialogVisible = ref(false)
const medals = ref([])
const page = ref(1)
const total = ref(0)
const getMedals = async()=>{
  if(!userStore.user){
    ElMessage.error('请先登录')
    router.go(-1)
    return
  }
  await getMedalOnAll(userStore.user,page.value)
    .then(res=>{
      if(res.data.msg == 'SUCCESS'){
        medals.value = res.data.object
        total.value = res.data.num
      }
    })
    .catch(err=>{
      ElMessage.error('获取勋章失败')
    })
}
const medal = ref({
  name: '',
  icon: '',
  description: '',
  source: '',
  createTime: '',
})
const getMedal = async(id)=>{
  ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await getMedalById(id)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      medal.value = res.data.object
      dialogVisible.value = true
    }
    else{
      ElMessage.error('不存在该勋章')
    }
  })
  ElLoading.service().close()
}
const dialogClose = ()=>{
  if(router.currentRoute.value.params.id){
    router.push('/medals')
  }
}

const isExpired = (expireTime) => {
  if (!expireTime) return false
  const now = new Date()
  const expire = new Date(expireTime)
  return now > expire
}
onMounted(()=>{
  getMedals()
  if(router.currentRoute.value.params.id){
    getMedal(router.currentRoute.value.params.id)
  }
})
</script>
<style scoped>
.ul {
  position: fixed;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
.main {
  display: flex;
  flex-direction: column;
  min-height: 600px;
}
.medal-header {
  padding: 20px;
  border-bottom: 1px solid #d6bf8e;
}
.medal-title {
  font-size: 24px;
  color: #6e5d3e;
  margin: 0;
}
.medal-container {
  flex: 1;
  display: grid;
  padding: 20px;
  grid-template-columns: repeat(4, 1fr);
  
}
.medal-item {
  background-color: #f7edd8;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 10px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  position: relative;
}
.medal-item:hover{
  transform: translateY(-5px);
}

.expired-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #998862;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 10;
  transition: opacity 0.2s ease-in-out;
}

.hide-badge {
  opacity: 0;
}
.medal-name{
  font-size: 18px;
  font-weight: bold;
  color: #6e5d3e;
}
.medal-description{
  width: 170px;
  height: 40px;
  font-size: 14px;
  color: #6e5d3e;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.medal-img{
  width: 80px;
  height: 80px;
  image-rendering: auto;
  border: 1px solid #a58960;
  border-radius: 8px;
  background-color: #ffffff;
  z-index: 1;
}
.medal-name,.medal-description,.medal-time,.medal-img{
  transition: all 0.2s ease-in-out;
}
.medal-img:hover{
  width: 160px;
  height: 160px;
}
.medal-img:hover ~ .medal-name{
  height: 0px;
}
.medal-img:hover ~ .medal-description,
.medal-img:hover ~ .medal-source,
.medal-img:hover ~ .medal-time{
  height: 0px;
  opacity: 0;
}
.medal-source{
  height: 20px;
  font-size: 14px;
  color: #6e5d3e;
  font-weight: bold;
}

.medal-time{
  width: 100%;
  height: 15px;
  font-size: 10px;
  color: #6e5d3e;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.medal-gainTime{
  position: absolute;
}
.medal-expireTime{
  position: absolute;
}

.medal-createTime{
  color: #6e5d3e;
}

.gain_anim{
  animation: gainAnim 5s infinite;
}
@keyframes gainAnim {
  0%{
    opacity: 1;
    transform: translateY(0px);
  }
  45%{
    opacity: 1;
    transform: translateY(0px);
  }
  50%{
    opacity: 0;
    transform: translateY(-10px);
  }
  55%{
    opacity: 0;
    transform: translateY(10px);
  }
  95%{
    opacity: 0;
    transform: translateY(10px);
  }
  100%{
    opacity: 1;
    transform: translateY(0px);
  }
}
.expire_anim{
  animation: expireAnim 5s infinite;
}
@keyframes expireAnim {
  0%{
    opacity: 0;
    transform: translateY(10px);
  }
  45%{
    opacity: 0;
    transform: translateY(10px);
  }
  50%{
    opacity: 1;
    transform: translateY(0px);
  }
  95%{
    opacity: 1;
    transform: translateY(0px);
  }
  100%{
    opacity: 0;
    transform: translateY(-10px);
  }
}

.hide{
  display: none;
}

.medal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid #d6bf8e;
}

.medal-dialog-content{
  display: flex;
  flex-direction: column;
  align-items: center;
  
}
.medal-dialog-img{
  width: 300px;
  height: 300px;
  image-rendering: auto;
  border: 1px solid #a58960;
  border-radius: 8px;
  background-color: #ffffff;
  z-index: 1;
}
.medal-dialog-img img{
  width: 300px;
  height: 300px;
  image-rendering: auto;
  border-radius: 8px;
}
.medal-dialog-info{
  width: 300px;
  font-size: 14px;
  padding: 10px 30px;
  border-radius: 8px;
  color: #6e5d3e;
  margin: 5px 0;
  transition: all 0.2s ease-in-out;
}
.medal-dialog-info:hover{
  background-color: #e6d4b6;
}
.medal-dialog-name{
  font-size: 18px;
  font-weight: bold;
  color: #6e5d3e;
  margin-bottom: 10px;
}
.medal-dialog-description{
  margin-bottom: 10px;
}
.medal-dialog-source{
  height: 20px;
  font-size: 14px;
  color: #6e5d3e;
}
.medal-dialog-createTime{
  height: 20px;
  font-size: 14px;
  color: #6e5d3e;
}
</style>
