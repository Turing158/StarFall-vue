<template>
  <div class="topicDetail">
    <Ul class="ul" style="position: fixed;"></Ul>
    <div class="contentOut">
      <Book>
        <div>
          <TopicDetailContent/>
        </div>
      </Book>
    </div>
  </div>
</template>
<script setup>
import Ul from '../components/UlBar.vue'
import Book from '../components/Book.vue'
import Empty from '../components/FitEmpty.vue'
import TopicDetailContent from './content/TopicDetailContent.vue';
</script>
<style scoped>
.ul {
  top: 0;
}
.contentOut {
  min-height: calc(100vh - 230px);
  margin: 50px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
