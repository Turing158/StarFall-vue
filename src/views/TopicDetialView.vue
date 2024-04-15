<template>
  <div class="topicDetail">
    <Ul class="ul" style="position: fixed"></Ul>
    <div class="contentOut">
      <Book ref="bookOut">
        <div v-if="!error">
          <TopicDetailContent :data="topicInfo" :id="route.params.id" />
          <table class="comment">
            <TopicCommentContent
              ref="commentContent"
              v-for="(item, index) in comments"
              :key="index"
              :index="index"
              :data="item"
              :page="page"
              :isMe="item.user == userStore.user"
              ><span @click="delComment(index, item.date)">删除</span></TopicCommentContent
            >
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
                style="margin-top: 20px"
                :current-page="page"
                @current-change="changePage"
              ></el-pagination>
            </div>
          </div>
          <EditComment v-if="userStore.isLogin" ref="editComment">
            <McBtn text="发 话" :margin="10" @click="onComment()" />
          </EditComment>
        </div>
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
import { findCommentByTopic, getTopicInfo, appendComment, deleteComment } from '@/api/topic'
import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const bookOut = ref()
const topicInfo = ref()
const error = ref(true)
const comments = ref([])
const commentsCount = ref(0)
const loading = ElLoading.service({
  lock: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)'
})

const init = async () => {
  await getTopicInfo(route.params.id)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'ID_ERROR') {
        ElMessage.error('此主题帖已被删除或不存在')
      } else {
        let data = res.data.object
        topicInfo.value = data
        error.value = false
        getComment()
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
  bookOut.value.setHeight()
  loading.close()
}
const page = ref(1)
const changePage = (e) => {
  page.value = e
  getComment()

}
const getComment = async () => {
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
  bookOut.value.setHeight()
}
onMounted(init)
const editComment = ref()
const commentContent = ref()
const onComment = async () => {
  if (editComment.value.code.length == 0) {
    ElMessage.error('请输入验证码')
  } else if (editComment.value.content.length < 10) {
    ElMessage.error('评论内容不能少于10个字符')
  } else {
    await appendComment(route.params.id, editComment.value.content, editComment.value.code)
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
          changePage(((res.data.num + 9) / 10).toString().split('.')[0]) 

        }
      })
      .catch((err) => {
        ElMessage.error('服务异常')
      })
    editComment.value.codeImg.changeCode()
  }
}

const delComment = (i, date) => {
  ElMessageBox.confirm('确定删除此评论吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
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
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
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
  height: 80px;
}
.operateLeft {
  width: 180px;
  background-color: #e3c99e;
  border-right: 1px solid #cfb78e;
}
.operateRight {
  width: calc(100% - 180px);
  display: flex;
  justify-content: right;
}
</style>
