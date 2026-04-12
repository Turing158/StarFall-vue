<template>
    <div v-loading="loading" @click="changeCode()" class="code" :style="{width:width,height:height,margin:margin}">
        <img width="100%" height="100%" :src="codeImg" alt="">
    </div>
</template>
<script setup>
import { ref } from 'vue'
import request from '@/util/request';
const loading = ref(false)
const getRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint32Array(20);
    crypto.getRandomValues(randomValues);
    const now = Date.now();
    const perfNow = Date.now();
    const timeMix = (now ^ Math.floor(perfNow * 1000)) ;
    for(let i = 0; i < 20; i++) {
        const combined = (randomValues[i] ^ (timeMix >>> (i % chars.length))) % chars.length;
        result += chars[Math.abs(combined)];
    }
    return result;
}
const initCode = () => {
    loading.value = true
    let codeResult; 
    if(localStorage.getItem('code')){
        let oldKey = localStorage.getItem('code')
        localStorage.setItem('code',random.value)
        codeResult = request.getUri()+'/code/image/find?' + random.value + '&' + oldKey
    }
    else{
        codeResult = request.getUri()+'/code/image/find?' + random.value
    }
    loading.value = false
    return codeResult
}
const random = ref(getRandomCode())
const codeImg = ref(initCode())

const changeCode = () => {
  loading.value = true
  let newKey = getRandomCode()
  codeImg.value = request.getUri()+'/code/image/find?' + newKey + '&' + random.value
  random.value = newKey
  localStorage.setItem('code',newKey)
  loading.value = false
}
defineExpose({
    random,changeCode
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
