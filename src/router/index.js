import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TopicDetailView from '../views/TopicDetialView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: HomeView,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/HomeContent.vue')
        },
        {
          path: '/home',
          name: '_home',
          component: () => import('../views/HomeContent.vue')
        },
        {
          path: '/topic',
          name: 'topic',
          component: () => import('../views/TopicContent.vue')
        }
      ]
    },
    {
      path: '/topic/detial',
      name: 'detial',
      component: TopicDetailView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    }
  ]
})

export default router
