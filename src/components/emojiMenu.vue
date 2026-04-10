<template>
    <el-dropdown-menu>
        <div class="emoji">
          <div class="emoji-container" v-if="currentList.length > 0">
            <div class="emoji-item" 
            v-for="(item, index) in currentList" 
            :key="index" 
            @click="insertEmoji(item)"
            :title="item.name" alt="">
                <img :src="item.src" loading="lazy">
                <span>{{item.name}}</span>
            </div>
          </div>
          <div class="emoji-empty" v-else>
            暂无表情
          </div>
          <div class="emoji-select">
            <el-segmented style="width: 350px" v-model="currentType" :options="options" @change="changeList"/>
          </div>
        </div>
    </el-dropdown-menu>
</template>
<script setup>
import { ref, defineEmits } from 'vue'
import { itemEmojis } from '@/assets/img/emoji/getItemEmoji.js'

const emit = defineEmits(['insertEmoji'])
const currentList = ref([])
const currentType = ref('Minecraft-物品')
const options = ref(['Minecraft-物品','2026年周年庆','2025年周年庆','史蒂夫'])
const changeList = ()=>{
    currentList.value = Object.entries(itemEmojis)
    .filter(([key, value]) => value.type === currentType.value)
    .map(([key, value]) => ({
        id: key,
        name: value.name,
        src: value.src,
        type: value.type
    }));
}
const insertEmoji = (item)=>{
  emit('insertEmoji', item)
}
changeList()
</script>
<style scoped>
.emoji{
  width: 350px;
  min-height: 100px;
  overflow: hidden;
}
.emoji-container{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  height: 280px;
  overflow-y: auto;
  overflow-x: hidden;
}
.emoji-container::-webkit-scrollbar{
  width: 5px;
}
.emoji-empty{
  height: 100px;
  font-size: 14px;
  text-align: center;
  padding: 10px 0;
}
.emoji-item{
  width: 60px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.emoji-item:hover{
  border-radius: 5px;
  background-color: #f5e0be;
}
.emoji-item img{
  width: 32px;
  height: 32px;
}
.emoji-item span{
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.emoji-select{
  max-width: 350px;
  overflow-y: hidden;
  overflow-x: auto;
}
.emoji-select::-webkit-scrollbar{
  height: 5px;
}
</style>