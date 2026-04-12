<!-- 主题帖详细页面（有点重用了前面的布局代码） -->
<template>
  <div class="topicDetail">
    <Ul class="ul" style="position: fixed"></Ul>
    <div class="contentOut">
      <Book>
        <div v-if="!error">
          <!-- 主题帖详细信息（包括标题、内容、作者等） -->
          <TopicDetailContent :data="topicInfo" :id="route.params.id" />
          <!-- 置顶评论（重用了评论列表的代码） -->
          <div class="operate" v-show="topComments.length != 0">
            <div class="operateLeft">
            </div>
            <div class="operateRight">
              <span class="titleComment">置顶评论</span>
            </div>
          </div>
          <table class="comment" v-loading="topLoading">
            <TopicCommentContent
              v-for="(item, index) in topComments"
              :key="index"
              :index="index"
              :data="item"
              :page="1"
              :isMe="item.user == userStore.user"
              :isTopicUser="userStore.user == topicInfo.user"
              :isTopComment="true"
              >
              <template v-slot:del>
                <span @click="delComment(index, item.date)">删除</span>
              </template>
              <template v-slot:top>
                <span v-show="item.weight == 0" @click="setTopComment(item)">置顶</span>
                <span v-show="item.weight != 0" @click="setTopComment(item)">已置顶</span>
              </template>
            </TopicCommentContent>
          </table>
          <!-- 评论列表（这是真正的评论） -->
          <div class="operate" v-show="comments.length != 0">
            <div class="operateLeft">
              <span class="titleComment">评论</span>
            </div>
            <div class="operateRight">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="commentsCount"
                :page-size="10"
                :current-page="page"
                @current-change="changePage"
              ></el-pagination>
            </div>
          </div>
          <table class="comment" v-loading="commentLoading">
            <TopicCommentContent
              v-for="(item, index) in comments"
              :key="index"
              :index="index"
              :data="item"
              :page="page"
              :isMe="item.user == userStore.user"
              :isTopicUser="userStore.user == topicInfo.user"
              :isTopComment="false"
              >
              <template v-slot:del>
                <span @click="delComment(index, item.date)">删除</span>
              </template>
              <template v-slot:top>
                <span v-show="item.weight == 0" @click="setTopComment(item)">置顶</span>
                <span v-show="item.weight != 0" @click="setTopComment(item)">已置顶</span>
              </template>
            </TopicCommentContent>
            <tr v-show="comments.length == 0">
              <td class="inCommentLeft"></td>
              <td>
                <div class="error inComment">
                  <div>暂时没有评论，快来睿评一下</div>
                  <div v-if="!userStore.isLogin" @click="router.push('/login')">
                    未登录，点此登录
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div class="operate" v-show="comments.length != 0">
            <div class="operateLeft"></div>
            <div class="operateRight">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="commentsCount"
                :page-size="10"
                :current-page="page"
                @current-change="changePage"
              ></el-pagination>
            </div>
          </div>
          <!-- 评论输入框（只有登录用户才能评论） -->
          <EditComment v-if="userStore.isLogin" ref="editComment">
            <McBtn text="发 话" :margin="10" @click="onComment()" />
          </EditComment>
        </div>
        <!-- 错误提示（当主题帖不存在或已被删除时显示） -->
        <div class="error" v-if="error">
          <div>此主题不存在或已被删除-><span @click="router.back()">点此返回</span></div>
        </div>
      </Book>
    </div>
  </div>
</template>
<script setup>
import Ul from '../components/UlBar.vue'
import Book from '../components/Book.vue'
import TopicDetailContent from './content/TopicDetailContent.vue'
import TopicCommentContent from './content/TopicCommentContent.vue'
import EditComment from '../components/EditComment.vue'
import useUserStore from '@/stores/user'
import McBtn from '@/components/McBtn.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { findCommentByTopic, getTopicInfo, appendComment, deleteComment,getTopicContent, topTopicComment, getTopTopicComment } from '@/api/topic'
import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const topicInfo = ref() // 存储主题帖详细信息
const error = ref(true) // 主题帖不存在或已被删除时为true
const comments = ref([]) // 存储评论列表
const commentsCount = ref(0) // 评论总数
const topComments = ref([]) // 置顶评论列表
const loading = ElLoading.service({
  lock: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)'
})
const contentLoading = ref(true)
const topLoading = ref(true)
const commentLoading = ref(true)

const initContent = async (data)=>{
  
  let content = ''
  await getTopicContent(data.user,data.id)
    .then(res=>{
      content = res.data
    })
    .catch(e=>{
      console.log(e)
      ElMessage.info("获取主题内容失败")
    })
    contentLoading.value = false
    return content
}

