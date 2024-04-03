<template>
  <UserContentModel :data="props.data">
    <template v-slot:top>
      <div class="top">
        <div class="date">
          <img src="../../assets/img/time.png" alt="" /> 发表于{{ props.data.date }}
        </div>
        <div class="count">
          <a href="" v-show="props.index == 0 && page == 1"># 沙发</a>
          <a href="" v-show="props.index == 1 && page == 1"># 板凳</a>
          <a href="" v-show="props.index == 2 && page == 1"># 地板</a>
          <a href="" v-show="props.index >= 3 && page == 1"># {{ props.index + 1 }}</a>
          <a href="" v-show="page != 1"># {{ props.index + 1 + (page - 1) * 10 }}</a>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <div class="content">
        <div v-html="toMd()"></div>
      </div>
    </template>
    <template v-slot:bottom>
      <div class="bottom">
        <span class="del" v-show="isMe">
          <slot></slot>
        </span>
      </div>
    </template>
  </UserContentModel>
</template>
<script setup>
import UserContentModel from '@/components/UserContentModel.vue'
const props = defineProps({
  index: Number,
  data: Object,
  page: Number,
  isMe: Boolean
})
import { marked } from 'marked'
const toMd = () => {
  if (props.data.content == null) return
  return marked(props.data.content)
}
toMd()
defineExpose({
  toMd
})
</script>
<style scoped>
.comment {
  border-top: 1px solid #cfb78e;
}
.top {
  height: 30px;
  border-bottom: 1px solid #cfb78e;
  display: flex;
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
.count {
  width: 50%;
  text-align: right;
  margin-right: 10px;
  line-height: 30px;
  font-size: 14px;
  color: #131313;
}
.count a {
  color: #131313;
  text-decoration: none;
}
.count a:hover {
  text-decoration: underline;
}
.content {
  padding: 10px;
}
.bottom {
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: end;
}
.del {
  position: relative;
  cursor: pointer;
  color: #131313;
  margin-right: 10px;
  font-size: 13px;
  top: -5px;
}
.del:hover {
  text-decoration: underline;
}
</style>
