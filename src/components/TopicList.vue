<template>
  <div>
    <table>
      <tr>
        <th></th>
      </tr>
      <tr v-show="isNull">
        <td class="item" colspan="5"><div class="null">未找到数据！</div></td>
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
</style>

<script setup>
import { ref } from "vue"

const props = defineProps({
  isNull: {
    type:Boolean,
    default:true
  }
})
const isNull = ref(props.isNull)
</script>
