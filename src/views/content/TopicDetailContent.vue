<!-- 主题详情页面 -->
<template>
  <div class="topicContent">
    <table class="title">
      <th class="titleLeft">
        <div>
          查看：<span class="num1">{{ data.view }}</span> &ensp; 评论：<span class="num2">{{
            data.comment
          }}</span>
        </div>
      </th>
      <th class="titleRight">
        <h1>
          <span v-if="data.display == 0" style="fontSize:14px;color: #666;">[草稿]</span>
          <span v-if="data.display == -1" style="fontSize:14px;color: darkred;">[待整改]</span>
          [<a :href="data.belong === 'talk' ? '/talk' : '/resource'">{{ data.label }}</a
          >]
          <span class="titleText">{{ data.title }}</span>
          <a class="copyHref">[复制链接]</a>
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
              ><a :href="'/personal/other/' + data.user" class="user"
                ><img src="../../assets/img/name_tag.png" alt="" />{{ data.name }}</a
              ></span
            >
          </div>
          <div class="authorHead">
            <a :href="'/personal/other/' + data.user"
              ><img :src="getAvatarSrc(data.avatar)" alt=""
            /></a>
          </div>
          <div class="authorInf">
            <ExpBar :lv="data.level" :exp="data.exp" :maxExp="data.maxExp" />
          </div>
        </div>
      </td>
      <td class="content">
        <table class="contentTable">
          <tr>
            <td class="contentTop">
              <div>
                <div>
                  <img style="width: 15px; margin-top: -5px" src="@/assets/img/Cicon.gif" alt="" />
                  <span
                    >发表于<span>{{ data.date }}</span></span
                  >
                </div>
              </div>
              <div>
                <div class="noLike likeDiv" v-show="isLike == 0">
                  <a class="like" @click="onLike(1)"></a>
                  <a class="dislike" @click="onLike(2)"></a>
                </div>
                <div class="alreadyLike likeDiv" v-show="isLike == 1">
                  <a class="like" @click="onLike(1)"></a>
                  <span>{{likeNum}}</span>
                  <a class="dislike" @click="onLike(2)"></a>
                </div>
                <div class="alreadyDislike likeDiv" v-show="isLike == 2">
                  <a class="like" @click="onLike(1)"></a>
                  <a class="dislike" @click="onLike(2)"></a>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: initial; border: 0">
              <table class="contentInfo">
                <caption>
                  <span>{{ data.label }}</span
                  >作品发布
                </caption>
                <tr v-if="data.topicTitle">
                   <th>作品名称：</th>
                   <td>{{ data.topicTitle }}</td>
                 </tr>
                <tr v-if="data.enTitle">
                   <th>Title：</th>
                   <td>{{ data.enTitle }}</td>
                 </tr>
                <tr v-if="data.source">
                   <th>来源 source：</th>
                   <td>{{ data.source }}</td>
                 </tr>
                <tr v-if="data.version">
                   <th>适用版本 version：</th>
                   <td>{{ data.version }}</td>
                 </tr>
                <tr v-if="data.author">
                   <th>作者 author：</th>
                   <td>{{ data.author }}</td>
                 </tr>
                <tr v-if="data.language">
                   <th>语言 language：</th>
                   <td>{{ data.language }}</td>
                 </tr>
                <tr v-if="data.address">
                   <th>原帖 address：</th>
                   <td>
                     <a :href="data.address" target="_blank">{{ data.address }}</a>
                   </td>
                 </tr>
                <tr v-if="data.download">
                   <th>下载 download：</th>
                   <td>
                     <a :href="data.download" target="_blank">{{ data.download }}</a>
                   </td>
                 </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="border: 0; background-color: initial">
              <div class="contentMd" id="contentMd" v-html="content"></div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="gallery" v-if="galleryImages.length != 0">
                <div class="gallery-header">
                  <span class="gallery-title">画廊</span>
                </div>
                <div class="gallery-container">
                  <div v-for="(img, index) in galleryImages" :key="index" class="gallery-item">
                    <img 
                      :src="getTopicGalleryUrl(img.path)" 
                      :title="img.label" 
                      class="gallery-image"
                      @click="openBigImg(getTopicGalleryUrl(img.path))"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="attachment-list" v-if="attachments.length != 0">
                <div class="attachment-header">
                  <span class="attachment-title">附件</span>
                </div>
                <div class="attachment-container">
                  <a v-for="(attachment, index) in attachments.slice(0, 3)" :key="index" :alt="attachment.fileLabel" :aria-label="attachment.fileLabel" class="attachment-item" @click="handleDownload()">
                    <div class="attachment-icon">
                      <img :src="getAttachmentIcon(attachment.fileName)" :alt="attachment.fileLabel" :aria-label="attachment.fileLabel" class="attachment-img"/>
                    </div>
                    <div class="attachment-info">
                      <div class="attachment-name">{{ attachment.fileName }}</div>
                      <div class="attachment-size">{{ formatFileSize(attachment.fileSize) }}</div>
                    </div>
                  </a>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="border: 0; background-color: initial">
              <div class="operate">
                <div style="margin-right: 10px;">
                  <McBtn text="编辑" @click="toEdit" v-if="data.user == userStore.user"/>
                </div>
                <McBtn text="收藏" :padding="10" v-if="!isCollect" @click="collect"/>
                <McBtn :text="'已收藏 '+collectNum" :padding="10" v-if="isCollect" @click="collect"/>
              </div>
              <div class="operate" v-if="(data.belong == 'talk' && userStore.role == 'talk_moderator') || (data.belong == 'resource' && userStore.role == 'resource_moderator') || userStore.role == 'admin'">
                <span>版主的权利：</span>
                <McBtn :width="80" v-if="data.display == 1 || data.display == 0" text="提出整改" @click="onReport"/>
                <McBtn :width="80" v-if="data.display == -1" text="撤销整改" @click="onUnReport"/>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div style="border-top: 1px solid #cfb78e; width: 780px; margin-left: -15px;">
                <PersonSignature :data="props.data.signature" />
              </div>
            </td>
          </tr>
        </table>
      </td>
    </table>
    <go-back/>
  </div>
  
  <!-- 图片放大查看模态框 -->
  <ElDialog
    v-model="dialogVisible"
    width="90%"
    :close-on-click-modal="true"
    :show-close="true"
  >
    <div style="display: flex; justify-content: center; align-items: center; padding: 20px; min-height: 60vh;">
      <img :src="dialogImageUrl" style="max-width: 100%; object-fit: contain; image-rendering: auto;" />
    </div>
  </ElDialog>
