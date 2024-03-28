<template>
  <tr class="comment">
    <td style="width: 180px">
      <div class="user">
        <div class="name">
          <a :href="'/personal/other/'+props.data.user"><img src="../assets/img/name_tag.png" alt="" />{{ props.data.name }}</a>
        </div>
        <div class="avatar">
          <a :href="'/personal/other/'+props.data.user">
            <img src="../assets/avatar/default.png" alt="" />
          </a>
        </div>
        <div class="exp">
          <ExpBar :lv="props.data.level" :exp="props.data.exp" :maxExp="props.data.maxExp" />
        </div>
      </div>
    </td>
    <td>
      <div class="main">
        <div>
          <slot name="top"></slot>
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
        <div class="bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    </td>
  </tr>
</template>
<script setup>
import ExpBar from '@/components/ExpBar.vue'
const props = defineProps({
  data: Object,
})
</script>
<style scoped>
.comment {
  border-top: 1px solid #cfb78e;
}
.user {
  background-color: #e3c99e;
  width: 180px;
  border: 0;
  border-right: 1px solid #cfb78e;
  min-height: 300px;
}
.user .name {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #cfb78e;
}
.user .name a {
  cursor: pointer;
  text-decoration: none;
  color: #131313;
}
.user .name a:hover {
  text-decoration: underline;
}
.user .avatar {
  width: 130px;
  height: 130px;
  background-color: #f1f1f1;
  margin: 15px;
  border: 10px solid #f1f1f1;
}
.user .avatar img {
  width: 100%;
  height: 100%;
}
.user .exp {
  width: 150px;
  margin: 0 15px;
}
.main {
  min-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.main .content {
  min-height: 220px;
}
.main .bottom {
  min-height: 28px;
  border-bottom: 1px solid #cfb78e;
}
</style>