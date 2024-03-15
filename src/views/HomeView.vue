<template>
  <div class="main">
    <el-carousel height="500px" trigger="click">
      <el-carousel-item>
        <img src="../assets/img/top/top1.png" alt="" width="100%" />
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/img/top/top2.png" alt="" width="100%" />
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/img/top/top3.png" alt="" width="100%" />
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/img/top/top4.png" alt="" width="100%" />
      </el-carousel-item>
    </el-carousel>
    <Ul :pageIndex="pageIndex"></Ul>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Ul from '../components/UlBar.vue'
import { useRoute } from 'vue-router'
const pageIndex = ref(0)
const router = useRoute()
if (router.path == '/') {
  pageIndex.value = 0
} else {
  pageIndex.value = 2
}
</script>
<style scoped>
.content {
  min-height: calc(100vh - 500px);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
