<!-- 编辑主题页面 -->

<template>
  <Ul class="ul" style="position: fixed"></Ul>
  <div class="contentOut">
    <Book>
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
              <TextInput class="titleInput" v-model="title" placeholder="请输入主题标题" :fontSize="20" :width="650" :key="new Date().getTime()"/>
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
                    ><img src="../assets/img/name_tag.png" alt="" />{{ userStore.name }}</a
                  ></span
                >
              </div>
              <div class="authorHead">
                <a :href="'/personal/other/' + userStore.user"
                  ><img :src="userStore.avatar" alt=""
                /></a>
              </div>
              <div class="authorInf">
                <ExpBar :lv="userStore.level" :exp="userStore.exp" :maxExp="userStore.maxExp" />
              </div>
              <div class="switch">
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
                      >{{ route.params.belong == "resource" ? "资源作品发布" : "文章发布" }}
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
                  <ContentEditor ref="ContentEditorRef" class="contentInput" :value="content" v-show="!isMd" :switchHandler="initImageClick"/>
                  <Empty :height="10" />
                  <div class="gallery">
                    <div class="gallery-header">
                      <span class="gallery-title">画廊</span>
                      <input style="display: none" ref="fileInput" type="file" accept="image/jpeg, image/png, image/jpg" @change="handleFileChange"/>
                      <McBtn class="gallery-add-btn" @click="selectImg">+</McBtn>
                    </div>
                    <div class="gallery-container">
                      <div v-for="(img, index) in galleryImages" :key="index" class="gallery-item">
                        <img 
                          :src="getTopicGalleryUrl(img.path)" 
                          :alt="img.label" 
                          class="gallery-image"
                          @click="openBigImg(getTopicGalleryUrl(img.path))"
                        />
                        <button class="gallery-remove-btn" @click="delGalleryImg(img.id)">×</button>
                        <button class="gallery-copy-btn gallery-code-btn" @click="copyImageCode(img)" title="复制内联代码">
                          <svg t="1762189106165" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5242" width="16" height="16"><path d="M591.024 128l3.584 0.64 30.848 7.936a16 16 0 0 1 11.584 19.584L448.624 884.16a16 16 0 0 1-19.584 11.648l-30.784-8a16 16 0 0 1-11.648-19.648L575.088 140.16a16 16 0 0 1 19.584-11.52zM302.512 202.688a15.936 15.936 0 0 1 19.328 2.688l22.784 22.784 2.688 3.52a15.936 15.936 0 0 1-2.688 19.328L84.208 511.36l260.8 260.48c6.4 6.4 6.4 16.32 0 22.72l-22.784 22.848-3.456 2.624a15.936 15.936 0 0 1-19.328-2.624l-294.4-294.4-2.688-3.52a15.936 15.936 0 0 1 2.688-19.328l22.784-22.784L299.12 205.44z m397.312 2.688c6.4-6.016 16.448-6.4 22.848 0l271.552 271.616 22.784 22.784c6.4 6.4 6.4 16.384 0 22.784l-294.4 294.4c-6.4 6.016-16.384 6.4-22.784 0l-22.784-22.784a16.32 16.32 0 0 1 0-22.784l260.416-260.032-260.416-260.352a16.32 16.32 0 0 1 0-22.848z" fill="#f1f1f1" p-id="5243"></path></svg>
                        </button>
                        <button class="gallery-copy-btn" @click="copyImageLink(getTopicGalleryUrl(img.path))" title="复制链接">
                          <svg t="1762189391268" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6238" width="12" height="12"><path d="M639.008828 394.595895a242.983301 242.983301 0 0 0-24.798858-21.443049 49.313325 49.313325 0 0 0-71.950814 67.173052 49.483959 49.483959 0 0 0 12.115039 10.465573c4.664005 3.867712 9.214254 7.621667 13.480113 11.944404l4.095224 3.981468c51.076546 51.076546 35.833212 139.066988-15.300213 190.143534l-218.070688 218.070688a131.274686 131.274686 0 0 1-185.365772 0l-4.095224-4.152103a131.047174 131.047174 0 0 1 0-185.252016l96.351524-96.294646A53.579183 53.579183 0 1 0 182.106941 502.948701L182.106941 502.778067l-1.023806 0.966928a53.863574 53.863574 0 0 0-10.238061 9.555523l-100.10548 93.678253a242.755789 242.755789 0 0 0 0 342.292488l4.095225 4.095224a242.869545 242.869545 0 0 0 342.235609 0l218.01381-218.127565c94.019522-94.133278 101.982458-242.585155 7.962936-336.661555l-3.981468-3.981468z m314.308456-319.825633l-4.095224-4.095224a242.698911 242.698911 0 0 0-342.23561 0L388.97264 288.802604c-94.133278 94.133278-99.309186 230.015092-5.175908 324.205247l3.981468 3.981468c4.265859 4.265859 8.702351 8.304205 13.2526 12.115038 3.242052 3.697077 7.109764 6.825374 11.375623 9.328011l0.113756 0.056878a46.583175 46.583175 0 0 0 65.12544-60.632069c-6.142836-13.821382-17.632215-22.239342-25.595151-30.202278l-4.038346-3.981468c-51.133424-51.076546-31.737987-125.302484 19.395437-176.435909l218.184444-218.070687a131.047174 131.047174 0 0 1 185.195138 0l4.095224 3.981467a131.16093 131.16093 0 0 1 0 185.422651L778.758353 434.638087a53.06728 53.06728 0 0 0 31.624231 95.782743 52.896646 52.896646 0 0 0 27.870276-7.849179l0.113756 0.28439 1.535709-1.365075a53.408549 53.408549 0 0 0 12.05816-11.14811l101.243043-93.393862a242.642033 242.642033 0 0 0 0.056878-342.23561z" fill="#f1f1f1" p-id="6239"></path></svg>
                        </button>
                      </div>
                      <div v-if="galleryImages.length === 0" class="gallery-empty">
                        <span>暂无图片，点击上方+按钮添加</span>
                      </div>
                    </div>
                    
                    <!-- 附件显示栏 -->
                    <div class="attachment-list" v-if="attachments.length != 0">
                      <div class="attachment-header">
                        <span class="attachment-title">附件</span>
                        <input type="file" ref="fileUploadInput" accept="*.*" style="display: none" @change="handleFileUploadChange"/>
                        <McBtn text="上传附件" @click="showUploadAttachment"/>
                      </div>
                      <div class="attachment-container">
                        <div v-for="(attachment, index) in attachments.slice(0, 3)" :key="index" class="attachment-item-wrapper">
                          <a :href="attachment.path" class="attachment-item" @click="downloadFile(attachment.id)">
                            <div class="attachment-icon">
                              <img :src="getAttachmentIcon(attachment.fileName)" :alt="attachment.fileLabel" class="attachment-img"/>
                            </div>
                            <div class="attachment-info">
                              <div class="attachment-name">{{ attachment.fileName }}</div>
                              <div class="attachment-size">{{ formatFileSize(attachment.fileSize) }}</div>
                            </div>
                          </a>
                          <div class="attachment-delete-btn" @click="deleteAttachment(attachment.id)">
                            ×
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="attachment-list" v-else>
                      <div class="attachment-header">
                        <span class="attachment-title">附件</span>
                        <input type="file" ref="fileUploadInput" accept="*.*" style="display: none" @change="handleFileUploadChange"/>
                        <McBtn text="上传附件" @click="showUploadAttachment"/>
                      </div>
                      <div class="attachment-empty">
                        暂无附件
                      </div>
                    </div>
                    <el-dialog
                      title="编辑图片"
                      v-model="galleryAddImage"
                      width="1000">
                    <div class="cropperDiv">
                      <VueCropper 
                        class="cropper"
                        ref="cropper" 
                        :img="galleryImageTmp"
                        :outputSize="1"
                        :outputType="'png'" 
                        :info="true" 
                        :canScale="true" 
                        :autoCrop="true"
                        :autoCropWidth="300" 
                        :autoCropHeight="200" 
                        :fixedBox="false"
                        :fixed="false" 
                        :canMove="true" 
                        :canMoveBox="true"
                        :original="false" 
                        :centerBox="true" 
                        :infoTrue="false" 
                        :full="true"
                        :enlarge="'2'" 
                        :mode="'contain'"
                        >
                      </VueCropper>
                      <div class="operateClip">
                        <TextInput v-model="galleryImageTmpLabel" :fontSize="14" placeholder="请输入图片描述" :key="new Date().getTime()" style="flex: 1;"/>
                        <McBtn :width="100" text="裁剪\上传"  @click="onclip()"/>
                      </div>
                    </div>
                    </el-dialog>
                    
                    <!-- 文件上传对话框 -->
                    <el-dialog
                      title="上传附件"
                      v-model="fileuploadDialog"
                      width="500px">
                      <div class="file-upload-form">
                        <div class="form-item">
                          <label class="form-label">文件名：</label>
                          <el-input
                            v-model="tmpFile.fileName"
                            placeholder="请输入文件名"
                            :maxlength="25"
                            style="width: 350px"
                          />
                        </div>
                        <div class="form-item">
                          <label class="form-label">文件描述：</label>
                          <el-input
                            v-model="tmpFile.fileLabel"
                            placeholder="请输入文件描述"
                            style="width: 350px"
                            :maxlength="50"
                          />
                        </div>
                      </div>
                      <template #footer>
                        <div class="dialog-footer">
                          <McBtn text="取消" @click="cancelFileUpload"/>
                          <McBtn text="上传" @click="confirmFileUpload"/>
                        </div>
                      </template>
                    </el-dialog>
                  </div>
                  <Empty :height="10" />
                  <div class="operate">
                    <el-input
                      v-model="code"
                      placeholder="验证码"
                      style="width: 80px"
                      maxlength="4"
                    />
                    <Code ref="codeImg" width="75px" height="30px" margin="0 5px" />
                    <div class="operateBtn">
                      <McBtn text="发布" @click="onConfirm(1)"/>
                      <div style="margin: 0 2px;"></div>
                      <McBtn text="草稿" @click="onConfirm(0)"/>
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
import { onMounted, ref, reactive } from 'vue'
import { VueCropper } from 'vue-cropper'
import ExpBar from '@/components/ExpBar.vue'
import Ul from '@/components/UlBar.vue'
import Book from '@/components/Book.vue'
import TextInput from '@/components/TextInput.vue'
import McBtn from '@/components/McBtn.vue'
import Code from '@/components/Code.vue'
import Empty from '@/components/FitEmpty.vue'
import { ElMessage, ElNotification,ElMessageBox,ElLoading, ElDialog } from 'element-plus'
import { marked } from 'marked'
import useUserStore from '@/stores/user'
import { editTopic, hasPromiseToEdit, isPromiseToEdit,getTopicContent,findTopicGallery,uploadTopicGallery,deleteTopicGallery, getTopicGalleryUrl, uploadTopicFile, getTopicFile, deleteTopicFile } from '@/api/topic'
import { appendTopic,downloadFile } from '@/api/topic'
import { useRoute, useRouter } from 'vue-router'
import { getUserInfo } from '@/api/user'
import ContentEditor from '@/components/ContentEditor.vue'
const route = useRoute()
const router = useRouter()
let talkLabels = ['问答', '闲聊', '服务器推荐', '教程', '视频']
let resourceLabels = ['模组', '服务端', '客户端', '插件', '材质包', '地图', '光影', '皮肤','数据包']
const labels = ref(route.params.belong == "resource" ? resourceLabels : talkLabels)
const label = ref()
const isMd = ref(false)
const ContentEditorRef = ref(null)
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
const cropper = ref(null)
const galleryImages = ref([])
const galleryImageTmp = ref('')
const galleryAddImage = ref(false)
const galleryImageTmpLabel = ref('')

