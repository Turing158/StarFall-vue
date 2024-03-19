<template>
    <div class="topicDetail">
        <Ul/>
        <div class="contentOut">
            <Book>

            </Book>
        </div>
    </div>
</template>
<script setup>
import Ul from '../components/UlBar.vue'
import Book from '../components/Book.vue'
import Empty from '../components/FitEmpty.vue'
</script>
<style scoped>
.contentOut{
    margin: 20px 0;
    min-height: 100vh;
}
</style>