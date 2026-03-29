import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
server: {
    proxy: {
      // 代理bilibili第三方api
      '/bilibiliApi': {
        target: 'https://api.live.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilibiliApi/, ''),
        secure: false
      },
      // 代理minecraft第三方api，为了验证Xbox账号，获取MinecraftToken
      '/minecraftApi': {
        target: 'https://api.minecraftservices.com/authentication/login_with_xbox',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minecraftApi/, ''),
        secure: false
      },
      // 代理后端api
      '/api': {
        target: "http://localhost:8312",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
})
