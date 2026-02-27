<template>
  <div class="floating-card" :style="cardStyle">
    <img class="avatar" :src="avatarUrl" alt="User Avatar" />
    <div class="right-content">
      <div class="username" @click="goProfile">{{ name }}</div>
      <GoChat class="go-chat-component" :user="user" font-size="12px" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import GoChat from './GoChat.vue';
import { getAvatarApi } from '@/api/user';
import { useRouter } from 'vue-router'
const props = defineProps({
  user:String,
  name:String,
  avatar:String,
  position: {
    type: Object,
    default: () => ({
      top: '0px',
      left: '0px'
    })
  }
});
const router = useRouter()
const goProfile = ()=>{
    router.push('/personal/other/' + props.user)
}
const cardStyle = computed(() => ({
  position: 'absolute',
  top: props.position.top,
  left: props.position.left,
  transform: 'translate(-50%, -100%)',
  zIndex: 1000
}));

// 使用ref和watchEffect来缓存图片URL，确保只在avatar变化时更新
const avatarUrl = ref(getAvatarApi + props.avatar);

// 监听avatar变化，只在必要时更新URL
watchEffect(() => {
  avatarUrl.value = getAvatarApi + props.avatar;
});
</script>

<style scoped>
.floating-card {
  width: 200px;
  background-color: #fbf2db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.floating-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -100%) scale(1.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f3f4f6;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #131313;
  cursor: pointer;
}

.username:hover{
    text-decoration: underline;
}

.right-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-height: 40px;
}

.go-chat-component {
  align-self: flex-end;
}
</style>