// 图片放大查看相关
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

const openBigImg = (src)=>{
  dialogImageUrl.value = src
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

// 附件相关数据和方法
const attachments = ref([])

const initTopicFile = async ()=>{
  await getTopicFile(route.params.id)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
      console.log(res.data.object)
      attachments.value = res.data.object
    }
  })
}
initTopicFile()
// 格式化文件大小
const formatFileSize = (bytes) => {
  if (!bytes) return '未知大小'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取附件图标
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
  console.log(fileNameSplit.length > 1 ? iconMap[fileNameSplit[fileNameSplit.length - 1].toLowerCase()] || iconMap.default : iconMap.default)
  return fileNameSplit.length > 1 ? iconMap[fileNameSplit[fileNameSplit.length - 1].toLowerCase()] || iconMap.default : iconMap.default
}
const tmpFile = ref(null)
const fileuploadDialog = ref(false)
const fileUploadInput = ref(null)
const handleFileUploadChange =  (e) => {
  const file = e.target.files[0]
  if (file) {
    // 将文件转换为base64
    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      const base64Data = readerEvent.target.result
      let fileName = file.name
      let tmpFileName = ""
      if(fileName.length > 25){
        if(fileName.indexOf(".") != -1){
          let fileNameSplit = fileName.split('.');
          let maxFileNameLength = 24 - fileNameSplit[fileNameSplit.length - 1].length
          if(fileNameSplit.length > 2){
              for (let i = 0; i < fileNameSplit.length - 2; i++){
                  tmpFileName += fileNameSplit[i];
              }
          }
          else{
              tmpFileName = fileNameSplit[0];
          }
          fileName = tmpFileName.substring(0, maxFileNameLength) + "." + fileNameSplit[fileNameSplit.length - 1];
        }
        else{
            fileName = tmpFileName.substring(0,25);
        }
      }
      tmpFile.value = {
        id: route.params.id,
        fileName: fileName,
        fileLabel: "",
        fileBase64: base64Data
      }
      fileuploadDialog.value = true
      console.log(tmpFile.value)
    }
    reader.onerror = () => {
      ElMessage.error('文件转换失败，请重试')
    }
    reader.readAsDataURL(file)
  }
}

