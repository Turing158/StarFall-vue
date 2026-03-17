<template>
  <table class="editComment">
    <UserContentModel :data="userStore">
      <template v-slot:top>
        <div class="top">
          <div class="date">
            <img src="../assets/img/time.png" alt="" /> 发表于{{
              new Date().toLocaleDateString().split(' ')[0]
            }}
          </div>
        </div>
      </template>
      <template v-slot:content>
        <ContentEditor 
        ref="contentEditor" 
        class="contentInput" 
        :value="content" 
        :minHeight="220" 
        :maxHeight="220" 
        editBtnPosition="right"
        previewPadding="10px"
        />
      </template>
      <template v-slot:bottom>
        <div class="bottom">
            <div class="operate">
                <el-input style="width: 80px;" placeholder="验证码" maxlength="4" v-model="code"/>
                <Code ref="codeImg" width="75px" height="30px" margin="0 5px"/>
                <slot></slot>
            </div>
        </div>
      </template>
    </UserContentModel>
  </table>
</template>
<script setup>
import { ref } from 'vue'
import UserContentModel from '@/components/UserContentModel.vue'

import Code from '@/components/Code.vue'
import useUserStore from '@/stores/user'
import ContentEditor from '@/components/ContentEditor.vue'

const userStore = useUserStore()
const content = ref('')
const code = ref('')
const codeImg = ref()
const contentEditor = ref()

defineExpose({ content, code, codeImg, contentEditor })
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
    height: 300px;
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
