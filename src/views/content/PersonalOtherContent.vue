<template>
  <Book>
    <Empty :height="30" />
    <div class="basicInfo">
      <div class="avatarOut">
        <img class="avatar" :src="getAvatarApi + avatar" alt="" width="100%" height="100%"/>
      </div>
      <div class="info">
        <div class="exp">
          <ExpBar :lv="level" :exp="exp" :maxExp="maxExp" />
        </div>
        <div class="infomation">
          <span
            >{{ name }} <span class="user">({{ user }})[{{ role=='admin'?'管理员':role=='moderator'?'版主':'普通用户'}}]</span></span><br />
          <span class="birth">出生日期：{{ birthday }}</span
          ><br />
          <span class="gender">性别：{{ gender }}</span>
        </div>
      </div>
      <div class="add-friend-btn">
        <McBtn text="添加好友" @click="addFriend" />
      </div>
    </div>
    <div class="topic">
      <TopicList
        :isNull="topicData == null || topicData.length == 0"
        v-loading="loading"
        :loading="loading"
        element-loading-background="#11111100"
        element-loading-text="加载中..."
      >
        <TopicItem v-for="(item, index) in topicData" :key="index" :item="item" />
      </TopicList>
      <Empty :height="10" />
      <div class="pageOperate">
        <el-pagination
          class="custom"
          layout="prev, pager, next"
          :total="topicTotal"
          :page-size="20"
          :background="true"
          @current-change="changePage"
        />
      </div>
    </div>
  </Book>
</template>
<script setup>
import ExpBar from '../../components/ExpBar.vue'
import Empty from '../../components/FitEmpty.vue'
import TopicList from '@/components/TopicList.vue'
import TopicItem from '@/components/TopicItem.vue'
import { findUserinfo, getAvatarApi } from '@/api/user'
import Book from '@/components/Book.vue'
import { onMounted, ref } from 'vue'
import { findAllTopicByUser } from '@/api/topic'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import McBtn from '@/components/McBtn.vue'
import { applyFriend } from '@/api/friend'
const loading = ref(true)
const route = useRoute()
const user = ref('')
const name = ref('')
const role = ref('')
const birthday = ref('')
const avatar = ref('')
const level = ref(0)
const exp = ref(0)
const maxExp = ref(0)
const gender = ref('')
const checkGender = (e)=>{
  if (e == 0) {
    gender.value = '隐藏'
  } else if (e == 1) {
    gender.value = '男'
  } else if (e == 2) {
    gender.value = '女'
  } else if (e == 3) {
    gender.value = '沃尔玛购物袋'
  }
}
const topicData = ref([])
const topicTotal = ref(0)
const page = ref(1)
const changePage = (e) => {
  page.value = e
  getTopic()
}
const getTopic = async () => {
  await findAllTopicByUser(page.value, user.value)
    .then((res) => {
      let data = res.data.object
      let num = res.data.num
      topicData.value = data
      topicTotal.value = num
      loading.value = false
    })
    .catch((err) => {
      ElMessage.error('获取主题列表失败')
      loading.value = false
    })
}
const getUserInfo = async()=>{
  await findUserinfo(route.params.user).then(res=>{
    let msg = res.data.msg
    if(msg == 'USER_ERROR'){
      ElMessage.error('用户不存在')
    }
    else{
      let data = res.data.object
      user.value = data.user
      name.value = data.name
      birthday.value = data.birthday
      avatar.value = data.avatar
      level.value = data.level
      exp.value = data.exp
      maxExp.value = data.maxExp
      role.value = data.role
      checkGender(data.gender)
      getTopic()
    }
    
  }).catch(err=>{
    ElMessage.error('获取用户信息失败')
  })
}
onMounted(getUserInfo)
const addFriend = () => {
  ElMessageBox.prompt('请输入添加好友的原因', '添加好友', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '',
    beforeClose: async(action, instance, done) =>{
        if(action == 'cancel'){
          done()
          return
        }
        const reason = instance.inputValue
        if (!reason || !reason.trim()) {
          ElMessage.error('原因不能为空')
          return
        }
        if(reason.length > 50){
          ElMessage.error('原因不能超过50字')
          return
        }
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '正在提交中...'
        let isSuccess = false
        await applyFriend(user.value,reason)
        .then(res=>{
          let msg = res.data.msg
          if(msg == 'SUCCESS'){
            ElMessage.success('好友申请已发送')
            isSuccess = true
          }
          else if(msg == 'SUCCESS_ADD'){
            ElMessage.error('成功添加好友')
            isSuccess = true
          }
          else if(msg == 'USER_NOT_EXIST'){
            ElMessage.error('用户不存在')
          }
          else if(msg == 'ALREADY_FRIEND'){
            ElMessage.error('该用户已添加好友')
          }
          else if(msg == 'APPLICATION_EXIST'){
            ElMessage.error('好友申请已存在')
          }
        })
        .catch(e=>{
          ElMessage.error('服务异常')
        })
        if(isSuccess){
          done()
        }
        instance.confirmButtonLoading = false
        instance.confirmButtonText = '添加'
      }
  })
}
</script>
<style scoped>
.basicInfo {
  height: 100px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  position: relative;
}
.avatarOut {
  width: 80px;
  height: 80px;
  padding: 5px;
  background-color: #f1f1f1;
  margin: 0 10px;
}
.info {
  margin: 0 10px;
  display: flex;
  flex-direction: column;
}
.exp {
  width: 400px;
  height: 30px;
}
.infomation {
  margin: 0px 10px;
  font-size: 15px;
}
.user {
  font-size: 12px;
}
.user:hover {
  text-decoration: underline;
}
.birth {
  font-size: 12px;
}
.gender {
  font-size: 12px;
}
.add-friend-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.topic {
  position: relative;
  padding: 10px 0;
}
.pageOperate {
  display: flex;
  justify-content: end;
}
</style>
