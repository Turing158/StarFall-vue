<template>
  <div class="text-input-container">
    <input
      type="text"
      :value="text"
      @change="onChange"
      :placeholder="placeholder"
      :style="{ fontSize: `${fontSize}px`, width: `${width}px` }"
      class="text-input"
      
    >
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
    default: 400
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
const onChange = (e) => {
  text.value = e.target.value
  emit('update:modelValue', text.value)
}

// 初始化逻辑已通过ref直接赋值，无需额外调用onChange
</script>
<style scoped>
.text-input-container {
  position: relative;
  display: inline-block;
}

.text-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 5px 0;
  font-size: inherit;
  min-width: 50px;
}
</style>
