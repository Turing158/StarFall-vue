<template>
  <div>
    <Book>
      <div class="content">
        <el-button @click="click()"></el-button>
      </div>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import useUserStore from '@/stores/user'
const userStore = useUserStore()
const click = () => {
    userStore.setUserObject("user","name",1,1,2,1,"0000-00-00")
}
</script>
