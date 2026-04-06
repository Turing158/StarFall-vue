<template>
  <tr class="item">
    <td>
      <div class="info">
        &nbsp;
        <span class="label" v-if="props.item.display == -1" style="color: darkred;">[待整改]</span>
        <span class="label" v-if="props.item.display == 0" style="color: #666;">[草稿]</span>
        <span class="label" @click="onClickLabel(props.item.label)">[{{ props.item.label }}]</span>
        <span class="titleOut" >
          <span class="title" @click="onClickTitle(props.item.id)">{{ props.item.title }}</span>
        </span>
      </div>
    </td>
    <td style="width: 100px">
      <div class="author">
        <span @click="onClickUser(props.item.user)" :title="props.item.name">{{ props.item.name }}</span>
        <span>{{ props.item.date }}</span>
      </div>
    </td>
    <td style="width: 80px">
      <div class="num">{{ props.item.view }}/{{ props.item.comment }}</div>
    </td>
    <td style="width: 40px">
      <div class="avatar">
        <img class="img" :src="getAvatarSrc(props.item.avatar)" alt="" />
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
import { useRouter } from 'vue-router'
import McBtn from './McBtn.vue'
import { deleteTopic } from '@/api/topic';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { getAvatarSrc } from '@/api/user';
const props = defineProps({
  item: Object,
  titleMaxWidth:String,
  isEdit: {
    type: Boolean,
    default: false,
    require: false
  },
  labelClick: Function,
})
const router = useRouter()
const onClickTitle = (id) => {
  router.push('/topic/detail/' + id)
}
const onClickUser = () => {
  router.push('/personal/other/' + props.item.user)
}
const onEdit = (id) => {
  router.push('/topic/resource/' + id)
}
const onClickLabel = (label) => {
  props.labelClick(label)
}

const onDel = async(id) => {
  ElMessageBox.confirm('确定删除此评论吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await deleteTopic(id).then(res=>{
        let msg = res.data.msg
        if(msg == 'SUCCESS'){
          router.go(0)
          ElNotification({
            title: '删除成功',
            message: '成功删除主题:'+props.item.title,
            type: 'success'
          })
        }
        else{
          ElNotification({
            title: '删除失败',
            message: '删除主题:'+props.item.title+'失败',
            type: 'error'
          })
        }
      }).catch(err=>{
        ElMessage.error('删除主题失败')
        console.log(err);
      })
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
  
}
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
  position: relative;
  display: flex;
  align-items: center;
}
.label {
  color: #131313;
  cursor: pointer;
  font-size: 14;
  position: relative;
}
.label:hover {
  color: #171964;
  text-decoration: underline;
}
.titleOut{
  position: relative;
  margin-left: 10px;
  display: inline-flex;
  max-width: 85%;
  flex: 1;
  min-width: 0;
}
.title {
  font-size: 18;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

.title:hover {
  text-decoration: underline;
}
.author {
  width: 100px;
  height: 30px;
  position: relative;
}
.author span{
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.author span:nth-child(1) {
  position: relative;
  font-size: 15px;
  top: -8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.author span:nth-child(1):hover {
  text-decoration: underline;
}

.author span:nth-child(2) {
  position: relative;
  top: -20px;
  font-size: 12px;
  color: #666;
}
.num {
  width: 50px;
  font-size: 13px;
}
.avatar {
  width: 40px;
}
.img {
  position: relative;
  top: 5px;
  width: 30px;
  height: 30px;
}
.operate {
  display: flex;
  padding: 2.5px 5px;
}
</style>
