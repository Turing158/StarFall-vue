<template>
  <table class="editComment">
    <UserContentModel :data="userStore">
      <template v-slot:top>
        <div class="top">
          <div class="date">
            <img src="../assets/img/time.png" alt="" /> 发表于{{
              new Date().toLocaleString().substr(0, 10)
            }}
          </div>
        </div>
      </template>
      <template v-slot:content>
        <div class="content">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            style="width: 100%;"
            show-word-limit
            :rows="10"
            v-model="content"
            resize="none"
            input-style="background-color: #fbf2db;border: 0;outline: none;bor"
          ></el-input>
        </div>
      </template>
      <template v-slot:bottom>
        <div class="bottom">
            <div class="operate">
                <el-input style="width: 80px;" placeholder="验证码" maxlength="4"/>
                <Code ref="code" width="75px" height="30px" margin="0 5px"/>
                <McBtn text="发 话" :margin="10"/>
            </div>
        </div>
      </template>
    </UserContentModel>
  </table>
</template>
<script setup>
import { ref } from 'vue'
import UserContentModel from '@/components/UserContentModel.vue'
import McBtn from '@/components/McBtn.vue'
import Code from '@/components/Code.vue'
import useUserStore from '@/stores/user'
const userStore = useUserStore()
const content = ref('')
const code = ref()
</script>
<style scoped>
.editComment {
  border-top: 1px solid #cfb78e;
  border-collapse: collapse;
  width: 100%;
}
.top {
  display: flex;
  border-bottom: 1px solid #cfb78e;
}
.date {
  font-size: 12px;
  line-height: 30px;
  margin-left: 10px;
  width: 50%;
}
.date img {
  position: relative;
  top: 4px;
}
.content{
    height: 220px;
}
.bottom{
    height:48px;
}
.operate{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 48px;
    padding-right: 10px;
}
</style>
