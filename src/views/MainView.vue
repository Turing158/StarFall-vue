<template>
  <div class="main">
    <router-view/>
    <div class="bottom"></div>
    <el-backtop>
      <div class="backTop">
        <img style="width: 100%;" src="../assets/img/icon/arrow.png" alt="">
      </div>
    </el-backtop>
  </div>
</template>
<script setup>
import { initWebSocket } from '@/util/handleNotice'
import { onMounted } from 'vue'

const init = ()=>{
  initWebSocket()
}
onMounted(init)
</script>
<style scoped>
.main {
  overflow-x: hidden;
}
.backTop{
  height: 100%;
  width: 100%;
  background-color: #e3c99e;
  box-shadow: var(--el-box-shadow-lighter);
  border-radius: 10px
}
.bottom {
  position: relative;
  width: 100vw;
  height: 50px;
  background-image: url(../assets/img/tail.png);
  background-size: 2%;
  z-index: 1;
}
</style>
