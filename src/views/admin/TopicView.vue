<template>
    <div class="topic" :class="isDark ? 'dark' : ''">
        <h2>主题列表</h2>
        <div style="margin: 10px 0;">
            <el-button type="primary" @click="openDialog(0)" plain >添加</el-button>
        </div>
        <el-table :data="topics" :class="isDark ? 'dark' : ''" style="">
            <el-table-column label="id" prop="id" width="250"/>
            <el-table-column label="标题" prop="title" width="600"/>
            <el-table-column label="分类" prop="label"/>
            <el-table-column label="所属用户" prop="user"/> 
            <el-table-column label="发布日期" prop="date" width="150"/>
            <el-table-column label="浏览" prop="view"/>
            <el-table-column label="评论" prop="comment"/>
            <el-table-column label="版本" prop="version" width="150"/>
            <el-table-column label="板块" prop="belong" width="150">
                <template #default="{row}">
                    <span v-if="row.belong === 'resource'">资源</span>
                    <span v-else-if="row.belong === 'talk'">有话说</span>
                    <span v-else>{{ row.belong }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否首发" prop="isFirstPublic" width="150">
                <template #default="{row}">
                    {{ row.isFirstPublic === 1 ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column label="显示状态" prop="display" width="150">
                <template #default="{row}">
                    <span v-if="row.display === 1" style="color: green;">发布</span>
                    <span v-else-if="row.display === -1" style="color: red;">待整改</span>
                    <span v-else style="color: grey;">草稿</span>
                </template>
            </el-table-column>
            <el-table-column width="380" align="center" fixed="right">
                <template #header>
                    <el-input :class="isDark? 'dark':''" v-model="keyword" size="small" placeholder="Type to search" @input="search" title="可搜主题id、标题和发表用户"/>
                </template>
                <template #default="{row}">
                    <el-button type="warning" @click="look(row)" plain>查看</el-button>
                    <el-button type="success" @click="openGallery(row)" plain>画廊</el-button>
                    <el-button type="success" @click="openAttachmentDialog(row)" plain>附件</el-button>
                    <el-button type="primary" @click="openDialog(row)" plain>编辑</el-button>
                    <el-button type="danger" @click="onDel(row)" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
            :class="isDark ? 'dark':''"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="10"
            layout="total, prev, pager, next"
            background
            :total="total"/>
        </div>
        
        <el-dialog :class="isDark ? 'dark' : ''" v-model="dialog" align-center :title="dialogTitle" :width="850" :close-on-click-modal="false" :show-close="false">
            <div class="dialog" >
                <el-form inline ref="formInput" :rules="rules" :model="topic">
                    <el-form-item label="id" prop="id">
                        <el-input v-model="topic.id" style="width: 280px;" placeholder="请输入主题id[空为自动分配]" :disabled="dialogTitle === '编辑主题'"></el-input>
                    </el-form-item>
                    <el-form-item label="语言" prop="language">
                        <el-input v-model="topic.language" style="width: 320px;" placeholder="请输入适用语言"></el-input>
                    </el-form-item>
                    <el-form-item label="主标题" prop="title">
                        <el-input v-model="topic.title" style="width: 655px;" placeholder="请输入主标题"></el-input>
                    </el-form-item>
                    <el-form-item label="标题" prop="topicTitle">
                        <el-input v-model="topic.topicTitle" placeholder="请输入标题" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="英文标题" prop="enTitle">
                        <el-input v-model="topic.enTitle" placeholder="请输入英文标题" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="label" v-if="topic.belong">
                        <el-select style="width: 100px;" v-model="topic.label" placeholder="选择分类">
                            <el-option v-for="item in topicLabel" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类" v-else>
                        <el-input style="width: 100px;" placeholder="请先选择归属" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发布日期" prop="date">
                        <el-date-picker type="date" v-model="topic.date" placeholder="请选择发布日期" style="width: 180px;" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="浏览" prop="view">
                        <el-input type="number" style="width: 100px;" v-model="topic.view" placeholder="请输入浏览量"></el-input>
                    </el-form-item>
                    <el-form-item label="用户" prop="user">
                        <el-select style="width: 200px;" v-model="topic.user" placeholder="请选择用户"
                            filterable
                            remote
                            reserve-keyword
                            :remote-method="remoteMethod">
                            <el-option v-for="item in userSelect" :key="item.user" :label="item.user" :value="item.user" >
                                <span style="float: left">{{ item.user }}</span>
                                <span
                                    style="
                                    position: relative;
                                    float: right;
                                    right: -25px;
                                    color: var(--el-text-color-secondary);
                                    font-size: 12px;
                                    "
                                    >{{ item.name }}</span
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本" prop="version">
                        <el-input v-model="topic.version" placeholder="请输入适用版本"></el-input>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="topic.author" placeholder="请输入作者[转载专用]"></el-input>
                    </el-form-item>
                    <el-form-item label="来源" prop="source">
                        <el-select v-model="topic.source" style="width: 140px;" placeholder="请输入来源" >
                            <el-option label="原创" value="原创"></el-option>
                            <el-option label="转载" value="转载"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="原帖地址" prop="address">
                        <el-input v-model="topic.address" style="width: 660px;" placeholder="请输入原帖地址"></el-input>
                    </el-form-item>
                    <el-form-item label="下载地址" prop="download">
                        <el-input v-model="topic.download" style="width: 660px;" placeholder="请输入下载地址"></el-input>
                    </el-form-item>
                    <el-form-item label="归属" prop="belong">
                        <el-select style="width: 150px;" v-model="topic.belong" placeholder="选择归属">
                            <el-option label="资源" value="resource"></el-option>
                            <el-option label="有话说" value="talk"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否首发" prop="isFirstPublic">
                        <el-select style="width: 150px;" v-model="topic.isFirstPublic" placeholder="选择是否首发">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示状态" prop="display">
                        <el-select style="width: 150px;" v-model="topic.display" placeholder="选择显示状态">
                            <el-option label="发布" value="1"></el-option>
                            <el-option label="草稿" value="0"></el-option>
                            <el-option label="待整改" value="-1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form label-position="top" :rules="rules" :model="topic">
                    <el-form-item prop="content" class="contentMain">
                        <ContentEditor ref="ContentEditorRef" class="contentInput" :value="topic.content" :switchHandler="initImageClick" editBtnStyle="top: -30px;"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button type="danger" plain @click="clear()">取 消</el-button>
                <el-button type="primary" plain @click="confirm()">确 定</el-button>
            </template>
        </el-dialog>
        
        <el-dialog :class="isDark ? 'dark' : ''" v-model="lookDialog" align-center title="查看文章" :width="900" :close-on-click-modal="false">
            <div class="look-dialog" >
                <div class="look-dialog-header">
                    <h3>{{ lookTopic.title }}</h3>
                    <div class="look-dialog-info">
                        <span>ID: {{ lookTopic.id }}</span>
                        <span>分类: {{ lookTopic.label }}</span>
                        <span>用户: {{ lookTopic.user }}</span>
                        <span>日期: {{ lookTopic.date }}</span>
                        <span>浏览: {{ lookTopic.view }}</span>
                    </div>
                </div>
                <div class="look-dialog-content">
                    <h4>{{ lookTopic.topicTitle }}</h4>
                    <p>{{ lookTopic.enTitle }}</p>
                    <div class="look-dialog-meta">
                        <span>语言: {{ lookTopic.language }}</span>
                        <span>版本: {{ lookTopic.version }}</span>
                        <span>作者: {{ lookTopic.author }}</span>
                        <span>来源: {{ lookTopic.source }}</span>
                    </div>
                    <div class="look-dialog-text contentMd" v-html="contentMd"></div>
                    <div class="look-dialog-links">
                        <p v-if="lookTopic.address">
                            <strong>原帖地址:</strong> <a :href="lookTopic.address" target="_blank">{{ lookTopic.address }}</a>
                        </p>
                        <p v-if="lookTopic.download">
                            <strong>下载地址:</strong> <a :href="lookTopic.download" target="_blank">{{ lookTopic.download }}</a>
                        </p>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button type="primary" plain @click="goToTopic">通过原贴查看</el-button>
                <el-button type="primary" plain @click="lookDialog = false">关闭</el-button>
            </template>
        </el-dialog>
        
        <el-dialog :class="isDark ? 'dark' : ''" v-model="galleryDialog" align-center title="图片画廊" :width="1000" :close-on-click-modal="false">
            <div class="gallery-container">
                <div class="gallery-header">
                    <h3>{{ gallery.title }}</h3>
                    <span>共 {{ galleryImages.length }} 张图片</span>
                </div>
                <div class="gallery-grid" v-if="galleryImages.length > 0">
                    <div v-for="(img, index) in galleryImages" :key="index" class="gallery-item">
                        <div class="gallery-item-container">
                            <el-image
                                :src="getImageUrl(img.path)"
                                :preview-src-list="galleryImagesUrl"
                                :initial-index="index"
                                fit="cover"
                                preview-teleported="true"
                                preview-fullscreen-teleported="true"
                                preview-close-on-click-modal="false"
                                :zoom-rate="1.1"
                                :max-zoom="10"
                                :min-zoom="0.5"
                            />
                            <button 
                                class="gallery-btn delete-btn" 
                                @click.stop="deleteImage(img)"
                                title="删除图片">x</button>
                            <button 
                                class="gallery-btn copy-link-btn" 
                                @click.stop="copyImageLink(img)"
                                title="复制图片链接">
                                <svg t="1762189391268" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M639.008828 394.595895a242.983301 242.983301 0 0 0-24.798858-21.443049 49.313325 49.313325 0 0 0-71.950814 67.173052 49.483959 49.483959 0 0 0 12.115039 10.465573c4.664005 3.867712 9.214254 7.621667 13.480113 11.944404l4.095224 3.981468c51.076546 51.076546 35.833212 139.066988-15.300213 190.143534l-218.070688 218.070688a131.274686 131.274686 0 0 1-185.365772 0l-4.095224-4.152103a131.047174 131.047174 0 0 1 0-185.252016l96.351524-96.294646A53.579183 53.579183 0 1 0 182.106941 502.948701L182.106941 502.778067l-1.023806 0.966928a53.863574 53.863574 0 0 0-10.238061 9.555523l-100.10548 93.678253a242.755789 242.755789 0 0 0 0 342.292488l4.095225 4.095224a242.869545 242.869545 0 0 0 342.235609 0l218.01381-218.127565c94.019522-94.133278 101.982458-242.585155 7.962936-336.661555l-3.981468-3.981468z m314.308456-319.825633l-4.095224-4.095224a242.698911 242.698911 0 0 0-342.23561 0L388.97264 288.802604c-94.133278 94.133278-99.309186 230.015092-5.175908 324.205247l3.981468 3.981468c4.265859 4.265859 8.702351 8.304205 13.2526 12.115038 3.242052 3.697077 7.109764 6.825374 11.375623 9.328011l0.113756 0.056878a46.583175 46.583175 0 0 0 65.12544-60.632069c-6.142836-13.821382-17.632215-22.239342-25.595151-30.202278l-4.038346-3.981468c-51.133424-51.076546-31.737987-125.302484 19.395437-176.435909l218.184444-218.070687a131.047174 131.047174 0 0 1 185.195138 0l4.095224 3.981467a131.16093 131.16093 0 0 1 0 185.422651L778.758353 434.638087a53.06728 53.06728 0 0 0 31.624231 95.782743 52.896646 52.896646 0 0 0 27.870276-7.849179l0.113756 0.28439 1.535709-1.365075a53.408549 53.408549 0 0 0 12.05816-11.14811l101.243043-93.393862a242.642033 242.642033 0 0 0 0.056878-342.23561z" fill="#1890ff"/></svg>
                            </button>
                            <button 
                                class="gallery-btn copy-code-btn" 
                                @click.stop="copyImageCode(img)"
                                title="复制Markdown代码" >
                                <svg t="1762189106165" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M591.024 128l3.584 0.64 30.848 7.936a16 16 0 0 1 11.584 19.584L448.624 884.16a16 16 0 0 1-19.584 11.648l-30.784-8a16 16 0 0 1-11.648-19.648L575.088 140.16a16 16 0 0 1 19.584-11.52zM302.512 202.688a15.936 15.936 0 0 1 19.328 2.688l22.784 22.784 2.688 3.52a15.936 15.936 0 0 1-2.688 19.328L84.208 511.36l260.8 260.48c6.4 6.4 6.4 16.32 0 22.72l-22.784 22.848-3.456 2.624a15.936 15.936 0 0 1-19.328-2.624l-294.4-294.4-2.688-3.52a15.936 15.936 0 0 1 2.688-19.328l22.784-22.784L299.12 205.44z m397.312 2.688c6.4-6.016 16.448-6.4 22.848 0l271.552 271.616 22.784 22.784c6.4 6.4 6.4 16.384 0 22.784l-294.4 294.4c-6.4 6.016-16.384 6.4-22.784 0l-22.784-22.784a16.32 16.32 0 0 1 0-22.784l260.416-260.032-260.416-260.352a16.32 16.32 0 0 1 0-22.848z" fill="#52c41a"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="gallery-empty">
                    <el-empty description="暂无图片" />
                </div>
            </div>
            <template #footer>
                <el-button type="primary" @click="handleGalleryUpload">上传图片</el-button>
                <el-button @click="galleryDialog = false">关闭</el-button>
            </template>
        </el-dialog>
        <el-dialog
          :class="isDark ? 'dark' : ''"
          title="编辑图片"
          v-model="galleryAddImage"
          width="1000px">
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
              :mode="'contain'">
            </VueCropper>
            <div class="operateClip">
              <el-input v-model="galleryImageTmpLabel" placeholder="请输入图片描述" style="flex: 1; margin-right: 10px;"/>
              <el-button type="primary" @click="onclip">裁剪\上传</el-button>
            </div>
          </div>
        </el-dialog>
        
        <!-- 附件模态框 -->
        <el-dialog 
          :class="isDark ? 'dark' : ''"
          v-model="attachmentDialog" 
          :title="'附件管理 - ' + (attachmentTopic?.title || '')" 
          width="800px"
          :close-on-click-modal="false">
          <div class="attachment-list" v-if="attachments.length != 0">
            <div class="attachment-header">
                <span class="attachment-title">附件</span>
                <input type="file" ref="fileUploadInput" accept="*.*" style="display: none" @change="handleFileUploadChange"/>
                <el-button type="primary" @click="showUploadAttachment">上传附件</el-button>
            </div>
            <div class="attachment-container">
                <div v-for="(attachment, index) in attachments.slice(0, 3)" :key="index" class="attachment-item-wrapper" :title="attachment.fileLabel">
                  <a :href="attachment.path" class="attachment-item" @click="downloadFile(attachment.id)">
                    <div class="attachment-icon">
                      <img :src="getAttachmentIcon(attachment.fileName)"  class="attachment-img"/>
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
                <el-button type="primary" @click="showUploadAttachment">上传附件</el-button>
              </div>
              <div class="attachment-empty">
                暂无附件
              </div>
            </div>
          <template #footer>
            <el-button @click="attachmentDialog = false">关闭</el-button>
          </template>
        </el-dialog>
        
        <!-- 文件上传对话框 -->
        <el-dialog
          :class="isDark ? 'dark' : ''"
          title="上传附件"
          v-model="fileuploadDialog"
          width="500px">
          <div class="file-upload-form">
            <div class="form-item">
              <label class="form-label">文件名：</label>
              <el-input
                v-model="tmpFile.fileName"
                placeholder="请输入文件名"
                style="width: 350px"
                :maxlength="25"
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
              <el-button @click="cancelFileUpload(attachmentTopic.id)">取消</el-button>
              <el-button type="primary" @click="confirmFileUpload">上传</el-button>
            </div>
          </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { addTopic, deleteTopic, findAllTopic, getTopicContent, updateTopic, findAllTopicGallery, getImageUrl, uploadTopicGallery, deleteTopicGallery, getTopicFile, deleteTopicFile, uploadTopicFile } from '@/api/admin/topic';
import { VueCropper } from 'vue-cropper';
import { findAllUsersForSelect } from '@/api/admin/user';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import {inject, onMounted, reactive, ref, computed, watch} from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ContentEditor from '@/components/ContentEditor.vue'



const router = useRouter()
const userStore = useUserStore()
const isDark = inject('isDark')
const keyword = ref('')
const topics = ref([])
const ContentEditorRef = ref(null)
const topic = ref({
    id:'',
    title:'',
    label: '',
    user: '',
    date: '',
    view: 0,
    belong: '',
    isFirstPublic: 0,
    display: 0,
    version: '',
    topicTitle: '',
    enTitle: '',
    source: '',
    author: '',
    language: '',
    address: '',
    download: '',
    content: '',
    belong: '',
    isFirstPublic: 0,
    display: 0,
})
const rules = reactive({
    id:{max: 24,message: 'id不能超过24个字符',trigger: 'blur'},
    title: {required: true,message: '标题不能为空',trigger: 'blur'},
    label: {required: true,message: '分类不能为空',trigger: 'change'},
    user: {required: true,message: '用户不能为空',trigger: 'change'},
    date: {type: 'date',required: true,message: '日期不能为空',trigger: 'blur'},
    view: {required: true,message: '浏览量不能为空',trigger: 'blur'},
    version: {max: 100,message: '版本不能超过100个字符',trigger: 'blur'},
    topicTitle: {max: 100,message: '标题不能超过100个字符',trigger: 'blur'},
    enTitle: {max: 100,message: '英文标题不能超过100个字符',trigger: 'blur'},
    author:{max: 50,message: '作者不能超过50个字符',trigger: 'blur'},
    source: {required: true,message: '来源不能为空',trigger: 'change'},
    address: {max: 255,message: '原帖地址不能超过255个字符',trigger: 'blur'},
    download: {max: 255,message: '下载地址不能超过255个字符',trigger: 'blur'},
    content: {required: true,message: '内容不能为空',trigger: 'blur'},
    language: {max: 100,message: '语言不能超过100个字符',trigger: 'blur'},
    belong: {required: true,message: '归属不能为空',trigger: 'change'},
    isFirstPublic: {required: true,message: '是否首发不能为空',trigger: 'change'},
    display: {required: true,message: '显示状态不能为空',trigger: 'change'}
})

const search = ()=>{
    getTopicList()
}

import { marked } from 'marked'
import { downloadFile } from '@/api/topic';
const contentMd = ref('')
const userSelect = ref([])
const page = ref(1)
const total = ref(0)
const handleCurrentChange = (e)=>{
    page.value = e
    getTopicList()
}
const dialogTitle = ref('添加主题')
const dialog = ref(false)
const loading = ref(false)
// 根据归属字段动态计算分类选项
const topicLabel = computed(() => {
  if (topic.value.belong === 'resource') {
    return ['服务端', '客户端', '模组', '插件', '材质包', '地图', '光影', '皮肤', '数据包']
  } else if (topic.value.belong === 'talk') {
    return ['问答', '水馆', '服务器推荐', '教程', '视频']
  }
  return []
})

const lookDialog = ref(false)
const lookTopic = ref({})
const look = async (i)=>{
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    lookTopic.value = i
    lookDialog.value = true
    await getTopicContent(lookTopic.value.user,lookTopic.value.id)
    .then(res=>{
      toMd(res.data)
      console.log()
    })
    .catch(err=>{
        ElMessage.error("获取文章内容失败")
    })
    .finally(() => {
        loading.close()
    })
}
const goToTopic = ()=>{
    router.push("/topic/detail/"+lookTopic.value.id)
}

watch(() => topic.value.belong, (newBelong, oldBelong) => {
  if (newBelong && newBelong !== oldBelong && topic.value.label) {
    const validLabels = topicLabel.value
    if (Array.isArray(validLabels) && !validLabels.includes(topic.value.label)) {
      if (newBelong === 'resource') {
        topic.value.label = '服务端'
      } else if (newBelong === 'talk') {
        topic.value.label = '问答'
      }
    }
  }
})
const openDialog = async(e)=>{
    if (loading.value) return // 防止重复提交
    loading.value = true
    if(e == 0){
        dialogTitle.value = '添加主题'
    }
    else{
        dialogTitle.value = '编辑主题'
        const tempTopic = {...e}
        tempTopic.isFirstPublic = tempTopic.isFirstPublic.toString()
        tempTopic.display = tempTopic.display.toString()
        topic.value = tempTopic
        ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        await getTopicContent(topic.value.user,topic.value.id)
        .then(res=>{
            topic.value.content = res.data
        })
        .catch(err=>{
            ElMessage.error("获取文章内容失败")
        }).finally(() => {
            ElLoading.service().close()
        })
    }
    dialog.value = true
    loading.value = false
}
const formInput = ref(null)
const confirm = ()=>{
    if (loading.value) return // 防止重复提交
    ElLoading.service({
      lock: true,
      text: '数据提交中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    formInput.value.validate(async(valid)=>{
        if(valid){
            loading.value = true
            if(dialogTitle.value == '添加主题'){
                await addTopic(topic.value).then(res=>{
                    let msg = res.data.msg
                    if(msg == 'SUCCESS'){
                        ElMessage.success("操作成功")
                        clear()
                        getTopicList()
                    }
                    else if(msg == 'EXIST_ERROR'){
                        ElMessage.error("主题id已存在")
                    }
                    else{
                        ElMessage.error("操作失败")
                    }
                }).catch(err=>{
                    ElMessage.error("服务错误")
                }).finally(() => {
                    loading.value = false
                })
            }
            else{
                await updateTopic(topic.value).then(res=>{
                    let msg = res.data.msg
                    if(msg == 'SUCCESS'){
                        ElMessage.success("操作成功")
                        clear()
                        getTopicList()
                    }
                    else if(msg == 'NOT_EXIST_ERROR'){
                        ElMessage.error("主题id不存在")
                    }
                    else{
                        ElMessage.error("操作失败")
                    }
                }).catch(err=>{
                    ElMessage.error("服务错误")
                }).finally(() => {
                    loading.value = false
                }) 
            }
        }
    })
    ElLoading.service().close()
}
const clear = ()=>{
    dialog.value = false
    topic.value = {
        id:'',
        title:'',
        label: '',
        user: '',
        date: '',
        view: 0,
        version: '',
        topicTitle: '',
        enTitle: '',
        source: '',
        author: '',
        language: '',
        address: '',
        download: '',
        content: ''
    }
}
const onDel = (i)=>{
    if (loading.value) return // 防止重复提交
    ElMessageBox.confirm(i.title, '确定删除该主题吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        loading.value = true
        await deleteTopic(i.id).then(res=>{
            let msg = res.data.msg
            if(msg == 'SUCCESS'){
                ElMessage.success("删除成功")
                getTopicList()
            }
            else{
                ElMessage.error("删除失败")
            }
        }).catch(err=>{
            ElMessage.error("服务错误")
        }).finally(() => {
            loading.value = false
        })
      }).catch(() => {
        ElMessage.info('已取消删除')
      });
}
const getTopicList = async()=>{
  ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await findAllTopic(page.value,keyword.value).then(res=>{
      let msg = res.data.msg
      if(msg == 'SUCCESS'){
          topics.value = res.data.object
          total.value = res.data.num
      }
      else{
          ElMessage.error("获取主题列表失败")
      }
  }).catch(err=>{
      ElMessage.error("服务错误")
  })
  ElLoading.service().close()
}
const remoteMethod = async(queryString)=>{
  if (!queryString) {
    userSelect.value = [];
    return;
  }
  await findAllUsersForSelect(queryString).then(res=>{
    if (res.data.msg === 'SUCCESS') {
      userSelect.value = res.data.object;
    } else {
      ElMessage.error('获取用户列表失败！');
    }
  })
  .catch(err=>{
    console.log(err);
    ElMessage.error('服务异常');
  })
}

const gallery = ref({})
const galleryDialog = ref(false)
const galleryImages = ref([])
const galleryImagesUrl = ref([])
const originalContent = ref('')
const galleryImageTmp = ref('')
const galleryAddImage = ref(false)
const galleryImageTmpLabel = ref('')
const cropper = ref(null)

// 附件相关
const attachmentDialog = ref(false)
const attachmentTopic = ref({})
const attachments = ref([])
const fileuploadDialog = ref(false)
const tmpFile = ref({
  fileName: '',
  fileLabel: ''
})

const openGallery = async (row)=>{
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    gallery.value = row
    galleryDialog.value = true
    await getGallery(row.id)
        .finally(() => {
            loading.close()
        })
}
const getGallery = async (id)=>{
    const loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
    await findAllTopicGallery(id).then(res=>{
        if(res.data.msg == 'SUCCESS'){
            galleryImages.value = res.data.object
            let list = []
            galleryImages.value.forEach(item=>{
                list.push(getImageUrl(item.path))
            })
            galleryImagesUrl.value = list
        }
        else{
            ElMessage.error("获取图片列表失败")
        }
    }).catch(err=>{
        ElMessage.error("服务错误")
    })
    .finally(() => {
        loading.close()
    })
}

// 删除图片
const deleteImage = async (img)=>{
    await ElMessageBox.confirm(
        '确定要删除这张图片吗？',
        '删除确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        const loading = ElLoading.service({
            lock: true,
            text: '处理中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        await deleteTopicGallery(img.id)
        .then(res=>{
            if(res.data.msg == 'SUCCESS'){
                ElMessage.success("删除成功")
                getGallery(gallery.value.id)
            }
            else{
                ElMessage.error("删除失败")
            }
        })
        .catch(err=>{
            ElMessage.error("服务错误")
        })
        .finally(() => {
            loading.close()
        })
    }).catch(() => {
        // 取消删除
    })
}

// 复制图片链接
const copyImageLink = (img)=>{
    navigator.clipboard.writeText(getImageUrl(img.path))
        .then(() => {
            ElMessage.success('图片链接已复制到剪贴板')
        })
        .catch(() => {
            ElMessage.error('复制失败，请手动复制')
        })
}

// 复制内联代码
const copyImageCode = (img)=>{
    navigator.clipboard.writeText(`![${img.label}](${getImageUrl(img.path)})`)
        .then(() => {
            ElMessage.success('Markdown图片代码已复制到剪贴板')
        })
        .catch(() => {
            ElMessage.error('复制失败，请手动复制')
        })
}
// 处理图片上传
const handleGalleryUpload = async () => {
  try {
    // 创建临时的input元素
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg, image/png, image/jpg'
    
    input.onchange = async (event) => {
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
            galleryImageTmp.value = ''
            setTimeout(() => {
              galleryImageTmp.value = e.target.result
              galleryAddImage.value = true
              galleryImageTmpLabel.value = ''
            }, 0)
          } else {
            ElMessage.error('图片加载失败，请重试')
          }
        }
        reader.onerror = () => {
          ElMessage.error('文件读取错误，请重试')
        }
        reader.readAsDataURL(file)
      }
      // 清理input元素
      document.body.removeChild(input)
    }
    
    // 添加到DOM并触发点击
    document.body.appendChild(input)
    input.click()
  } catch (error) {
    console.error('创建文件选择器失败', error)
    ElMessage.error('无法选择文件，请重试')
  }
}