</template>
<script setup>
import { onMounted, ref, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import McBtn from '@/components/McBtn.vue'
import ExpBar from '@/components/ExpBar.vue'
import { downloadFile } from '@/api/topic'
import { ElDialog } from 'element-plus'
import GoBack from '@/components/GoBack.vue'
import PersonSignature from '@/components/PersonSignature.vue'
import { getAvatarSrc } from '@/api/user'
const props = defineProps({
  id: String,
  data: {
    type: Object,
    require: false,
    default: {
      title: 'title',
      label: 'label',
      date: '0000-00-00',
      view: 1,
      comment: 2,
      topicTitle: 'topicTitle',
      enTitle: 'EnglishTitle',
      source: 'no',
      version: '0.00.0',
      author: 'TuringICE',
      language: '中文',
      address: 'www.baidu.com',
      download: 'www.baidu.com',
      content: '',
      user: '123',
      name: 'TuringICE',
      img: '',
      level: 1,
      exp: 10,
      maxExp: 100,
      display:1,
      belong: 'resource'
    }
  }
})
const data = ref(props.data)
const router = useRouter()

const galleryImages = ref([])
import ClipboardJS from 'clipboard'
import { ElMessageBox , ElMessage, ElNotification } from 'element-plus'
const copyText = () => {
  const clipboard = new ClipboardJS('.copyHref', {
    text() {
      return window.location.href
    }
  })
  clipboard.on('success', () => {
    ElMessage.success('复制成功')
  })
  clipboard.on('error', () => {
    ElMessage.error('复制失败')
  })
}
import { marked } from 'marked'
import useUserStore from '@/stores/user'
import { LikeOrDislike, getLike,adjustTopicDisplay,findCollectStatus,setCollectionStatus, findTopicGallery,getTopicGalleryUrl, getTopicFile } from '@/api/topic'
const content = ref('')
const toMd = () => {
  if (data.value.content == null) return
  content.value = marked(data.value.content)
}
toMd()
onMounted(copyText)
const userStore = useUserStore()
const isLike = ref(0)
const likeNum = ref(0)
const initLike = async () => {
  if (userStore.isLogin) {
    await getLike(props.id)
      .then((res) => {
        let msg = res.data.msg
        if (msg == 'IS_LIKE') {
          isLike.value = 1
          likeNum.value = res.data.num
        } else if (msg == 'IS_DISLIKE') {
          isLike.value = 2
        } else {
          isLike.value = 0
        }
      })
      .catch((err) => {
        ElMessage.error('获取点赞信息失败')
      })
  } else {
    isLike.value = 0
  }
}
initLike()
let repeatedLike = false
const onLike = async (op) => {
  if(repeatedLike){
    return
  }
  repeatedLike = true
  if (userStore.isLogin) {
    await LikeOrDislike(props.id, op)
      .then((res) => {
        let msg = res.data.msg
        let num = res.data.num
        if (msg == 'ALREADY_LIKE') {
          isLike.value = 0
          ElNotification({
              title: '你撤回评价了',
              message: props.data.title,
              type: 'warning',
              duration: 2000
            })
        } else {
          if (op == 1) {
            isLike.value = 1
            likeNum.value = num
            ElNotification({
              title: '你点赞了',
              message: props.data.title,
              type: 'success',
              duration: 2000
            })
          } else {
            isLike.value = 2
            ElNotification({
              title: '你踩了踩',
              message: props.data.title,
              type: 'warning',
              duration: 2000
            })
          }
        }
      })
      .catch((err) => {
        ElMessage.error('点赞失败，服务异常')
      })
  } else {
    ElNotification({
      title: '提示',
      message: '请先登录',
      type: 'error'
    })
  }
  repeatedLike = false
}

const isCollect = ref(false)
const collectNum = ref(0)
const initCollection = async()=>{
  if(!userStore.isLogin){
    isCollect.value = false
    return
  }
  await findCollectStatus(props.id)
  .then(res=>{
    let num = res.data.num
    let obj = res.data.object
    let msg = res.data.msg
    if (msg == "SUCCESS"){
      if(obj == true){
        isCollect.value = true
        collectNum.value = num
        return
      }
    }
  
    isCollect.value = false
  }).catch(e=>{
    isCollect.value = false
  })
}
initCollection()
let repeatedCollect = false;
const collect = async()=>{
  if(!userStore.isLogin){
    ElNotification({
      title: '提示',
      message: '请先登录',
      type: 'error'
    })
    return
  }
  if(repeatedCollect){
    return
  }
  repeatedCollect = true
  await setCollectionStatus(props.id)
  .then(res=>{
    if(res.data.msg == "SUCCESS"){
      let msg = res.data.object
      if(msg == "COLLECT"){
        isCollect.value = true
        collectNum.value = res.data.num
        return
      }
    }
    isCollect.value = false
  })
  .catch(e=>{
    isCollect.value = false
  })
  if(isCollect.value){
    ElNotification({
      title: '收藏',
      message: '成功收藏-> '+ props.data.title,
      type: 'success'
    })
  }
  else{
    ElNotification({
      title: '取消收藏',
      message: '取消收藏-> '+ props.data.title,
      type: 'warning'
    })
  }
  repeatedCollect = false
}
let repeatedReport = false
const onReport = ()=>{
  ElMessageBox.prompt('请输入整改内容及原因', '整改', {
    confirmButtonText: '提示整改',
    cancelButtonText: '取消',
  })
    .then(async ({ value }) => {
      if(value == '' || value == null){
        ElMessage.error('请输入整改内容及原因')
        return
      }
      if(value.length >= 80){
        ElMessage.error('整改内容及原因不能大于80个字符')
        return
      }
      if(repeatedReport){
        return
      }
      repeatedReport = true
      await adjustTopicDisplay(props.id,value,-1)
      .then(res=>{
        if(res.data.msg == 'SUCCESS'){
          ElMessage.success('整改提交成功')
          data.value.display = -1
        }
        else{
          ElMessage.error('整改提交失败')
        }
      }).catch(r =>{
        ElMessage.error('整改提交失败')
      })
    })
    .catch(() => {
      
    })
    repeatedReport = false
}

const onUnReport = ()=>{
  ElMessageBox.prompt('请输入撤销整改内容', '整改', {
    confirmButtonText: '撤销整改',
    cancelButtonText: '取消',
  })
    .then(async ({ value }) => {
      if(value == '' || value == null){
        ElMessage.error('请输入撤销整改原因')
        return
      }
      if(value.length >= 80){
        ElMessage.error('撤销整改原因不能大于80个字符')
        return
      }
      if(repeatedReport){
        return
      }
      repeatedReport = true
      await adjustTopicDisplay(props.id,value,1)
      .then(res=>{
        if(res.data.msg == 'SUCCESS'){
          ElMessage.success('撤销整改提交成功')
          data.value.display = 1
        }
        else{
          ElMessage.error('撤销整改提交失败')
        }
      }).catch(r =>{
        ElMessage.error('撤销整改提交失败')
      })
    })
    .catch(() => {
      
    })
    repeatedReport = false
}

const toEdit = ()=>{
  if(data.value.belong){
    router.push('/topic/'+data.value.belong+"/"+props.id)
  }
}
const initGallery = async()=>{
  await findTopicGallery(props.id)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      galleryImages.value = res.data.object
    }
  })
  .catch(e=>{
    ElMessage.error('获取画廊图片失败')
  })
}
initGallery()

