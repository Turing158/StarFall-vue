<template>
  <Ul class="ul" style="position: fixed"></Ul>
  <div class="contentOut">
    <Book ref="bookOut">
      <div class="topicContent">
        <table class="title">
          <th class="titleLeft">
            <div>
              <span>作品发布</span>
            </div>
          </th>
          <th class="titleRight">
            <h1>
              [<el-select placeholder="类别" style="width: 80px" size="small" v-model="label">
                <el-option
                  v-for="(item, index) in labels"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option> </el-select
              >]
              <TextInput v-model="title" placeholder="请输入主题标题" :fontSize="20" :width="200" :key="new Date().getTime()"/>
            </h1>
          </th>
        </table>
        <table class="line">
          <th class="lineLeft"></th>
          <th class="lineRight"></th>
        </table>
        <table class="mainTable">
          <td class="author">
            <div class="authorContent">
              <div class="authorName">
                <span
                  ><a :href="'/personal/other/' + userStore.user" class="user"
                    ><img src="../../assets/img/name_tag.png" alt="" />{{ userStore.name }}</a
                  ></span
                >
              </div>
              <div class="authorHead">
                <a :href="'/personal/other/' + userStore.user"
                  ><img :src="'/src/assets/avatar/' + userStore.avatar" alt=""
                /></a>
              </div>
              <div class="authorInf">
                <ExpBar :lv="userStore.level" :exp="userStore.exp" :maxExp="userStore.maxExp" />
              </div>
            </div>
          </td>
          <td class="content">
            <table class="contentTable">
              <tr>
                <td class="contentTop">
                  <div>
                    <div>
                      <img
                        style="width: 15px; margin-top: -5px"
                        src="@/assets/img/Cicon.gif"
                        alt=""
                      />
                      <span>发表于<span>0000-00-00</span></span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: initial; border: 0">
                  <table class="contentInf">
                    <caption>
                      <span>{{ label }}</span
                      >作品发布
                    </caption>
                    <tr>
                      <th>作品名称：</th>
                      <td>
                        <TextInput v-model="subtitle" placeholder="请输入作品名称" :key="new Date().getTime()"/>
                      </td>
                    </tr>
                    <tr>
                      <th>Title：</th>
                      <td>
                        <TextInput
                          v-model="subtitleEn"
                          placeholder="请输入作品英文名称"
                          :width="120"
                          :key="new Date().getTime()"
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>来源 source：</th>
                      <td>
                        <el-select style="width: 80px" size="small" v-model="source" :key="new Date().getTime()">
                          <el-option label="原创" value="原创"></el-option>
                          <el-option label="转载" value="转载"></el-option>
                        </el-select>
                      </td>
                    </tr>
                    <tr>
                      <th>适用版本 version：</th>
                      <td>
                        <TextInput v-model="version" placeholder="请输入适用版本" :key="new Date().getTime()"/>
                      </td>
                    </tr>
                    <tr>
                      <th>作者 author：</th>
                      <td>
                        <TextInput v-model="author" placeholder="请输入作者名称" :key="new Date().getTime()"/>
                      </td>
                    </tr>
                    <tr>
                      <th>语言 language：</th>
                      <td>
                        <TextInput v-model="language" placeholder="请输入支持语言" :key="new Date().getTime()"/>
                      </td>
                    </tr>
                    <tr>
                      <th>原帖 address：</th>
                      <td>
                        <TextInput v-model="address" placeholder="请输入原帖地址" :key="new Date().getTime()"/>
                      </td>
                    </tr>
                    <tr>
                      <th>下载 download：</th>
                      <td>
                        <TextInput v-model="download" placeholder="请输入下载地址" :key="new Date().getTime()"/>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="border: 0; background-color: initial">
                  <Empty :height="50" />
                  <div class="contentInput">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 10 }"
                      resize="none"
                      :rows="10"
                      v-model="content"
                      @input="onChange()"
                    />
                  </div>
                  <!-- <div class="contentMd" id="contentMd" v-highlight v-html="content"></div> -->
                  <Empty :height="10" />
                  <div class="operate">
                    <el-input
                      v-model="code"
                      placeholder="验证码"
                      style="width: 80px"
                      maxlength="4"
                    />
                    <Code ref="codeImg" width="75px" height="30px" margin="0 5px" />
                    <div @click="onConfirm()">
                      <McBtn text="发布" />
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </table>
      </div>
    </Book>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import ExpBar from '@/components/ExpBar.vue'