// 裁剪并上传图片
const onclip = async () => {
  if (!cropper.value) {
    ElMessage.error('裁剪组件未加载')
    return
  }
  
  try {
    // 获取裁剪后的图片数据
    cropper.value.getCropData(async(data) => {
      const loading = ElLoading.service({
          lock: true,
          text: '上传中...',
          background: 'rgba(0, 0, 0, 0.7)'
      })
      // 调用上传接口
      await uploadTopicGallery(gallery.value.id, galleryImageTmpLabel.value, userStore.user, data)
        .then(res => {
          if(res.data.msg === 'SUCCESS') {
            ElMessage.success('图片上传成功')
            galleryAddImage.value = false
            getGallery(gallery.value.id)
          }
          else if(res.data.msg == 'GALLERY_FULL'){
            ElMessage.error("上传已达上限")
          } else {
            ElMessage.error('图片上传失败：' + ('未知错误'))
          }
        })
        .catch(error => {
          console.error('图片上传失败', error)
          ElMessage.error('图片上传失败，请重试')
        })
        .finally(() => {
            loading.close()
        })
    })
  } catch (error) {
    console.error('裁剪图片失败', error)
    ElMessage.error('裁剪图片失败，请重试')
  }
}

// 附件相关方法
const openAttachmentDialog = (row) => {
  attachmentTopic.value = row
  attachmentDialog.value = true
  findAttachment(row.id)
}

