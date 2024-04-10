<template>
    <div>
        <Ul class="ul"></Ul>
        <div class="content">
            <NoticesContent/>
        </div>
    </div>
</template>
<script setup>
import Ul from '@/components/UlBar.vue';
import NoticesContent from './content/NoticeContent.vue';
</script>
<style scoped>
.ul {
  position: fixed;
}
.content{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px;
}
</style>