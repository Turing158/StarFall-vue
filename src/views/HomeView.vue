<!-- 首页框架 -->
<template>
  <div class="main">
    <div class="notice">
      <Notice />
    </div>
    <el-carousel height="500px" trigger="click" motion-blur :interval="3000" 
        v-loading="isLoading"
        element-loading-background="#f3debf"
        element-loading-text="加载中...">
      <el-carousel-item v-for="(item,index) in ads" :key="index" label=" ">
        <a :href="item.link">
          <img class="adImg" :src="adPictureApi+item.file" alt="" :width="imgWidth" :height="imgHeight" />
        </a>
        <div class="carousel-texts">
          {{ item.title }}
        </div>
      </el-carousel-item>
    </el-carousel>
    <Ul :pageIndex="pageIndex" :style="{position: UlBarPosition, top: '0'}"></Ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import Ul from '../components/UlBar.vue'
import Notice from '@/components/Notice.vue'
import { useRoute } from 'vue-router'
import { findAdvertisementByPosition,adPictureApi } from '@/api/home'
import { ElMessage } from 'element-plus'

const pageIndex = ref(0)
const route = useRoute()
if (route.path == '/') {
  pageIndex.value = 0
} else if (route.path == '/live') {
  pageIndex.value = 1
} else if (route.path == '/resource') {
  pageIndex.value = 2
} 
else if(route.path == '/talk'){
  pageIndex.value = 3
}else if (route.path == '/signIn') {
  pageIndex.value = 4
} else {
  pageIndex.value = -1
}
const ads = ref([])
const isLoading = ref(true)
const init = async()=>{
  await findAdvertisementByPosition("home")
  .then(res=>{
    let data = res.data.object
    if(res.data.msg == "SUCCESS"){
      ads.value = data
    }
    else{
      ElMessage.error("获取广告失败")
    }
  })
  .catch(e=>{
    ElMessage.error("获取广告失败")
  })
  isLoading.value = false
}

const imgWidth = ref('100%')
const imgHeight = ref('100%')
const checkWindowWidth = () => {
  let width = window.innerWidth
  if (width <= 905) {
    imgWidth.value = 'auto'
    imgHeight.value = '100%'
  } else {
    imgHeight.value = 'auto'
    imgWidth.value = '100%'
  }
}
const UlBarPosition = ref("relative")
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

const handleScroll = debounce(() => {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop
  const triggerPosition = 500
  
  if (scrollPosition >= triggerPosition) {
    UlBarPosition.value = "fixed"
  }
  else{
    UlBarPosition.value = "relative"
  }
}, 1)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
onMounted(()=>{
  checkWindowWidth()
  init()
  window.addEventListener('scroll', handleScroll)
})
window.addEventListener('resize', checkWindowWidth)
</script>
<style scoped>
.content {
  min-height: calc(100vh - 500px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
.notice {
  position: absolute;
  top: 10px;
  width: 100vw;
  z-index: 999;
}
.ulFixed{
  position: fixed !important;
  top: 0 !important;
}
</style>
