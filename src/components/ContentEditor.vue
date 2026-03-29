<template>
    <div class="contentInput">
        <mavon-editor ref="editorRef" 
                    v-model="content"
                    :style="{ zIndex: 100, maxHeight: maxHeight + 'px'}" 
                    :subfield="false" 
                    :boxShadow="false"
                    toolbarsBackground="#e3c99e"
                    previewBackground="#fbf2db"
                    :toolbars="toolbars" 
                    :minHeight="minHeight"
                    :maxLength="maxLength"
                    @imgAdd="imgAdd" 
                    :class="!isMd ? 'show' : 'hide'">
            <template v-slot:left-toolbar-after>
                <button 
                    type="button" 
                    class="op-icon fa fa-mavon-eye"
                    title="预览"
                    @click="preview"></button>
                <el-dropdown ref="emojiDropdown" trigger="hover" :hide-timeout="300">
                    <button 
                    type="button" 
                    class="op-icon fa fa-smile-o center"
                    title="表情"
                    @click="emojiClick">
                  <img src="/src/assets/img/Cicon.gif"
                   style="margin: 3px;">
                  </button>
                    <template #dropdown>
                      <EmojiMenu @insertEmoji="insertEmoji"></EmojiMenu>
                    </template>
                </el-dropdown>
            </template>
        </mavon-editor>
        <div class="content-container" :class="isMd ? 'show' : 'hide'" :style="{ padding: previewPadding }">
          <div class="hide-btn" :style="props.editBtnStyle">
            <McBtn text="编辑" @click="switchMd"/>
          </div>
          <div id="contentMd" class="contentMd"  v-html="contentMd"></div>
        </div>
        
    </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import EmojiMenu from '@/components/emojiMenu.vue'

import { ElMessage } from 'element-plus'
import McBtn from '@/components/McBtn.vue'
import { marked } from 'marked'
const editorRef = ref(null)
const emojiDropdown = ref(null)


const toolbars = ref({
  bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    help: true, // 帮助
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true
})
const preview = ()=>{
    switchMd()
}
const imgAdd = ()=>{
  ElMessage.warning('此图片上传功能暂未开放，请使用画廊添加图片')
}
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: -1
  },
  maxHeight: {
    type: Number,
    default: 800
  },
  minHeight: {
    type: Number,
    default: 200
  },
  previewPadding:{
    type: String,
    default: '0'
  },
  switchHandler: {
    type: Function,
    default: () => {}
  },
  editBtnStyle: {
    type: String,
    default: 'margin-left:-80px'
  }
})
const content = ref(props.value)
watch(()=>props.value, (newVal) => {
  content.value = newVal
})

const contentMd = ref('')
const isMd = ref(false)
const toMd = () => {
    if (content.value == null) return
    contentMd.value = marked(content.value)
}
const switchMd = () => {
  isMd.value = !isMd.value
  
  toMd()
  props.switchHandler()
}
const change = ()=>{
  switchMd()
}
const insertEmoji = (item) => {
  emojiDropdown.value.handleClose()
  let start = editorRef.value.getTextareaDom().selectionStart
  content.value = content.value.substring(0, start) + `:${item.id}:` + content.value.substring(start)
  setTimeout(() => {
    editorRef.value.textAreaFocus()
    editorRef.value.getTextareaDom().selectionStart = start
    editorRef.value.getTextareaDom().selectionEnd = start + item.id.length + 2
  }, 500)
}
defineExpose({ content,change })
</script>
<style scoped>
.hide-btn{
  position: absolute;
}

.show{
  display: flex;
}

.hide{
  display: none;
}
</style>