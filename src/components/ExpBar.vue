<template>
  <div>
    <div class="expInfo">
      <div class="level">lv. {{ props.lv }}</div>
      <div class="expNum">{{ props.exp }}/{{ props.maxExp }}</div>
    </div>
    <div class="expOut">
      <div class="expIn" :style="{ width: (props.exp / props.maxExp) * 100 + '%' }"></div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  lv: {
    type: Number,
    require: true,
    default: 0
  },
  exp: {
    type: Number,
    require: true,
    default: 1
  },
  maxExp: {
    type: Number,
    require: true,
    default: 2
  }
})
</script>
<style scoped>
.expOut {
  width: 100%;
  height: 10px;
  background-image: url(../assets/img/lv0.png);
  border-radius: 10px;
}
.expIn {
  height: 10px;
  background-image: url(../assets/img/lv1.png);
  border-radius: 10px;
}
.expInfo {
  display: flex;
  padding: 0 5px;
  font-size: 12px;
}
.level {
  text-align: left;
  flex: 1;
}
.expNum {
  text-align: right;
  flex: 1;
}
</style>
