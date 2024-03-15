<script setup>
import Ul from '../components/UlBar.vue'
</script>

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
    <div class="ul">
      <Ul />
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
.content {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ul {
  position: sticky;
  top: 10px;
  z-index: 999;
}
</style>
