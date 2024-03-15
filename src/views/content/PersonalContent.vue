<template>
  <div>
    <Empty :height="20" />
    <div class="basicInfo">
      <div class="headOut">
        <img class="head" src="" alt="" />
      </div>
      <div class="exp">
        <ExpBar />
      </div>
    </div>
  </div>
</template>
<script setup>
import ExpBar from '../../components/ExpBar.vue'
import Empty from '../../components/FitEmpty.vue'
</script>
<style scoped>
.basicInfo {
  height: 100px;
  padding: 10px;
}
.headOut {
  width: 80px;
  height: 80px;
  padding: 5px;
  background-color: #f1f1f1;
}
.exp{
    height: 30px;
}
</style>