// 图片放大查看相关
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

const openBigImg = (src)=>{
  dialogImageUrl.value =src
  dialogVisible.value = true
}

const initImageClick = () => {
  setTimeout(() => {
    const contentMd = document.getElementById('contentMd')
    if (contentMd) {
      const images = contentMd.querySelectorAll('img')
      images.forEach(img => {
        if(!img.className.includes('marked-emoji-img')){
          img.style.cursor = 'pointer'
          img.addEventListener('click', () => {
            openBigImg(img.src)
          })
        }
      })
    }
  }, 100)
}

onMounted(initImageClick)
onUpdated(initImageClick)

// 附件相关数据和方法
const attachments = ref([])
const getAttachmentIcon = (fileName) => {
  const iconMap = {
    "pdf": '/src/assets/img/icon/file/pdf.png',
    "doc": '/src/assets/img/icon/file/doc.png',
    "docx": '/src/assets/img/icon/file/docx.png',
    "xls": '/src/assets/img/icon/file/xls.png',
    "xlsx": '/src/assets/img/icon/file/xlsx.png',
    "ppt": '/src/assets/img/icon/file/ppt.png',
    "pptx": '/src/assets/img/icon/file/pptx.png',
    "zip": '/src/assets/img/icon/file/zip.png',
    "rar": '/src/assets/img/icon/file/rar.png',
    "7z": '/src/assets/img/icon/file/7z.png',
    "png": '/src/assets/img/icon/file/png.png',
    "jpg": '/src/assets/img/icon/file/jpg.png',
    "jpeg": '/src/assets/img/icon/file/jpeg.png',
    "gif": '/src/assets/img/icon/file/gif.png',
    "txt": '/src/assets/img/icon/file/txt.png',
    "json": '/src/assets/img/icon/file/json.png',
    "jar": '/src/assets/img/icon/file/jar.png',
    default: '/src/assets/img/icon/file/file.png'
  }
  let fileNameSplit = fileName.split(".")
  return fileNameSplit.length > 1 ? iconMap[fileNameSplit[fileNameSplit.length - 1].toLowerCase()] || iconMap.default : iconMap.default
}
const initTopicFile = async ()=>{
  await getTopicFile(props.id)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      attachments.value = res.data.object
    }
  })
}
initTopicFile()
// 格式化文件大小（自动转换单位）
const formatFileSize = (bytes) => {
  if (!bytes) return '未知大小'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleDownload = (id) => {
  if(!userStore.isLogin){
    ElNotification({
      title: '提示',
      message: '请先登录',
      type: 'error'
    })
    return
  }
  
  downloadFile(id)
}

</script>
<style scoped>
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
}
.titleLeft div {
  font-size: 13px;
  color: gray;
  margin: auto;
}
.titleLeft div span {
  color: rgb(230, 136, 81);
  font-weight: 500;
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
}
.titleRight h1 .copyHref {
  font-size: 10px;
  color: gray;
}
.titleRight a {
  cursor: pointer;
  text-decoration: none;
}
.titleRight a:hover {
  text-decoration: underline;
}
.titleText{
  max-width: 600px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  position: relative;
  top: 5px;
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
  font-size: 10px;
  border: 0;
  border-bottom: 1px dashed #c2a678;
  background-color: initial;
  display: flex;
  left: -15px;
}

