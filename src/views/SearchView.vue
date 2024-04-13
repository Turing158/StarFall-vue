<template>
    <div>
        <Ul class="ul"></Ul>
        <div class="content">
            <SearchContent/>
        </div>
    </div>
</template>
<script setup>
import Ul from '@/components/UlBar.vue';
import SearchContent from '@/views/content/SearchContent.vue';
</script>
<style scoped>
.ul {
  top: 0;
  position: fixed;
}
.content{
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}
</style>