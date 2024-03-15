<template>
    <tr class="item">
      <td style="width: 710px">
        <div class="info">
          &nbsp;[<span class="label">{{ item.label }}</span
          >]
          <span class="title">{{ item.title }}</span>
        </div>
      </td>
      <td style="width: 100px">
        <div class="author">
          <span>{{ item.author }}</span>
          <br />
          <span>{{ item.date }}</span>
        </div>
      </td>
      <td style="width: 100px">
        <div class="num">{{ item.viewNum }}/{{ item.commentNum }}</div>
      </td>
      <td style="width: 40px">
        <div class="head">
          <img class="img" src="" alt="" />
        </div>
      </td>
    </tr>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  item: Object
})
const item = ref(props.item)
</script>
<style scoped>
.item {
  border: 1px solid #a58960;
  border-top: 0;
  text-align: center;
  line-height: 30px;
  background-color: #f3debf;
  width: 100%;
}

.info {
  width: 600px;
  text-align: left;
  line-height: 30px;
}
.label {
  color: #131313;
  cursor: pointer;
  font-size: 14;
}
.label:hover {
  color: #171964;
  text-decoration: underline;
}
.title {
  font-size: 18;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
}
.title:hover {
  text-decoration: underline;
}
.author {
  width: 100px;
  height: 30px;
}
.author span:nth-child(1) {
  position: relative;
  font-size: 15px;
  top: -8px;
  cursor: pointer;
}
.author span:nth-child(1):hover {
  text-decoration: underline;
}
.author span:nth-child(3) {
  position: relative;
  top: -24px;
  font-size: 12px;
  color: #666;
}
.num {
  width: 100px;
  font-size: 13px;
}
.head {
  width: 40px;
}
.img {
  position: relative;
  top: 5px;
  width: 30px;
  height: 30px;
  background-color: #a58960;
}
</style>
