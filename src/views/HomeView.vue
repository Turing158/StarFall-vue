<template>
  <div class="main">
    <el-carousel height="500px" trigger="click">
      <el-carousel-item>
        <img src="../assets/img/top/top1.png" alt="" :width="imgWidth" :height="imgHeight" />
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/img/top/top2.png" alt="" :width="imgWidth" :height="imgHeight" />
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/img/top/top3.png" alt="" :width="imgWidth" :height="imgHeight" />
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/img/top/top4.png" alt="" :width="imgWidth" :height="imgHeight" />
      </el-carousel-item>
    </el-carousel>
    <Ul :pageIndex="pageIndex" :isLogin="true"></Ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import Ul from '../components/UlBar.vue'
import { useRoute } from 'vue-router'
const pageIndex = ref(0)
const router = useRoute()
if (router.path == '/') {
  pageIndex.value = 0
} else {
  pageIndex.value = 2
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
onMounted(checkWindowWidth)
window.addEventListener('resize', checkWindowWidth)
console.log()
</script>
<style scoped>
.content {
  min-height: calc(100vh - 500px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
</style>