const findAttachment = async(id)=>{
  await getTopicFile(id).then(res=>{
    if(res.data.msg == 'SUCCESS'){
      attachments.value = res.data.object
    }
    else{
      ElMessage.error("获取附件列表失败")
    }
  }).catch(err=>{
    ElMessage.error("服务错误")
  })
}

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
        id: attachmentTopic.value.id,
        fileName: fileName,
        fileLabel: "",
        fileBase64: base64Data
      }
      fileuploadDialog.value = true
    }
    reader.onerror = () => {
      ElMessage.error('文件转换失败，请重试')
    }
    reader.readAsDataURL(file)
  }
}

const cancelFileUpload = (id) => {
  fileuploadDialog.value = false
  tmpFile.value = {
    id: id,
    fileName: "",
    fileLabel: "",
    fileBase64: ""
  }
  fileUploadInput.value.value = null
}

// 确认文件上传
const confirmFileUpload = async() => {
  ElLoading.service({
    lock: true,
    text: '文件上传中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  await uploadTopicFile(tmpFile.value.id,tmpFile.value.fileName,tmpFile.value.fileLabel,tmpFile.value.fileBase64)
  .then(res=>{
    if(res.data.msg == 'SUCCESS'){
        findAttachment(attachmentTopic.value.id)
        fileuploadDialog.value = false
        tmpFile.value = {
            id: attachmentTopic.value.id,
            fileName: "",
            fileLabel: "",
            fileBase64: ""
        }
        fileUploadInput.value.value = null
        ElMessage.success("上传成功")
    }
    else if(res.data.msg == 'FILE_FULL'){
        ElMessage.error("上传已达上限")
    }
    else{
        ElMessage.error("上传失败")
    }
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
    await deleteTopicFile(id)
    .then(res=>{
        if(res.data.msg == 'SUCCESS'){
            ElMessage.success("删除成功")
            findAttachment(attachmentTopic.value.id)
        }
        else{
            ElMessage.error("删除失败")
        }
    })
    .catch(err=>{
        ElMessage.error("服务错误")
    })
  })
    
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
const init = ()=>{
    getTopicList()
}
onMounted(init)
</script>
<style scoped>
.topic{
    width: calc(100% - 40px);
    margin: 20px;
}
.cropperDiv {
  display: flex;
  flex-direction: column;
  height: 500px;
}
.cropper {
  flex: 1;
  margin-bottom: 20px;
}
.operateClip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
}
.dialog{
    height: 500px;
    width: 820px;
    overflow: auto;
}
.page{
    margin-top: 20px;
    display: flex;
    justify-content: end;
}
.look-dialog {
    max-height: 600px;
    overflow-y: auto;
}
.look-dialog-header {
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
}
.look-dialog-header h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
}
.look-dialog-info {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: #666;
}
.look-dialog-content h4 {
    margin: 0 0 10px 0;
    font-size: 16px;
}
.look-dialog-content p {
    margin: 0 0 15px 0;
    color: #666;
}
.look-dialog-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
}
.look-dialog-text {
    margin-bottom: 20px;
    background-color: #fbf2db;
}

