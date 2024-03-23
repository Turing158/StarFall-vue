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
        },
        {
          path: '/signIn',
          name: 'signIn',
          component: () => import('../views/content/SignInContent.vue')
        }
      ]
    },
    {
      path: '/topic/detail/:id?',
      name: 'topicDetail',
      component: TopicDetailView
    },
    {
      path: '/personal',
      name: 'personal',
      component: PersonalView,
      children: [
        {
          path: '/personal',
          name: 'PersonalInfo',
          component: () => import('../views/content/PersonalContent.vue')
        },
        {
          path: '/personal/setting',
          name: 'PersonalSetContent',
          component: () => import('../views/content/PersonalSetContent.vue')
        },
        {
          path: '/personal/password',
          name: 'PersonalPasswordContent',
          component: () => import('../views/content/PersonPasswordContent.vue')
        },
        {
          path: '/personal/email',
          name: 'PersonalEmailContent',
          component: () => import('../views/content/PersonEmailContent.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => import('../views/RegView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    }
  ]
})

export default router
