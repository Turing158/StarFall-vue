<template>
  <div>
    <Book>
      <div class="content">
        <div class="left">
          <div class="avatarOut">
            <img :src="'/src/assets/avatar/'+userStore.avatar" alt="">
          </div>
          <el-dialog 
            v-model="signPage"
            title="签到信息" 
            width="200" 
            :show-close="false"
            align-center
            custom-class="signPage"
           >
            <el-input placeholder="请输入今天发生的事" v-model="message"></el-input>
            <Empty :height="10"/>
            <el-select placeholder="选择心情" v-model="emotion">
              <el-option label="😊开心😊" value="开心"/>
              <el-option label="😭伤心😭" value="伤心"/>
              <el-option label="🫤无聊🫤" value="无聊"/>
              <el-option label="🫤郁闷🫤" value="郁闷"/>
              <el-option label="🙃忙碌🙃" value="忙碌"/>
              <el-option label="😶无语😶" value="无语"/>
              <el-option label="😫难受😫" value="难受"/>
              <el-option label="🥱困倦🥱" value="困倦"/>
              <el-option label="😖紧张😖" value="紧张"/>
              <el-option label="😏得意😏" value="得意"/>
              <el-option label="😦惊讶😦" value="惊讶"/>
              <el-option label="🤒生病🤒" value="生病"/>
              <el-option label="🤡小丑🤡" value="小丑"/>
              <el-option label="🤬暴怒🤬" value="暴怒"/>
            </el-select>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="signPage = false">取消</el-button>
                <el-button type="primary" @click="confirmSignIn()">
                  确认
                </el-button>
              </div>
            </template>
          </el-dialog>
          <div class="info">
            <span class="date">{{ date }}</span>
            <span v-show="!isSignIn">今天暂未签到</span>
            <span v-show="isSignIn">已连续签到{{ continueSignIn }}天</span>
          </div>
          <div class="sign">
            <div v-show="!isSignIn">
              <div @click="onSignIn(1)"><McBtn text="签 到" /></div>
            </div>
            <div v-show="isSignIn">
              <div @click="onSignIn(0)"><McBtn text="已 签 到" /></div>
            </div>
          </div>
        </div>
        <div class="right">
          <el-table :data="signInList" empty-text="未找到签到记录">
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="message" label="消息" />
            <el-table-column prop="emotion" label="心情" width="60" align="center" />
          </el-table>
          <Empty height="20" />
          <div class="operate">
            <div>
              <el-pagination
              :total="signInCount"
              :page-size="6"
              background="true"
              layout="prev, pager, next"
              @current-change="changePage"
            />
            </div>
          </div>
        </div>
      </div>
    </Book>
  </div>
</template>
<script setup>
import Book from '../../components/Book.vue'
import McBtn from '@/components/McBtn.vue'
import Empty from '@/components/FitEmpty.vue'
import { onMounted, ref } from 'vue'
import useUserStore from '@/stores/user'
import { countSignIn, findAllSignIn, getUserInfo, signIn } from '@/api/user'
import { ElMessage, ElNotification } from 'element-plus'
const isSignIn = ref(false)
const continueSignIn = ref(0)
const userStore = useUserStore()
const listLoading = ref(true)
const signInList = ref([])
const signPage = ref(false)
const message = ref('')
const emotion = ref('')
const fillZero = (num) => {
  return num < 10 ? '0' + num : num
}
let dateUtil = new Date()
const date = ref(
  dateUtil.getFullYear() + '-' + fillZero(dateUtil.getMonth() + 1) + '-' + fillZero(dateUtil.getDate())
)
const pageNum = ref(1)
const signInCount = ref(0)
const getSignList = async() =>{
  await findAllSignIn(pageNum.value).then(res=>{
    let msg = res.data.msg
    if(msg == 'SUCCESS'){
      let data = res.data.object
      let num = res.data.num
      if( data.length != 0 && date.value === data[0].date){
        isSignIn.value = true
      }
      signInList.value = data
      continueSignIn.value = num
      listLoading.value = false
    }
  }).catch(err=>{
    ElMessage.error('服务异常')
  })
  await countSignIn().then(res=>{
    let msg = res.data.msg
    
    if(msg == 'SUCCESS'){
      signInCount.value = res.data.num
    }
  }).catch(err=>{
    ElMessage.error('服务异常')
  })
}
const changePage = (e) => {
  pageNum.value = e
  getSignList()
}
const onSignIn = (e)=>{
  if(e == 1){
    signPage.value = true
  }
  else{
    ElMessage.error('今天已经签到过了')
  }
}
const confirmSignIn = async()=>{
  if(message.value.length == 0){
    ElMessage.error('请输入今天发生的事')
  }
  else if(emotion.value.length == 0){
    ElMessage.error('请选择心情')
  }
  else{
    await signIn(message.value,emotion.value).then(async(res)=>{
      let msg = res.data.msg
      if(msg == 'SUCCESS'){
        let num = res.data.num
        ElNotification({
          title: '签到成功',
          message: "经验添加"+num+"点",
          type: 'success'
        })
        isSignIn.value = true
        getSignList()
        signPage.value = false
        await getUserInfo().then(res=>{
          let msg = res.data.msg
          if(msg == 'SUCCESS'){
            let data = res.data.object
            userStore.setUserObject(
              data.user,
              data.name,
              data.level,
              data.exp,
              data.maxExp,
              data.gender,
              data.birthday,
              data.avatar,
              data.email
            )
          }
        }).catch(err=>{
          ElMessage.error('服务异常')
        })
      }
      else{
        ElNotification.error({
          title: '签到失败',
          message: "你已经签到过了今天",
          type: 'error'
        })
      }
    }).catch(err=>{
      ElMessage.error('签到失败')
    
    })
  }
  
}
onMounted(getSignList)

</script>
<style scoped>
.content {
  display: flex;
}
.left {
  width: 200px;
  min-height: 300px;
  background-color: #f7e9d4;
  border: 1px solid #a58960;
  margin-right: 20px;
}
.avatarOut {
  margin: 30px 20px;
  width: 160px;
  height: 160px;
  background-color: #f1f1f1;
}
.avatarOut img{
  width: 150px;
  height: 150px;
  margin: 5px;
}
.info {
  border-top: 1px solid #a58960;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
}
.date {
  font-size: 15px;
}
.sign {
  border-top: 1px solid #a58960;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.right {
  width: calc(100% - 240px);
  min-height: 300px;
  background-color: #f3debf;
  border: 1px solid #a58960;
}
.operate {
  display: flex;
  justify-content: end;
  padding: 0 10px;
}
.operate div{
  margin-top: -5px;
}

</style>
