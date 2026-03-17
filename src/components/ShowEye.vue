<template>
    <svg :fill="color" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4484" :width="size" :height="size">
        <path d="M512 256c-168 0-329.6 106.4-384 256 54.4 149.6 216 256 384 256 167.2 0 330.4-106.4 384.8-256-55.2-149.6-217.6-256-384.8-256z m0 416c-88 0-160-72-160-160s72-160 160-160 160 72 160 160-72 160-160 160z m96-160c0 52.8-43.2 96-96 96s-96-43.2-96-96 43.2-96 96-96 96 43.2 96 96z" p-id="4485"></path>
    </svg>
</template>
<script setup>
const props = defineProps({
    size: {
        type: Number,
        default: 15
    },
    color: {
        type: String,
        default: '#a58960'
    }
})
</script>