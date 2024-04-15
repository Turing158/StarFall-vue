<script setup>
import MainView from './views/MainView.vue'
</script>

<template>
  <div class="main">
    <router-view/>
  </div>
</template>

<style scoped>
.main {
  background-image: url(./assets/img/bg.png);
  overflow-x: hidden;
}

</style>
