import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TopicDetailView from '../views/TopicDetialView.vue'
import PersonalView from '../views/PersonalView.vue'

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
          component: () => import('../views/content/HomeContent.vue')
        },
        {
          path: '/home',
          name: '_home',
          component: () => import('../views/content/HomeContent.vue')
        },
        {
          path: '/topic',
          name: 'topic',
          component: () => import('../views/content/TopicContent.vue')
        }
      ]
    },
    {
      path: '/topic/detial',
      name: 'detial',
      component: TopicDetailView
    },
    {
      path: '/personal',
      name: 'personal',
      component: PersonalView,
      children:[
        {
          path: '/personal',
          name: 'PersonalInfo',
          component: ()=>import('../views/content/PersonalContent.vue')
        },
        {
          path: '/personal/setting',
          name: 'PersonalSetContent',
          component: ()=>import('../views/content/PersonalSetContent.vue')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    }
  ]
})

export default router