.look-dialog-links {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}
.look-dialog-links a {
    color: #0a5397;
    text-decoration: none;
}
.look-dialog-links a:hover {
    text-decoration: underline;
}
.dark .look-dialog-info{
  color: #fbf2db !important;
}
.dark .look-dialog-meta{
  color: #fbf2db !important;
}
.dark .look-dialog-content p{
  color: #fbf2db !important;
}

.gallery-container {
    padding: 20px;
}
.gallery-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color);
}
.gallery-header h3 {
    margin: 0;
    font-size: 18px;
}
.gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }
    .gallery-item {
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .gallery-item-container {
        position: relative;
        width: 100%;
        height: 100%;
        
    }
    .gallery-item-container :deep(img){
        image-rendering: auto;
    }
    .gallery-btn {
        position: absolute;
        opacity: 0.9;
        z-index: 10;
        width: 32px;
        height: 32px;
        padding: 6px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        background-color: rgba(255, 255, 255, 0.9);
    }
    .gallery-btn:hover {
        opacity: 1;
        transform: scale(1.1);
        background-color: #ffffff;
    }
    .gallery-btn svg {
        display: block;
    }
    .delete-btn {
        top: 5px;
        right: 5px;
    }
    .copy-link-btn {
        bottom: 5px;
        left: 5px;
    }
    .copy-code-btn {
        bottom: 5px;
        right: 5px;
    }
.gallery-item:hover {
    transform: scale(1.02);
}
.gallery-item .el-image {
    width: 100%;
    height: 150px;
}
.gallery-empty {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.el-image-viewer__img{
    image-rendering: auto;
}
.contentMain{
    background-color: #fbf2db;
}
.contentInput {
  position: relative;
  padding-right: 24px;
  margin: 20px 0 5px 0;
  min-height: 300px;
  width: 776px;
}

.form-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.form-label {
  width: 80px;
  font-size: 14px;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  min-width: 130px;
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


</style>
