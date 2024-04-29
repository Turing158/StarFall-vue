<template>
  <div @click="onFocus()" :style="{}">
    <input
      class="input"
      type="text"
      ref="onInput"
      v-model="text"
      :placeholder="placeholder"
      @change="onChange"
      @input="onInputFunc"
      :style="{ width: inputWidth + 'px',fontSize: props.fontSize + 'px' }"
      :maxlength="maxlength"
    />
    <div class="text" ref="onText">{{ text }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 100
  },
  maxWidth:{
    type: Number,
    default: -1
  },
  maxlength:{
    type: Number,
    default: -1
  },
  fontSize: {
    type: Number,
    default: 12
  }
})
const emit = defineEmits(['update:modelValue'])
const text = ref(props.modelValue)
const onInput = ref()
const onText = ref()
const inputWidth = ref()
const onInputFunc = ()=>{
  if (text.value == ' ') {
    text.value = ''
  }
  if (text.value.length == 0) {
    inputWidth.value = props.width
  } else {
    if(props.maxWidth != -1){
      if((onText.value.clientWidth+5)>props.maxWidth){
        inputWidth.value = onText.value.clientWidth + fontSize.value + 5
      }
      else{
        inputWidth.value = props.maxWidth
      }
    }
    else{
      inputWidth.value = onText.value.clientWidth + 5
    }
  }
}
const onChange = () => {
  emit('update:modelValue', text.value)
}
const onFocus = () => {
  onChange()
  onInput.value.focus()
}
const init = () => {
  text.value = props.modelValue
  onChange()
}
onMounted(init)
</script>
<style scoped>
.input {
  /* color: #11111100; */
  background-color: #11111100;
  border: 0;
  outline: none;
  cursor: text;
  transition: all 0.2s;
  border-bottom: 1px dashed #131313;
  font-size: 12px;
  padding: 0 5px;
}
.input:focus {
  color: #000260;
  border-bottom: 1px solid #131313;
}
.inputText {
  border-bottom: 1px dashed #131313;
  transition: all 0.2s;
}
.text {
  position: absolute;
  width: fit-content;
  visibility: hidden;
  z-index: -999;
}
</style>