.contentTop div:nth-child(1) {
  flex: 1;
  text-align: left;
  display: flex;
  align-items: center;
  margin-left: 5px;
}
.contentTop div:nth-child(2) {
  flex: 1;
  display: flex;
  justify-content: right;
}
.contentTop img {
  position: relative;
  top: 3px;
  margin-right: 5px;
}
.contentInfo {
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
.contentInfo caption {
  background: #e3c99e;
  border-top: 1px solid #99876c;
  font-size: 14px;
  font-weight: 700;
  padding: 5px;
  border-bottom: 1px solid #99876c;
  text-align: left;
}
.contentInfo th {
  padding: 5px;
  border: 0;
  border-bottom: 1px solid #99876c;
  width: 150px;
  font-weight: 400;
  background-color: initial;
}
.contentInfo td {
  border: 0;
  border-bottom: 1px solid #99876c;
  background-color: initial;
}
.contentInfo td a {
  color: #131313;
  text-decoration: none;
}
.contentInfo td a:hover {
  text-decoration: underline;
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
.operate{
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: right;
}
.gallery {
  background-color: #e3c99e;
  border: 1px solid #cfb78e;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 0;
  margin-right: 10px;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.gallery-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.gallery-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  background-color: #fbf2db;
  overflow-x: auto;
  padding: 10px;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: thin;  /* Firefox */
}

.attachment-list {
  width: 100%;
  margin-top: 20px;
}

.attachment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
}


.attachment-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 10px;
  padding-top: 5px;
}

