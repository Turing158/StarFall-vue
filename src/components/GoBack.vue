<template>
    <div class="back" @click="goBack">
      <img class="default-img" src="@/assets/img/icon/left.png" alt="返回"/>
      <img class="hover-img" src="@/assets/img/icon/lefthover.png" alt="返回"/>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>
<style scoped>
.back {
  position: fixed;
  top: 80px;
  left: 40px;
  width: 64px;
  height: 32px;
  cursor: pointer;
  z-index: 1000;
}
.back img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
}

.back .default-img {
  opacity: 1;
}

.back .hover-img {
  opacity: 0;
}

.back:hover .default-img {
  opacity: 0;
}

.back:hover .hover-img {
  opacity: 1;
}
</style>