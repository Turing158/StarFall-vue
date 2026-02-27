import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import "vue-cropper/dist/index.css";

import App from './App.vue'
import router from './router'


import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const app = createApp(App)
app.use(mavonEditor)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(ElementPlus)
app.use(pinia)
app.use(router)

import {marked} from "marked";
import {markedEmoji} from "marked-emoji";
import { createDirectives } from 'marked-directive'
import extendedTables from 'marked-extended-tables'
import { itemEmojis } from '@/assets/img/emoji/getItemEmoji.js'
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";
import markedLinkifyIt from "marked-linkify-it";
import { mangle } from "marked-mangle";
import { markedXhtml } from "marked-xhtml";
import { markedSmartypantsLite } from "marked-smartypants-lite";
import { SubAnSup ,Mark} from '@/util/markedExtension.js'
const emojis = {...itemEmojis}
const emojiOptions = {
	emojis,
	renderer: (token) => `<img alt="${token.name}" src="${token.emoji}" class="marked-emoji-img">`
};
const highlightOptions = {
	emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  }
const katexOptions = {
  throwOnError: false
};
const linkifyItschemas = {};
const linkifyItOptions = {};

marked.use(createDirectives())
marked.use(extendedTables())
marked.use(markedHighlight(highlightOptions))
marked.use(markedKatex(katexOptions));
marked.use(markedLinkifyIt(linkifyItschemas, linkifyItOptions));
marked.use(markedXhtml());
marked.use(markedSmartypantsLite());
marked.use(mangle());
marked.use(SubAnSup)
marked.use(Mark)
marked.use(markedEmoji(emojiOptions))

import { registerImgErrorHandler } from './util/errorImg.js';
registerImgErrorHandler(app);

app.mount('#app')
