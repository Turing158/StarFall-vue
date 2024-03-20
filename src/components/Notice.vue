<template>
  <div class="notice-con">
    <div class="notice-main-con">
      <div class="notice-main">
        <div class="notice" ref="notice">好不错已占据</div>
        <div class="notice" ref="notice">好不错已占据1</div>
        <div class="notice" ref="notice">好不错已占据</div>
        <div class="notice" ref="notice">好不错已占据</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
const width = ref(0)
const notice = ref()
const setWidth = () => {
  console.log(notice.value)
}
onMounted(setWidth)
</script>
<style scoped>
.notice-con {
  width: 100%;
  height: 40px;
  line-height: 24px;
  margin: 0 auto 15px;
  color: #fff;
  font-size: 14px;
  overflow: hidden;
  background-color: #131313aa;
}

.notice-main-con {
  margin: 0 16px 0 25px;
  overflow: hidden;
}

.notice-main {
  display: inline-block;
  white-space: nowrap;
  width: auto;
  -moz-animation: move 10s infinite linear;
  -webkit-animation: move 10s infinite linear;
  animation: move 10s infinite linear;
}

.notice {
  display: inline-block;
  padding: 0 80%;
  line-height: 40px;
}

@-moz-keyframes move {
  0% {
    transform: translateX(110%);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-110%);
  }
}

@-webkit-keyframes move {
  0% {
    transform: translateX(110%);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-110%);
  }
}

@keyframes move {
  0% {
    transform: translateX(110%);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-110%);
  }
}
</style>