import Ul from '@/components/UlBar.vue'
import Book from '@/components/Book.vue'
import TextInput from '@/components/TextInput.vue'
import McBtn from '@/components/McBtn.vue'
import Code from '@/components/Code.vue'
import Empty from '@/components/FitEmpty.vue'
import { ElMessage, ElNotification } from 'element-plus'
import { marked } from 'marked'
import useUserStore from '@/stores/user'
import { editTopic, hasPromiseToEdit, isPromiseToEdit } from '@/api/topic'
import { appendTopic } from '@/api/topic'
import { useRoute, useRouter } from 'vue-router'
import { getUserInfo } from '@/api/user'
const labels = ['服务端', '客户端', '模组', '插件', '材质包', '视频']
const label = ref()
const route = useRoute()
const router = useRouter()
const toMd = () => {
  
  //   if (data.value.content == null) return
  //   content.value = marked(data.value.content)
}
toMd()
const bookOut = ref()
const codeImg = ref()
const code = ref('')
const title = ref('')
const subtitle = ref('')
const subtitleEn = ref('')
const source = ref('')
const version = ref('')
const author = ref('')
const language = ref('')
const address = ref('')
const download = ref('')
const content = ref('')
const userStore = useUserStore()
const onChange = () => {}
const init = async () => {
  if (route.params.id) {
    await isPromiseToEdit(route.params.id)
      .then(async(res) => {
        let msg = res.data.msg
        if (msg == 'SUCCESS') {
          await hasPromiseToEdit(route.params.id).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
              let data = res.data.object
              title.value = data.title
              label.value = data.label
              subtitle.value = data.topicTitle
              subtitleEn.value = data.enTitle
              source.value = data.source
              version.value = data.version
              author.value = data.author
              language.value = data.language
              address.value = data.address
              download.value = data.download
              content.value = data.content
            }
            else{
              errorPromise()
            }
            
          }).catch(err=>{
            ElMessage.error("服务异常")
          })
        } else {
          errorPromise()
        }
      })
      .catch((err) => {
        ElMessage.error('服务异常')
      })
  }
  bookOut.value.setHeight()
}
const errorPromise = ()=>{
  ElNotification({
    title: '访问拒绝',
    message: '不允许编辑该主题帖',
    type: 'error'
  })
  router.push('/topic')
}
const append = async (data) => {
  await appendTopic(data)
    .then(async(res) => {
      let msg = res.data.msg
      if (msg == 'LEVEL_ERROR') {
        ElNotification({
          title: '等级不足',
          message: '虽然不知道你为什么可以这样操作，但是你的等级不足',
          type: 'error'
        })
      } else if (msg == 'CODE_ERROR') {
        ElMessage.error('验证码错误')
        code.value = ''
      } else {
        let data = res.data.object
        let num = res.data.num
        router.push('/topic/detail/' + data)
        ElNotification({
          title: '发布成功',
          message: '成功发布'+title.value,
          type: 'success'
        })
        ElNotification({
          title: '获得经验',
          message: "经验添加"+num+"点",
          type: 'success'
        })
        await getUserInfo().then(res=>{
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
        })
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
}
const edit = async (data) => {
  await editTopic(data).then(res=>{
    let msg = res.data.msg
    if(msg == 'SUCCESS'){
      ElNotification({
        title: '编辑成功',
        message: '成功编辑'+title.value,
        type: 'success'
      })
      router.push('/topic/detail/' + route.params.id)
    }
    else if(msg == 'CODE_ERROR'){
      ElMessage.error('验证码错误')
      code.value = ''
    }
    else if(msg == 'REJECT'){
      errorPromise()
    }
    else{
      ElMessage.error('服务异常')
    }
    console.log(msg);
  }).catch(err=>{
    ElMessage.error('服务异常')
  })

}

const onConfirm = async () => {
  if (title.value.length < 6) {
    ElNotification({
      title: '标题过短',
      message: '标题长度不得少于6个字符',
      type: 'warning',
      duration: 2000
    })
  } else if (subtitle.value.length < 4) {
    ElNotification({
      title: '作品名过短',
      message: '作品名长度不得少于4个字符',
      type: 'warning',
      duration: 2000
    })
  } else if (subtitleEn.value.length < 4) {
    ElNotification({
      title: '英文名过短',
      message: '英文名长度不得少于4个字符',
      type: 'warning',
      duration: 2000
    })
  } else if (source.value.length == 0) {
    ElNotification({
      title: '来源为空',
      message: '来源必须选择 原创 或 转载',
      type: 'warning',
      duration: 2000
    })
  } else if (version.value.length == 0) {
    ElNotification({
      title: '版本为空',
      message: '版本不能为空，请输入适用版本',
      type: 'warning',
      duration: 2000
    })
  } else if (author.value.length == 0) {
    ElNotification({
      title: '作者为空',
      message: '原创输入自己的用户名称，转载输入原作者名称',
      type: 'warning',
      duration: 2000
    })
  } else if (language.value.length == 0) {
    ElNotification({
      title: '语言为空',
      message: '请选择该资源所适配的语言',
      type: 'warning',
      duration: 2000
    })
  } else if (content.value.length < 10) {
    ElNotification({
      title: '内容过短',
      message: '内容长度不得少于10个字符',
      type: 'warning',
      duration: 2000
    })
  } else if (code.value.length == 0) {
    ElNotification({
      title: '验证码为空',
      message: '请输入验证码输入框左边图片的字母或数字',
      type: 'warning',
      duration: 2000
    })
  } else {
    let data = {
      id: route.params.id,
      title: title.value,
      label: label.value,
      topicTitle: subtitle.value,
      enTitle: subtitleEn.value,
      source: source.value,
      version: version.value,
      author: author.value,
      language: language.value,
      address: address.value,
      download: download.value,
      content: content.value,
      code: code.value
    }
    if (route.params.id) {
      edit(data)
    } else {
      append(data)
    }
    codeImg.value.changeCode()
  }
}
onMounted(init)
</script>
<style scoped>
.ul {
  top: 0;
}
.contentOut {
  min-height: calc(100vh - 230px);
  margin: 50px;
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.operate {
  display: flex;
  justify-content: right;
}
.bookCenter {
  position: relative;
  height: fit-content;
}
.title,
.line {
  width: 100%;
  border: 0;
}
.title {
  background-color: rgb(251, 242, 219);
  height: 40px;
  border-collapse: collapse;
  border: 0;
}
.titleLeft {
  background-color: rgb(227, 201, 158);
  display: flex;
  height: 40px;
  width: 180px;
  border: 0;
  border-right: 1px solid rgb(207, 183, 142);
  color: #131313;
}
.titleLeft div {
  font-size: 18px;
  color: #131313;
  margin: auto;
}
.titleLeft div span {
  font-weight: bold;
}
.titleRight {
  width: 781px;
  text-align: left;
  border: 0;
  background-color: initial;
}
.titleRight h1 {
  position: relative;
  font-size: 18px;
  top: 6px;
  left: 20px;
  display: flex;
}
.titleRight h1 .copyHref {
  font-size: 10px;
  color: gray;
}
.titleRight span {
  cursor: pointer;
  border-bottom: 1px solid #131313;
  transition: all 0.2s;
}
.titleRight a {
  cursor: pointer;
  text-decoration: none;
}
.titleRight a:hover {
  text-decoration: underline;
}
.line {
  background-color: #e3c99e;
  height: 5px;
  top: 40px;
  border-collapse: collapse;
  border: 0;
}
.lineLeft {
  width: 180px;
  background-color: #c5a97c;
  border: 0;
  border-right: 1px solid #cfb78e;
}
.lineRight {
  border: 0;
}
.mainTable {
  border-collapse: collapse;
  border: 0;
}
.author {
  background-color: #e3c99e;
  width: 180px;
  border: 0;
  border-right: 1px solid #cfb78e;
}
.content {
  background-color: #fbf2db;
  border: 0;
}
.authorContent {
  position: relative;
  width: 180px;
  top: -2px;
}
.authorName {
  width: 180px;
  height: 40px;
  display: flex;
  border-bottom: 1px dashed #c2a678;
  font-size: 14px;
}
.authorName span {
  position: relative;
  margin: auto;
}
.authorName a {
  color: #131313;
  text-decoration: none;
  cursor: pointer;
}
.authorName a:hover {
  text-decoration: underline;
}
.authorHead {
  display: flex;
  width: 180px;
  height: 180px;
}
.authorHead a {
  margin: auto;
  border: 5px solid #f1f1f1;
  width: 130px;
  height: 130px;
  background-color: #f1f1f1;
}
.authorHead img {
  width: 130px;
  height: 130px;
}
.authorInf {
  width: 160px;
  padding: 0 10px;
}
.contentTable {
  position: relative;
  left: 12px;
  display: block;
  margin-bottom: 20px;
  background-color: initial;
  border: 0;
}
.contentTable img {
  object-fit: cover;
  width: 100%;
}
.contentTop {
  position: relative;
  width: 100%;
  height: 35px;
  font-size: 10px;
  border: 0;
  border-bottom: 1px dashed #c2a678;
  background-color: initial;
  display: flex;
}

.contentTop div:nth-child(1) {
  flex: 1;
  text-align: left;
  display: flex;
  align-items: center;
}
.contentTop div:nth-child(2) {
  flex: 1;
  display: flex;
  justify-content: right;
}
.contentTop img {
  position: relative;
  top: 3px;
}
.contentInput {
  position: relative;
}
.contentInf {
  position: relative;
  top: 10px;
  border-collapse: collapse;
  background-color: initial;
  width: 760px;
  font-weight: 400;
  text-align: left;
  font-size: 12px;
  border: 0;
}
.contentInf caption {
  background: #e3c99e;
  border-top: 1px solid #99876c;
  font-size: 14px;
  font-weight: 700;
  padding: 5px;
  border-bottom: 1px solid #99876c;
  text-align: left;
}
.contentInf th {
  padding: 5px;
  border: 0;
  border-bottom: 1px solid #99876c;
  width: 150px;
  font-weight: 400;
  background-color: initial;
}
.contentInf td {
  border: 0;
  border-bottom: 1px solid #99876c;
  background-color: initial;
}
.contentInf td a {
  color: #131313;
  text-decoration: none;
}
.contentInf td a:hover {
  text-decoration: underline;
}
.contentMd {
  position: relative;
  width: 740px;
  left: 20px;
  top: 20px;
  line-height: 2;
  word-wrap: break-word;
  font-size: 1rem;
  font-weight: 400;
  padding-bottom: 50px;
  overflow: hidden;
}
.contentMd h2 {
  color: #c2a678;
}
.likeDiv {
  right: 0;
  height: 35px;
  width: fit-content;
  display: flex;
  justify-content: right;
}
.likeDiv a {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100%;
}
.like,
.dislike,
.alreadyLike,
.alreadyDislike {
  cursor: pointer;
}
.like {
  width: 30px;
  height: 30px;
  background-image: url(@/assets/img/icon/like0.png);
}
.like:hover {
  background-image: url(@/assets/img/icon/like1.png);
}
.like:active {
  background-image: url(@/assets/img/icon/like2.png);
}
.noLike {
  position: relative;
  top: -2px;
}
.dislike {
  top: 5px;
  margin-left: 20px;
  width: 30px;
  height: 30px;
  background-image: url(@/assets/img/icon/dislike0.png);
}
.dislike:hover {
  background-image: url(@/assets/img/icon/dislike1.png);
}
.dislike:active {
  background-image: url(@/assets/img/icon/dislike2.png);
}
.alreadyLike span {
  color: #531d14;
  font-weight: bold;
}
.alreadyLike .like {
  background-image: url(@/assets/img/icon/like1.png);
}
.alreadyDislike .dislike {
  background-image: url(@/assets/img/icon/dislike1.png);
}
</style>
