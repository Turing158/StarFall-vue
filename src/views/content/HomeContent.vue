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
import {getAll} from '@/api/test.js'
const click = ()=>{
  console.log(getAll());
}
</script>
