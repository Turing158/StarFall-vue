<template>
  <div>
    <div class="top"></div>
    <div class="left" :style="{ height: leftHeight + 'px' }"></div>
    <div class="right" :style="{ height: rightHeight + 'px' }"></div>
    <div class="mainContent" ref="mainContent">
      <slot></slot>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const mainContent = ref(null);
const leftHeight = ref(0);
const rightHeight = ref(0);
let resizeObserver = null;

onMounted(() => {
  if (mainContent.value) {
    leftHeight.value = mainContent.value.offsetHeight;
    rightHeight.value = mainContent.value.offsetHeight;

    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const height = entry.contentRect.height;
        leftHeight.value = height;
        rightHeight.value = height;
      }
    });
    
    resizeObserver.observe(mainContent.value);
  }
});

onUnmounted(() => {
  if (resizeObserver && mainContent.value) {
    resizeObserver.unobserve(mainContent.value);
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
  </script>
<style scoped>
.mainContent {
  position: relative;
  background-color: #fbf2db;
  width: 961px;
  left: 84px;
  transition: all 250ms;
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
