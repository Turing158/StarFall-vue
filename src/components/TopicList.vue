<template>
  <div>
    <table>
      <tr v-show="!props.isNull" class="top">
        <th>主题</th>
        <th>作者</th>
        <th style="text-align: left">观看/评论</th>
        <th>头像</th>
        <th v-show="props.isEdit">操作</th>
      </tr>
      <tr v-show="props.isNull && !loading">
        <td class="item" colspan="6"><div class="null">未找到数据！</div></td>
      </tr>
      <tr v-show="loading">
        <td class="item" colspan="6"><div class="loading"></div></td>
      </tr>
      <slot> </slot>
    </table>
  </div>
</template>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
.null {
  height: 40px;
  line-height: 20px;
  border: 1px solid #a58960;
  background-color: #f3debf;
  text-align: center;
  line-height: 40px;
}
.top {
  border: 1px solid #a58960;
  background-color: #f3debf;
  height: 30px;
  font-size: 12px;
}
.loading{
  height: 400px;
  border: 1px solid #a58960;
  background-color: #f3debf;
  text-align: center;
}
</style>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isNull: {
    type: Boolean,
    default: true,
    require: false
  },
  isEdit: {
    type: Boolean,
    default: false,
    require: false
  },
  loading:{
    type:Boolean,
    default:true
  }
})
</script>
