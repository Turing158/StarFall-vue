import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import HomeView from '../views/HomeView.vue'
import TopicDetailView from '../views/TopicDetialView.vue'
import PersonalView from '../views/PersonalView.vue'
import EditTopicView from '../views/EditTopicView.vue'
import NoticeView from '@/views/NoticeView.vue'
import SearchView from '@/views/SearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      children: [
        {
          path: '/',
          name: '_main',
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
          path: '/notices',
          name: 'notices',
          component: NoticeView
        },
        {
          path: '/topic/detail/:id?',
          name: 'topicDetail',
          component: TopicDetailView
        },
        {
          path: '/topic/editTopic/:id?',
          name: 'EditTopicView',
          component: EditTopicView
        },
        {
          path: '/topic/search',
          name: 'SearchView',
          component: SearchView
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
            },
            {
              path: '/personal/other/:user?',
              name: 'PersonalOtherContent',
              component: () => import('../views/content/PersonalOtherContent.vue')
            }
          ]
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
      path: '/forget',
      name: 'forget',
      component: () => import('../views/ForgetView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/MainView.vue'),
      children: [
        {
          path: '/admin',
          name: 'adminHome',
          component: () => import('../views/admin/HomeView.vue')
        },
        {
          path: '/admin/notice',
          name: 'adminNotice',
          component: () => import('../views/admin/NoticeView.vue')
        },
        {
          path: '/admin/topic',
          name: 'adminTopic',
          component: () => import('../views/admin/TopicView.vue')
        },
        {
          path: '/admin/topic/comment',
          name: 'adminComment',
          component: () => import('../views/admin/CommentView.vue')
        },
        {
          path: '/admin/topic/like',
          name: 'adminLike',
          component: () => import('../views/admin/LikeView.vue')
        },
        {
          path: '/admin/user',
          name: 'adminUser',
          component: () => import('../views/admin/UserView.vue')
        },
        {
          path: '/admin/signIn',
          name: 'adminSignIn',
          component: () => import('../views/admin/SignInView.vue')
        },
        {
          path: '/admin/chat',
          name: 'adminChat',
          component: () => import('../views/admin/ChatView.vue')
        }
      ]
    }
  ]
})

export default router
