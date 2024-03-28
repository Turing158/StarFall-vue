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
          [<a href="/topic">{{ data.label }}</a
          >]
          <span>{{ data.title }}</span>
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
              ><a :href="'/personal/other/' + data.user" class="user"><img src="../../assets/img/name_tag.png" alt="">{{ data.name }}</a></span
            >
          </div>
          <div class="authorHead">
            <a :href="'/personal/other/' + data.user"><img :src="'/src/assets/avatar/' + data.avatar" alt="" /></a>
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
                <div class="likeDiv" v-show="isLike == -1">
                  <a class="like"></a>
                  <a class="dislike"></a>
                </div>
                <div class="likeDiv" v-show="isLike == 0">
                  <a class="like"></a>
                  <a class="dislike"></a>
                </div>
                <div class="alreadyLike likeDiv" v-show="isLike == 1">
                  <a class="like"></a>
                  <span>1000</span>
                  <a class="dislike"></a>
                </div>
                <div class="alreadyDislike likeDiv" v-show="isLike == 2">
                  <a class="like"></a>
                  <a class="dislike"></a>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: initial; border: 0">
              <table class="contentInf">
                <caption>
                  <span>{{ data.label }}</span
                  >作品发布
                </caption>
                <tr>
                  <th>作品名称：</th>
                  <td>{{ data.topicTitle }}</td>
                </tr>
                <tr>
                  <th>Title：</th>
                  <td>{{ data.enTitle }}</td>
                </tr>
                <tr>
                  <th>来源 source：</th>
                  <td>{{ data.source }}</td>
                </tr>
                <tr>
                  <th>适用版本 version：</th>
                  <td>{{ data.version }}</td>
                </tr>
                <tr>
                  <th>作者 author：</th>
                  <td>{{ data.author }}</td>
                </tr>
                <tr>
                  <th>语言 language：</th>
                  <td>{{ data.language }}</td>
                </tr>
                <tr>
                  <th>原帖 address：</th>
                  <td>
                    <a :href="data.address">{{ data.address }}</a>
                  </td>
                </tr>
                <tr>
                  <th>下载 download：</th>
                  <td>
                    <a :href="data.download">{{ data.download }}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="border: 0; background-color: initial">
              <div class="contentMd" id="contentMd" v-highlight v-html="content"></div>
            </td>
          </tr>
        </table>
      </td>
    </table>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import ExpBar from '@/components/ExpBar.vue'
const props = defineProps({
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
      maxExp: 100
    }
  }
})
const data = ref(props.data)
const isLike = ref(0)
import ClipboardJS from 'clipboard'
import { ElMessage } from 'element-plus'
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
const content = ref('')
const toMd = () => {
  if(data.value.content == null) return
  content.value = marked(data.value.content)
}
toMd()
onMounted(copyText)
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
