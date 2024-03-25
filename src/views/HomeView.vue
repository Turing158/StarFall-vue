<template>
  <div class="main">
    <div class="notice">
      <Notice />
    </div>
    <el-carousel height="500px" trigger="click" motion-blur :interval="3000">
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
    <Ul :pageIndex="pageIndex"></Ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import Ul from '../components/UlBar.vue'
import Notice from '@/components/Notice.vue'
import { useRoute } from 'vue-router'

const pageIndex = ref(0)
const route = useRoute()
if (route.path == '/') {
  pageIndex.value = 0
} else if (route.path == '/topic') {
  pageIndex.value = 2
} else {
  pageIndex.value = -1
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
.test {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.test1 {
  background-color: #fff;
}
.test2 {
  background-color: #aaa;
}
.test3 {
  background-color: #888;
}
.test4 {
  background-color: #444;
}
</style>
