<script setup>


import MainView from './views/MainView.vue';
</script>

<template>
  <div class="main">
    <MainView/>
    <div class="bottom"></div>
  </div>
</template>

<style scoped>
.main {
  background-image: url(./assets/img/bg.png);
  overflow-x: hidden;
}
.bottom {
  position: relative;
  width: 100vw;
  height: 100px;
  margin-top: 80px;
  background-image: url(./assets/img/tail.png);
  background-size: 2%;
}
</style>
