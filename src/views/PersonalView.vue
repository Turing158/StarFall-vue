<template>
  <div>
    <Ul class="ul"></Ul>
    <div class="outContent">
      <Book>
        <div class="operate">
          <router-link v-for="(item,index) in pages" :key="index" :to="item.path" @click="pageIndex = index"><mc-btn :text="item.name" :type="pageIndex==index?'birch':null"/></router-link>
        </div>
        <div class="insideContent">
          <router-view />
        </div>
      </Book>
    </div>
  </div>
</template>
<script setup>
import Ul from '../components/UlBar.vue'
import Book from '../components/Book.vue'
import McBtn from '../components/McBtn.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
const pages = [
  {
    name: '个人信息',
    path: '/personal'
  },
  {
    name: '个人设置',
    path: '/personal/setting'
  },
  {
    name: '修改密码',
    path: '/personal/password'
  },
  {
    name: '邮箱',
    path: '/personal/email'
  }
]
const route = useRoute()
const pageIndex = ref(0)
console.log(route.path)
if (route.path == '/personal') {
  pageIndex.value = 0
} else if (route.path == '/personalSet') {
  pageIndex.value = 1
} else if (route.path == '/personalSet') {
  pageIndex.value = 2
} else {
  pageIndex.value = 3
}
</script>
<style scoped>
.ul {
  position: fixed;
}
.outContent {
  min-height: 100vh;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.operate {
  display: flex;
}
.operate a {
  margin: 0 10px;
  text-decoration: none;
}
</style>
