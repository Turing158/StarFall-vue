<template>
  <div @click="onFocus()">
    <input
      class="input"
      type="text"
      ref="onInput"
      v-model="props.modelValue"
      :placeholder="placeholder"
      @input="onChange()"
      :style="{ width: inputWidth + 'px', fontSize: fontSize + 'px'}"
    />
    <div class="text" ref="onText">{{ props.modelValue }}</div>
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
    fontSize: {
        type: Number,
        default: 12
    }
})
const emit = defineEmits(['update:modelValue'])
const onInput = ref()
const onText = ref()
const inputWidth = ref(props.width)

const onChange = () => {
  if (props.modelValue == ' ') {
    props.modelValue = ''
  }
  if (props.modelValue.length == 0) {
    inputWidth.value = props.width
  } else {
    inputWidth.value = onText.value.clientWidth + 5
  }
  emit('update:modelValue', props.modelValue)
}
const onFocus = () => {
  onChange()
  onInput.value.focus()
}
onMounted(onChange)
</script>
<style scoped>
.input {
  /* color: #11111100; */
  background-color: #11111100;
  border: 0;
  outline: none;
  cursor: pointer;
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
  cursor: pointer;
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