const init = async () => {
  // 初始化时获取主题帖详细信息
  document.title = 'StarFall - 加载中...'
  await getTopicInfo(route.params.id)
    .then(async(res) => {
      let msg = res.data.msg
      if (msg == 'ID_ERROR') {
        ElMessage.error('此主题帖已被删除或不存在')
        document.title = 'StarFall - 主题不存在'
      } else {
        let data = res.data.object
        document.title = data.title+" - StarFall"
        data.content = await initContent(data)
        topicInfo.value = data
        error.value = false
        getComment()
        getTopComment()
        
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
  // 加载完成后页面滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loading.close()
}
const getTopComment = async ()=>{
  topLoading.value = true
  await getTopTopicComment(route.params.id)
    .then(res=>{
      console.log(res)
      topComments.value = res.data.object
    })
    .catch(e=>{
      console.log(e)
      ElMessage.info("获取置顶评论失败")
    })
    topLoading.value = false
}
const page = ref(1)
const changePage = (e) => {
  page.value = parseInt(e)
  getComment()
}
// 获取评论列表
const getComment = async () => {
  commentLoading.value = true
  await findCommentByTopic(route.params.id, page.value)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        comments.value = res.data.object
        commentsCount.value = res.data.num
      } else {
        ElMessage.error('获取评论失败')
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
    commentLoading.value = false
}
onMounted(init)
const editComment = ref() // 评论输入框内容
// 发布评论
const onComment = async () => {
  if (editComment.value.code.length == 0) {
    ElMessage.error('请输入验证码')
  } else if (editComment.value.contentEditor.content.length < 10) {
    ElMessage.error('评论内容不能少于10个字符')
  } else {
    let loading = ElLoading.service({
      lock: true,
      text: '评论中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await appendComment(route.params.id, editComment.value.contentEditor.content, editComment.value.codeImg.random+":"+editComment.value.code)
      .then((res) => {
        let msg = res.data.msg
        if (msg == 'CODE_ERROR') {
          ElMessage.error('验证码错误')
        } else {
          ElNotification({
            title: '评论成功!',
            message: editComment.value.content.substr(0, 10) + '...',
            type: 'success'
          })
          editComment.value.content = ''
          editComment.value.code = ''
          window.scrollTo({ bottom: 0, behavior: 'smooth' })
          changePage(((res.data.num + 9) / 10).toString().split('.')[0]) 

        }
      })
      .catch((err) => {
        ElMessage.error('服务异常')
      })
    loading.close()
    editComment.value.codeImg.changeCode()
  }
}

// 删除评论
const delComment = (i, date) => {
  ElMessageBox.confirm('确定删除此评论吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let loadingdel = ElLoading.service({
        lock: true,
        text: '删除中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await deleteComment(route.params.id, date)
        .then((res) => {
          let msg = res.data.msg
          if (msg == 'SUCCESS') {
            ElNotification({
              title: '删除成功!',
              message: '评论已删除',
              type: 'success'
            })
            router.go(0)
          }
        })
        .catch(() => {
          ElMessage.error('服务异常')
        })
        loadingdel.close()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 置顶评论
const setTopComment = async (item) => {
  if(item.weight == 0){
    let originWeight = item.weight
    ElMessageBox.prompt('确定置顶此评论吗？', '提示', {
      title: '置顶此评论',
      inputValue: '',
      inputPlaceholder: '请输入置顶权重',
      inputValidator: (value) => {
        if (value == '') {
          return '请输入置顶权重'
        }
        if (value <= 0) {
          return '置顶权重不能小于等于0'
        }
        if (value > 5) {
          return '置顶权重不能大于10'
        }
      },
      inputType: 'number',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async (value) => {
      item.weight = value.value
      let loading = ElLoading.service({
        lock: true,
        text: '置顶中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await topTopicComment(item).then(res=>{
        let msg = res.data.msg
        if (msg == 'SUCCESS') {
          ElNotification({
            title: '置顶成功!',
            message: '评论已置顶',
            type: 'success'
          })
          topComments.value.push(item)
        }
        else if(msg == 'TOP_FULL'){
          item.weight = originWeight
          ElMessage.error('置顶已达上限')

        }
        else{
          item.weight = originWeight
          ElMessage.error('置顶失败')
        }
      })
      loading.close()
    })
    .catch(() => {
      item.weight = originWeight
      ElMessage.info('置顶失败')
    })
    .finally(() => {
      loading.close()
    })
  }else{
    let originWeight = item.weight
    ElMessageBox.confirm('确定取消置顶此评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      let loading = ElLoading.service({
        lock: true,
        text: '取消置顶中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      item.weight = 0
      await topTopicComment(item).then(res=>{
        item.weight = 0
        let msg = res.data.msg
        if (msg == 'SUCCESS') {
          ElNotification({
            title: '取消置顶成功!',
            message: '评论已取消置顶',
            type: 'success'
          })
          console.log(topComments.value)
          topComments.value = topComments.value.filter(comment => comment != item)
          console.log(topComments.value)
        }
        else{
          item.weight = originWeight
          ElMessage.error('取消置顶失败')
        }
      })
      .catch(() => {
        item.weight = originWeight
        ElMessage.error('取消置顶失败')
      })
      .finally(() => {
        loading.close()
      })
    })
  }
}
</script>
<style scoped>
.ul {
  top: 0;
}
.contentOut {
  min-height: calc(100vh - 230px);
  margin: 50px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.error span {
  cursor: pointer;
}
.error span:hover {
  text-decoration: underline;
}
.comment {
  width: 100%;
  border-collapse: collapse;
}
.inCommentLeft {
  width: 180px;
  background-color: #e3c99e;
}
.inComment {
  width: 100%;
  height: 100px;
  font-size: 20px;
  border: 1px solid #cfb78e;
  display: flex;
  flex-direction: column;
}
.inComment div:nth-child(2) {
  font-size: 14px;
  cursor: pointer;
}
.inComment div:nth-child(2):hover {
  color: #03123b;
  text-decoration: underline;
}
.operate {
  width: 100%;
  display: flex;
  height: 40px;
  border-bottom: 1px solid #cfb78e;
  border-top: 1px solid #cfb78e;
}
.operateLeft {
  width: 180px;
  background-color: #e3c99e;
  border-right: 1px solid #cfb78e;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
.operateRight {
  width: calc(100% - 180px);
  display: flex;
  justify-content: right;
}
.titleComment{
  line-height: 40px;
}
</style>
