<template>
  <Book>
    <Empty :height="50" />
    <div class="content">
      <table>
        <tr>
          <td>旧密码:</td>
          <td><el-input placeholder="请输入旧密码" /></td>
        </tr>
        <tr>
          <td>新密码:</td>
          <td><el-input placeholder="请输入新密码" /></td>
        </tr>
        <tr>
          <td>再次输入:</td>
          <td><el-input placeholder="请再次输入新密码" /></td>
        </tr>
      </table>
    </div>
    <Empty :height="20" />
    <div class="operate">
      <McBtn text="保存" :margin="10" />
      <McBtn text="取消" :margin="10" />
    </div>
  </Book>
</template>
<script setup>
import Book from '@/components/Book.vue'
import Empty from '@/components/FitEmpty.vue'
import McBtn from '@/components/McBtn.vue'
</script>
<style scoped>
.content {
  display: flex;
  justify-content: center;
}
.operate {
  display: flex;
  justify-content: center;
}
</style>
