<template>
    <div class="person_signature" 
    v-if="props.data && props.data != ''"
    v-html="marked(props.data)">
      
    </div>
</template>
<script setup>
import { marked } from 'marked';
const props = defineProps({
  data:{
    type: String,
    default: ''
  }
})

</script>
<style scoped>
.person_signature{
  min-height: 80px;
  max-height: 200px;
  padding: 10px;
  color: #6e5d3e;
}
</style>