const cancelFileUpload = () => {
  fileuploadDialog.value = false
  tmpFile.value = {
    id: route.params.id,
    fileName: "",
    fileLabel: "",
    fileBase64: ""
  }
  fileUploadInput.value.value = null
}

// 确认文件上传
const confirmFileUpload = async() => {
  console.log('文件上传:', tmpFile.value)
  ElLoading.service({
    lock: true,
    text: '文件上传中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await uploadTopicFile(tmpFile.value)
  .then((res) => {
    console.log(res)
    let msg = res.data.msg
    if(msg == "SUCCESS"){
      ElMessage.success('文件上传成功')
      fileuploadDialog.value = false
      tmpFile.value = {
        id: route.params.id,
        fileName: "",
        fileLabel: "",
        fileBase64: ""
      }
      fileUploadInput.value.value = null
    }
    else{
      ElMessage.error('文件上传失败，请重试')
    }
  })
  .catch((err) => {
    console.log(err)
    ElMessage.error('文件上传失败，请重试')
  })
  ElLoading.service().close()
}
// 显示上传附件对话框
const showUploadAttachment = () => {
  fileUploadInput.value.click()
}

const deleteAttachment = (id) => {
  ElMessageBox.confirm('确定删除此附件吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    // 确认删除
    await deleteTopicFile(id, route.params.id).then(res=>{
      if(res.data.msg == "SUCCESS"){
        attachments.value = attachments.value.filter(attachment => attachment.id !== id)
        ElMessage.success('附件删除成功')
      }
      else{
        ElMessage.error('附件删除失败，请重试')
      }
    }).catch(err=>{
      ElMessage.error('附件删除失败，请重试')
    })
  }).catch(() => {
    // 取消删除
    ElMessage.info('已取消删除')
  })
}

const userStore = useUserStore()
const fileInput = ref(null)
// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      ElMessage.warning('请选择JPG或PNG格式的图片')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        if(e.target.result.length >= 5 * 1024 * 1024){
          ElMessage.warning('图片大小不能超过5MB')
          return
        }
        console.log('图片数据加载成功，长度:', e.target.result.length)
        galleryImageTmp.value = ''
        setTimeout(() => {
          galleryImageTmp.value = e.target.result
          galleryAddImage.value = true
          galleryImageTmpLabel.value = ''
          console.log('画廊对话框已打开')
        }, 0)
      } else {
        console.error('图片数据加载失败')
        ElMessage.error('图片加载失败，请重试')
      }
    }
    reader.onerror = () => {
      console.error('文件读取错误')
      ElMessage.error('文件读取错误，请重试')
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}
const init = async () => {
  if(route.params.belong != "resource" && route.params.belong != "talk"){
    router.push('/topic/resource')
  }
  if (route.params.id) {
    await isPromiseToEdit(route.params.id)
      .then(async(res) => {
        let msg = res.data.msg
        if (msg == 'SUCCESS') {
          await hasPromiseToEdit(route.params.id).then(async(res)=>{
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
              await getTopicContent(data.user,data.id)
              .then(res=>{
                content.value = res.data
              })
              .catch(e=>{
                content.value = ""
                ElMessage.error("获取主题帖内容失败")
                console.log(e)
              })
              if(route.params.belong != data.belong){
                router.push('/topic/'+data.belong+'/'+data.id)
              }
              await findTopicGallery(data.id)
              .then(res=>{
                galleryImages.value = res.data.object
              })
              .catch(e=>{
                galleryImages.value = []
                ElMessage.error("获取画廊图片失败")
                console.log(e)
              })
            }
            else{
              ElNotification({
                title: '访问拒绝',
                message: '该文章出现错误，请删除重新发布',
                type: 'error'
              })
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
}
const errorPromise = ()=>{
  ElNotification({
    title: '访问拒绝',
    message: '不允许编辑该主题帖',
    type: 'error'
  })
  router.back()
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
      }else if(msg == 'APPEND_DAY_MAX_ERROR'){
        ElMessage.error('今日添加主题帖上限')
      } else if(msg == 'SUCCESS'){
        let data = res.data.object
        let num = res.data.num
        router.push('/topic/detail/' + data)
        ElNotification({
          title: '发布成功',
          message: '成功发布'+title.value,
          type: 'success'
        })
        if(num != 0){
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
                data.email,
                data.role
              )
        })
        }
      }
      else{
        ElMessage.error('服务异常')
      }
    })
    .catch((err) => {
      ElMessage.error('服务异常')
    })
}
const edit = async (data) => {
  await editTopic(data).then(async(res)=>{
    let msg = res.data.msg
    let num = res.data.num
    if(msg == 'SUCCESS'){
      if(num != 0){
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
                data.email,
                data.role
              )
            console.log(userStore.exp)
          }
        }).catch(err=>{
          ElMessage.error('服务异常')
        })
      }
      else{
        ElNotification({
          title: '编辑成功',
          message: '成功编辑'+title.value,
          type: 'success'
        })
      }  
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
                data.email,
                data.role
              )
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

