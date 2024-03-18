<template>
  <Book>
    <Empty :height="30" />
    <div class="setHead">
      <img class="head" src="" alt="" />
      <McBtn text="选择图片" />
    </div>
    <div class="setInfo">
      <table>
        <tr>
          <td>昵称 :</td>
          <td><el-input /></td>
        </tr>
        <tr>
          <td>性别 :</td>
          <td>
            <el-select placeholder="请选择性别" v-model="gender">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </td>
        </tr>
        <tr>
          <td>生日 :</td>
          <td><el-date-picker v-model="date" type="date" placeholder="请选择出生日期" /></td>
        </tr>
      </table>
    </div>
    <Empty :height="20"/>
    <div class="operate">
        <McBtn text="保存" :margin="10"/>
        <McBtn text="取消" :margin="10"/>
    </div>
  </Book>
</template>
<script setup>
import { ref } from 'vue'
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
const options = [
  {
    value: 'hide',
    label: '隐藏'
  },
  {
    value: 'man',
    label: '男'
  },
  {
    value: 'woman',
    label: '女'
  },
  {
    value: 'unknow',
    label: '沃尔玛购物袋'
  }
]
const gender = ref()
const date = ref()
</script>
<style scoped>
.setHead {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.head {
  width: 100px;
  height: 100px;
  margin: 10px;
  background-color: aliceblue;
}
.setInfo{
    display: flex;
    justify-content: center;
}
.operate{
    display: flex;
    justify-content: center;
}
</style>
