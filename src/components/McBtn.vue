<template>
  <div
    v-if="(type == null) | 'spruce'"
    class="btn"
    @click="OnClick"
    :style="{ margin: '0px ' + props.margin + 'px', padding: '0px ' + props.padding + 'px',fontSize: props.fontSize+'px',width: props.width+'px',height: props.height+'px' }"
  >
    {{ BtnText }}
    <slot></slot>
  </div>
  <div
    v-if="type == 'oak'"
    class="btn oak"
    @click="OnClick"
    :style="{ margin: '0px ' + props.margin + 'px', padding: '0px ' + props.padding + 'px',fontSize: props.fontSize+'px' }"
  >
    {{ BtnText }}
    <slot></slot>
  </div>
  <div
    v-if="type == 'birch'"
    class="btn birch"
    @click="OnClick"
    :style="{ margin: '0px ' + props.margin + 'px', padding: '0px ' + props.padding + 'px',fontSize: props.fontSize+'px' }"
  >
    {{ BtnText }}
    <slot></slot>
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus"
import { ref,onMounted, watch } from "vue"

const props = defineProps({
  text: String,
  onClick: Function,
  type: String,
  margin: {
    type: Number,
    require: false,
    defalut: 0
  },
  padding: {
    type: Number,
    require: false,
    defalut: 0
  },
  paddingTB:{
    type: Number,
    require: false,
    defalut: 0
  },
  width: {
    type: Number,
    require: false,
    defalut: 64
  },
  height:{
    type:Number,
    require:false,
    default:30
  },
  fontSize:{
    type:Number,
    require:false,
    defalut:15
  },
  cooldownTamp:{
    type:Number,
    require:false,
    defalut:0
  },
  delaySuffix:{
    type:String,
    require:false,
    default:"s"
  },
  disabled:{
    type:Boolean,
    require:false,
    default:false
  }
})

const OnClick = ()=>{
  if(props.cooldownTamp - Date.now() > 0){
    ElMessage({
      message: '请等待'+Math.ceil((props.cooldownTamp - Date.now())/1000)+props.delaySuffix,
      type: 'warning',
      duration: 1000
    })
  }
  else{
    if(props.onClick){
      if(!props.disabled){
         props.onClick()
      }
      else{
        ElMessage({
          message: '按钮被禁用',
          type: 'warning',
          duration: 1000
        })
      }
    }
  }
}
let interval = null
const BtnText = ref(props.text)
watch(()=>props.cooldownTamp,()=>{
  updateDelay()
})
const updateDelay = ()=>{
  if(props.cooldownTamp - Date.now() > 0){
    BtnText.value = Math.ceil((props.cooldownTamp - Date.now())/1000)+props.delaySuffix
    interval = setInterval(()=>{
      if(props.cooldownTamp - Date.now() > 0){
        BtnText.value = Math.ceil((props.cooldownTamp - Date.now())/1000)+props.delaySuffix
      }
      else{
        BtnText.value = props.text
        clearInterval(interval)
      }
    },1000)
  }
}
onMounted(()=>{
  updateDelay()
})
</script>
<style scoped>
.btn {
  position: relative;
  width: fit-content;
  min-width: 40px;
  padding: 0 10px;
  height: 30px;
  background-image: url(../assets/img/set/spruce.png);
  background-size: 100%;
  outline: 0;
  border: 2px solid rgba(0, 0, 0, 0);
  border-radius: 5px;
  line-height: 30px;
  text-align: center;
  color: aliceblue;
  cursor: pointer;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn:hover {
  border-top: 2px solid rgb(184, 147, 93);
  border-left: 2px solid rgb(184, 147, 93);
  border-right: 2px solid rgb(59, 37, 3);
  border-bottom: 2px solid rgb(59, 37, 3);
}
.btn:active {
  border-right: 2px solid rgb(184, 147, 93);
  border-bottom: 2px solid rgb(184, 147, 93);
  border-top: 2px solid rgb(59, 37, 3);
  border-left: 2px solid rgb(59, 37, 3);
  line-height: 28px;
}
.oak {
  background-image: url(../assets/img/set/oak.png);
}
.birch {
  background-image: url(../assets/img/set/birch.png);
  color: #131313;
}
</style>