const onConfirm = async (display) => {
  if (title.value.length < 6) {
    ElNotification({
      title: '标题过短',
      message: '标题长度不得少于6个字符',
      type: 'warning',
      duration: 2000
    })
  }
  else if (label.value == null || label.value.length == 0){
    ElNotification({
      title: '分类为空',
      message: '请选择分类',
      type: 'warning',
      duration: 2000
    })

  } else if (subtitle.value.length >100) {
    ElNotification({
      title: '作品名过短',
      message: '作品名长度不得少于4个字符',
      type: 'warning',
      duration: 2000
    })
  } else if (subtitleEn.value.length >= 100) {
    ElNotification({
      title: '英文名过长',
      message: '英文名长度不得超过100个字符',
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
  } else if (version.value.length == 0 && route.params.belong == "resource") {
    ElNotification({
      title: '版本不能为空',
      message: '版本不能为空，请输入适用版本',
      type: 'warning',
      duration: 2000
    })
  } else if (version.value.length >= 50 ) {
    ElNotification({
      title: '版本不能超过50个字符',
      message: '版本字符长度不得超过50个字符',
      type: 'warning',
      duration: 2000
    })
  } else if (author.value.length >= 50) {
    ElNotification({
      title: '作者名称不能超过50个字符',
      message: '原创输入自己的用户名称，转载输入原作者名称',
      type: 'warning',
      duration: 2000
    })
  } else if (language.value.length >= 100) {
    ElNotification({
      title: '语言不能超过100个字符',
      message: '请输入该资源所适配的语言',
      type: 'warning',
      duration: 2000
    })
  } else if (ContentEditorRef.value.content.length < 10) {
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
      content: ContentEditorRef.value.content,
      code: codeImg.value.random+":"+code.value,
      belong: route.params.belong,
      display: display
    }
    if (route.params.id) {
      await edit(data)
    } else {
      await append(data)
    }
    codeImg.value.changeCode()
  }
}

const selectImg = ()=>{
  if(route.params.id){
    fileInput.value.click()
    return
  }
  ElMessage.warning('请先将主题发布或存入草稿')
}

const onclip = ()=>{
  cropper.value.getCropData(async(data)=>{
    let loading = ElLoading.service({
      lock: true,
      text: '图片上传中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    galleryImageTmp.value = data
    galleryAddImage.value = false
    await uploadTopicGallery(route.params.id,galleryImageTmpLabel.value,data).then(res =>{
      let msg = res.data.msg
      let data = res.data.object
      if(msg == 'SUCCESS'){
        galleryImages.value.push(data)
        console.log(galleryImages.value)
        ElMessage.success('图片已添加到画廊')
      }
      else if(msg == "GALLERY_FULL"){
        ElMessage.error('画廊已达上限，无法添加图片')
      }
      else if(msg == "REJECT"){
        ElMessage.error('权限不足')
      }
      else if(msg == "NO_LOGIN"){
        ElMessage.error('请先登录')
      }
      else{
        ElMessage.error("图片上传失败")
      }
    })
    .catch(err =>{
      ElMessage.error("图片上传失败")
    })
    loading.close()
  })
}

const delGalleryImg = async(id)=>{
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    let loading = ElLoading.service({
      lock: true,
      text: '图片删除中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await deleteTopicGallery(id,route.params.id).then(res =>{
      let msg = res.data.msg
      if(msg == 'SUCCESS'){
        ElMessage.success('图片已删除')
        galleryImages.value = galleryImages.value.filter(item => item.id != id)
      }
      else if(msg == "NO_EXIST_GALLERY"){
        ElMessage.error('图片不存在')
      }
      else if(msg == "REJECT"){
        ElMessage.error('权限不足')
      }
      else if(msg == "NO_LOGIN"){
        ElMessage.error('请先登录')
      }
      else{
        ElMessage.error("图片删除失败")
      }
    })
    loading.close()
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const copyImageLink = (url)=>{
  const textArea = document.createElement('textarea')
  textArea.value = url
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    ElMessage.success('图片链接已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  } finally {
    document.body.removeChild(textArea)
  }
}
const copyImageCode = (img)=>{
  const textArea = document.createElement('textarea')
  textArea.value = "!["+img.label+"]("+getTopicGalleryUrl(img.path)+")"
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    ElMessage.success('内联代码已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  } finally {
    document.body.removeChild(textArea)
  }
}
onMounted(() => {
  init()
  initImageClick()
})
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
.titleInput{
  position: relative;
  top:-2px
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
  padding-right: 24px;
  margin: 20px 0 5px 0;
  min-height: 300px;
  width: 776px;
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
.operateBtn{
  display: inline-flex;
  margin: 0 10px;
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
  height: 60px;
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

.attachment-delete-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.attachment-delete-btn:hover {
  background-color: rgba(255, 0, 0, 0.9);
  font-size: 14px;
  transform: scale(1.1);
}

.delete-icon {
  width: 12px;
  height: 12px;
  filter: brightness(0) invert(1);
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

.contentMd :deep(img){
  max-width: 740px !important;
  transition: transform 0.2s ease;
}

.contentMd :deep(img):hover{
  transform: scale(1.02);
}

.gallery-item .gallery-remove-btn,
.gallery-item .gallery-copy-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-remove-btn,
.gallery-item:hover .gallery-copy-btn {
  opacity: 1;
}

.gallery-remove-btn {
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.gallery-copy-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: white;
  border: none;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.gallery-code-btn {
  bottom: 30px;
  right: 5px;
}

.gallery-remove-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.gallery-empty {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  border: 1px dashed #e0e0e0;
  border-radius: 4px;
}
.cropperDiv{
  height: 400px;
  display: flex;
  flex-direction: column;
}

/* 文件上传对话框样式 */
.file-upload-form {
  padding: 20px 0;
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.form-label {
  width: 80px;
  text-align: right;
  padding-top: 7px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.cropper{
  width: 100%;
  flex: 1;
  border: 1px solid #ddd;
}
.operateClip{
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding: 0 20px;
}
.preview{
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  overflow: hidden;
}
.previewChild{
  width: 100px;
  height: 100px;
  transform-origin: 0 0;
}
.cropper >>> .cropper-container {
  width: 100% !important;
  height: 100% !important;
}

.contentMd :deep(img){
  max-width: 740px !important;
}
</style>
