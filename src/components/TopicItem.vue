<template>
  <tr class="item">
    <td style="width: 710px">
      <div class="info">
        &nbsp;[<span class="label">{{ props.item.label }}</span
        >]
        <span class="title" @click="onClickTitle(props.item.id)">{{ props.item.title }}</span>
      </div>
    </td>
    <td style="width: 100px">
      <div class="author">
        <span @click="onClickUser(props.item.id)">{{ props.item.name }}</span>
        <br />
        <span>{{ props.item.date }}</span>
      </div>
    </td>
    <td style="width: 80px">
      <div class="num">{{ props.item.view }}/{{ props.item.comment }}</div>
    </td>
    <td style="width: 40px">
      <div class="head">
        <img class="img" src="" alt="" />
      </div>
    </td>
    <td v-show="isEdit" class="operate" style="width: 130px">
      &ensp;
      <McBtn :font-size="14" :padding="5" text="编 辑" type="oak" @click="onEdit(props.item.id)" />
      &ensp;
      <McBtn :font-size="14" :padding="5" text="删 除" type="oak" @click="onDel(props.item.id)" />
    </td>
  </tr>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import McBtn from './McBtn.vue'
const props = defineProps({
  item: Object,
  isEdit: {
    type: Boolean,
    default: false,
    require: false
  }
})

const router = useRouter()
const onClickTitle = (id) => {
  router.push('/topic/detail/'+id)
}
const onClickUser = () => {}
const onEdit = () => {}
const onDel = () => {}
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
  width: 50px;
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
.operate {
  display: flex;
  padding: 2.5px 5px;
}
</style>
