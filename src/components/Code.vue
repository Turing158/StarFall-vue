<template>
    <div @click="changeCode()" class="code" :style="{width:width,height:height,margin:margin}">
        <img width="100%" height="100%" :src="codeImg" alt="">
    </div>
</template>
<script setup>
import { ref } from 'vue'
import request from '@/util/request';
let date = new Date()
const codeImg = ref(request.getUri()+'/getCodeImage?r' + date.getTime())
const changeCode = () => {
  codeImg.value = request.getUri()+'/getCodeImage?r' + new Date().getTime()
}
defineExpose({
    changeCode
})
const props = defineProps({
    width:{
        type: String,
        default: '100px'
    },
    height:{
        type: String,
        default: '40px'
    },
    margin:{
        type: String,
        default: '0'
    }
})
</script>
<style scoped>
.code {
    cursor: pointer;
}
</style>
