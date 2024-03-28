<template>
    <div @click="changeCode()" class="code" :style="{width:width,height:height,margin:margin}">
        <img width="100%" height="100%" :src="codeImg" alt="">
    </div>
</template>
<script setup>
import { ref } from 'vue'
let date = new Date()
const codeImg = ref('http://localhost:8080/getCodeImage?r' + date.getTime())
const changeCode = () => {
  codeImg.value = 'http://localhost:8080/getCodeImage?r' + new Date().getTime()
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
