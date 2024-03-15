<template>
    <div class="empty" :style="{height:props.height+'px'}"></div>
</template>
<script setup>
const props = defineProps({
    height:Number
})
</script>

<style scoped>
.empty{
    width: 100%;
}
</style>