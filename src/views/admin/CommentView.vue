<template>
  <div class="comment" :class="isDark ? 'dark' : ''">
    <h2>评论管理</h2>
    <div style="margin: 10px 0;">
      <el-button type="primary" @click="openDialog(0)" plain>添加</el-button></div>
    <el-collapse
      v-model="collapse"
      accordion
      @change="change"
      :style="{ '--el-text-color-primary': isDark ? '#dedede' : '#131313' }"
    >
      <el-collapse-item
        v-for="(item, index) in topics"
        :key="index"
        :title="item.title"
        :name="item.id"
      >
        <template #title>
          <span style="width: 100px">{{ item.id }}</span>
          <span style="width: 600px; text-align: left">{{ item.title }}</span>
          <span style="width: 100px">{{ item.label }}</span>
          <span style="width: 100px">{{ item.user }}</span>
        </template>
        <el-table :data="showComments" :class="isDark ? 'dark' : ''">
          <el-table-column label="发布用户" prop="user" width="80" />
          <el-table-column label="内容" prop="content" />
          <el-table-column label="时间" width="200" prop="date" />
          <el-table-column width="200" align="center">
            <template #default="{ row }">
              <el-button type="primary" @click="openDialog(row)" plain>编辑</el-button>
              <el-button type="danger" @click="onDel(row)" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @current-change="handleCommentCurrentChange"
            :current-page="pageComment"
            :page-size="10"
            layout="total, prev, pager, next"
            background
            :total="totalComment"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="page">
      <el-pagination
        @current-change="handleTopicCurrentChange"
        :current-page="pageTopic"
        :page-size="10"
        layout="total, prev, pager, next"
        background
        :total="totalTopic"
      />
    </div>
    <el-dialog
      v-model="dialog"
      align-center
      :title="dialogTitle"
      :width="600"
      :close-on-click-modal="false"
      :style="{
        '--el-dialog-bg-color': isDark ? '#2b2b2b' : '#fff',
        '--el-text-color-primary': isDark ? '#dedede' : '#131313'
      }"
    >
      <div class="dialog">
        <el-form inline :rules="rules" :model="editComment" ref="formInput">
          <el-form-item label="主题" prop="topicId">
            <el-select style="width: 500px" placeholder="请选择主题" v-model="editComment.topicId">
              <el-option
                v-for="item in topicSelect"
                :key="item.id"
                :label="item.id"
                :value="item.id"
              >
                <span style="float: left">{{ item.id }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                    margin-top: -8px;
                  "
                  >{{ item.title }}<br/><span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                    margin-top: -18px;
                  "
                  ><span style="margin-right: 50px;">{{ item.label }}</span>{{ item.user }}</span
                >
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户" prop="user">
            <el-select style="width: 200px" placeholder="请选择用户" v-model="editComment.user">
              <el-option
                v-for="item in userSelect"
                :key="item.user"
                :label="item.user"
                :value="item.user"
              >
                <span style="float: left">{{ item.user }}</span>
                <span
                  style="position: relative;right: -25px;float: right; color: var(--el-text-color-secondary); font-size: 12px"
                  >{{ item.name }}</span
                >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="editComment.date"
              type="date"
              placeholder="请选择发布日期"
              style="width: 200px"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <el-form label-position="top" :rules="rules" :model="editComment">
          <el-form-item label="内容" prop="content">
            <el-input
              type="textarea"
              v-model="editComment.content"
              :rows="6"
              style="width: 550px"
              placeholder="请输入评论内容"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="danger" @click="clear()" plain>取 消</el-button>
        <el-button type="primary" @click="confirm()" plain>确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { addTopicComment, deleteTopicComment, findAllTopic, findAllTopicComment, findAllTopicForSelect, updateTopicComment } from '@/api/admin/topic'
import { findAllUsersForSelect } from '@/api/admin/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { inject, onMounted, reactive, ref } from 'vue'
const isDark = inject('isDark')
const collapse = ref()
const topics = ref([])
const showComments = ref([
  {
    topicId: '1',
    user: 'admin',
    content: '这是一条评论',
    date: '2021-10-10'
  }
])
const search = ref('')
const pageTopic = ref(1)
const totalTopic = ref(0)
const handleTopicCurrentChange = (e) => {
  pageTopic.value = e
  getTopicList()
}
const pageComment = ref(1)
const totalComment = ref(0)
const currentId = ref(0)
const handleCommentCurrentChange = (e) => {
  pageComment.value = e
  getTopicComments(currentId.value, e)
}
const editComment = ref({
  topicId: '',
  user: '',
  content: '',
  date: ''
})
const oldComment = ref({
  topicId: '',
  user: '',
  content: '',
  date: ''
})
const getTopicComments = async (id, page) => {
  await findAllTopicComment(id, page)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        showComments.value = res.data.object
        totalComment.value = res.data.num
      } else {
        ElMessage.error('获取评论列表失败')
      }
    })
    .catch((err) => {
      ElMessage.error('服务错误')
    })
}
const change = (e) => {
  if (e != '') {
    pageComment.value = 1
    currentId.value = e
    getTopicComments(e, 1)
  }
}
const dialog = ref(false)
const dialogTitle = ref('添加评论')
const openDialog = (e) => {
  dialog.value = true
  if (e == 0) {
    dialogTitle.value = '添加评论'
  } else {
    dialogTitle.value = '编辑评论'
    editComment.value = e
    oldComment.value = {
        topicId: e.topicId,
        user: e.user,
        content: e.content,
        date: e.date
    }
  }
}
const formInput = ref()
const rules = reactive({
    topicId: [{ required: true, message: '请选择主题', trigger: 'blur' }],
    user: [{ required: true, message: '请选择用户', trigger: 'blur' }],
    date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
    content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
})
const confirm = () => {
    formInput.value.validate(async(valid) => {
        if (valid && editComment.value.content.length > 0) {
            if(dialogTitle.value == '添加评论'){
                let comment = {
                    topicId: editComment.value.topicId,
                    user: editComment.value.user,
                    content: editComment.value.content,
                    date: editComment.value.date
                }
                await addTopicComment(comment).then(res=>{
                    let msg = res.data.msg
                    if(msg == 'SUCCESS'){
                        ElMessage.success('添加成功')
                        collapse.value = editComment.value.topicId
                        getTopicComments(editComment.value.topicId, 1)
                        clear()
                    }
                    else if(msg == 'EXIST_ERROR'){
                        ElMessage.error('已存在该评论，请换个时间再试')
                    }
                    else{
                        ElMessage.error('添加失败')
                    }
                }).catch(err=>{
                    ElMessage.error('服务错误')
                })
            }
            else{
                let comment = {
                    topicId: editComment.value.topicId,
                    user: editComment.value.user,
                    content: editComment.value.content,
                    date: editComment.value.date,
                    oldTopicId: oldComment.value.topicId,
                    oldUser: oldComment.value.user,
                    oldDate: oldComment.value.date
                }
                if(editComment.value.topicId == oldComment.value.topicId && editComment.value.user == oldComment.value.user && editComment.value.date == oldComment.value.date && editComment.value.content == oldComment.value.content){
                    ElMessage.error('未修改任何内容')
                }
                else{
                    await updateTopicComment(comment).then(res=>{
                        let msg = res.data.msg
                        if(msg == 'SUCCESS'){
                            ElMessage.success('修改成功')
                            collapse.value = editComment.value.topicId
                            getTopicComments(editComment.value.topicId, pageComment.value)
                            clear()
                        }
                        else if(msg == 'NOT_EXIST_ERROR'){
                            ElMessage.error('不存在改评论，你在干嘛！')
                        }
                        else if(msg == 'EXIST_ERROR'){
                            ElMessage.error('已存在该评论，请换个时间再试')
                        }
                        else{
                            ElMessage.error('修改失败')
                        }
                    }).catch(err=>{
                        ElMessage.error('服务错误')
                    })
                }
            }
        }
    })
}
const clear = () => {
  dialog.value = false
  editComment.value = {
    topicId: '',
    user: '',
    content: '',
    date: ''
  }
}
const onDel = (i) => {
  ElMessageBox.confirm(i.topicId+' '+i.user+' '+i.date, '确定删除该评论吗?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async() => {
        let comment = {
            topicId: i.topicId,
            user: i.user,
            date: i.date
        }
        await deleteTopicComment(comment).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success('删除成功')
                collapse.value = i.topicId
                getTopicComments(i.topicId, pageComment.value)
            }
            else if(msg == 'NOT_EXIST_ERROR'){
                ElMessage.error('不存在改评论，你在干嘛！')
            }
            else{
                ElMessage.error('删除失败')
            }
        }).catch(err=>{
            ElMessage.error('服务错误')
        })
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
const getTopicList = async () => {
  await findAllTopic(pageTopic.value)
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        topics.value = res.data.object
        totalTopic.value = res.data.num
      } else {
        ElMessage.error('获取主题列表失败')
      }
    })
    .catch((err) => {
      ElMessage.error('服务错误')
    })
}
const userSelect = ref([])
const getUserSelect = async () => {
  await findAllUsersForSelect()
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        userSelect.value = res.data.object
      }
    })
    .catch((err) => {
      ElMessage.error('服务错误')
    })
}
const topicSelect = ref([])
const getTopicSelect = async () => {
  await findAllTopicForSelect()
    .then((res) => {
      let msg = res.data.msg
      if (msg == 'SUCCESS') {
        topicSelect.value = res.data.object
      }
    })
    .catch((err) => {
      ElMessage.error('服务错误')
    })
}
const init = () => {
  getTopicList()
  getUserSelect()
  getTopicSelect()
}
onMounted(init)
</script>
<style scoped>
.comment {
  width: calc(100% - 40px);
  margin: 20px;
}
.dialog {
  height: 300px;
  width: 580px;
  overflow: auto;
}
.page {
  margin-top: 20px;
  display: flex;
  justify-content: end;
  margin-right: 10px;
}
.dark {
  --el-table-tr-bg-color: #2b2b2b;
  --el-table-row-hover-bg-color: #444;
  color: #dedede;
  --el-table-header-text-color: #dedede;
  --el-table-header-bg-color: #222;
  --el-table-border-color: #444;
  --el-input-border-color: #444;
  --el-input-bg-color: #2b2b2b;
  --el-input-text-color: #dedede;
  --el-text-color-primary: #eee;
  --el-text-color-regular: #eee;
  --el-fill-color-blank: #2b2b2b;
  --el-border-color: #444;
  --el-pagination-button-bg-color: #2b2b2b;
  --el-fill-color: #222;
  --el-disabled-bg-color: #444;
  --el-color-primary-light-9: #444;
  --el-color-warning-light-9: #444;
  --el-color-success-light-9: #444;
  --el-color-danger-light-9: #444;
  --el-text-color-primary: #eee;
}
</style>
