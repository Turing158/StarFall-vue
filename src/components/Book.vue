<template>
  <div>
    <div class="top"></div>
    <div class="left" :style="{height:mainDivHeight+'px'}"></div>
    <div class="right" :style="{height:mainDivHeight+'px'}"></div>
    <div class="main" ref="mainDiv">
      <slot></slot>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
const mainDiv = ref();
const mainDivHeight = ref(0);
const setHeight = () => {
    mainDivHeight.value = mainDiv.value.clientHeight;
    console.log(mainDivHeight.value);
}
onMounted(setHeight)
</script>
<style scoped>
.main {
    position: relative;
    background-color: #FBF2DB;
    width: 961px;
    left: 84px;
}
.top {
  position: relative;
  width: 1129px;
  height: 59px;
  background-image: url(../assets/img/home_top.png);
}
.bottom {
  position: relative;
  width: 1129px;
  height: 59px;
  top: 92%;
  background-image: url(../assets/img/home_foot.png);
}
.left {
  position: absolute;
  background-image: url(../assets/img/left.png);
  width: 84px;
}
.right {
  position: absolute;
  background-image: url(../assets/img/right.png);
  width: 84px;
  margin-left: 1045px;
}
</style>