.attachment-item {
  min-width: 100px;
  max-width: 200px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration-line: none;
}

.attachment-item:hover {
  border-color: rgb(227, 201, 158);
  background-color: #fbf2db;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.attachment-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.attachment-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering:auto;
}

.attachment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

.attachment-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  word-break: break-all;
  max-height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.attachment-size {
  font-size: 12px;
  color: #666;
}

.attachment-empty {
  min-width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fbf2db;
  border: 1px dashed #ddd;
  border-radius: 6px;
  color: #999;
}

/* 隐藏滚动条但保留功能 */
.attachment-container::-webkit-scrollbar {
  height: 6px;
}

.attachment-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.attachment-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.attachment-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.attachment-item-wrapper {
  position: relative;
  display: inline-block;
}


.gallery-container::-webkit-scrollbar {
  height: 6px;
}

.gallery-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.gallery-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.gallery-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.gallery-item {
  position: relative;
  width: auto;
  height: auto;
  flex-shrink: 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: visible;
}

.gallery-image {
  min-width: 60px;
  min-height: 60px;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 200px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}
.contentMd{
  width: 740px;
}
.contentMd :deep(img){
  max-width: 740px !important;
  transition: transform 0.2s ease;
}

.contentMd :deep(img):hover{
  transform: scale(1.02);
}

</style>
