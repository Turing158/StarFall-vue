import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import HomeView from '../views/HomeView.vue'
import TopicDetailView from '../views/TopicDetialView.vue'
import PersonalView from '../views/PersonalView.vue'
import EditTopicView from '../views/EditTopicView.vue'
import NoticeView from '@/views/NoticeView.vue'
import SearchView from '@/views/SearchView.vue'
import FriendView from '@/views/FriendView.vue'

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
              component: () => import('../views/content/HomeContent.vue'),
              meta: { title: '首页' }
            },
            {
              path: '/home',
              name: '_home',
              component: () => import('../views/content/HomeContent.vue'),
              meta: { title: '首页' }
            },
            {
              path: '/live',
              name: 'live',
              component: () => import('../views/content/LiveContent.vue'),
              meta: { title: '直播' }
            },
            {
              path: '/resource',
              name: 'resource',
              component: () => import('../views/content/TopicContent.vue'),
              meta: { title: '资源板块' }
            },
            {
              path: '/talk',
              name: 'talk',
              component: () => import('../views/content/TalkChatContent.vue'),
              meta: { title: '有话说板块' }
            },
            {
              path: '/signIn',
              name: 'signIn',
              component: () => import('../views/content/SignInContent.vue'),
              meta: { title: '签到' }
            }
          ]
        },
        {
          path: '/notices',
          name: 'notices',
          component: NoticeView,
          meta: { title: '通知' }
        },
        {
          path: '/friends',
          name: 'friends',
          component: FriendView,
          meta: { title: '好友' }
        },
        {
          path: '/topic/detail/:id?',
          name: 'topicDetail',
          component: TopicDetailView
        },
        {
          path: '/topic/:belong/:id?',
          name: 'EditTopicView',
          component: EditTopicView,
          meta: { title: '编辑主题' }
        },
        {
          path: '/topic/search',
          name: 'SearchView',
          component: SearchView,
          meta: { title: '搜索' }
        },
        {
          path: '/personal',
          name: 'personal',
          component: PersonalView,
          children: [
            {
              path: '/personal',
              name: 'PersonalInfo',
              component: () => import('../views/content/PersonalContent.vue'),
              meta: { title: '个人中心' }
            },
            {
              path: '/personal/collection',
              name: 'PersonalCollection',
              component: () => import('../views/content/PersonalCollectionContent.vue'),
              meta: { title: '收藏' }
            },
            {
              path: '/personal/setting',
              name: 'PersonalSetContent',
              component: () => import('../views/content/PersonalSetContent.vue'),
              meta: { title: '个人设置' }
            },
            {
              path: '/personal/password',
              name: 'PersonalPasswordContent',
              component: () => import('../views/content/PersonPasswordContent.vue'),
              meta: { title: '修改密码' }
            },
            {
              path: '/personal/email',
              name: 'PersonalEmailContent',
              component: () => import('../views/content/PersonEmailContent.vue'),
              meta: { title: '修改邮箱' }
            },
            {
              path: '/personal/other/:user?',
              name: 'PersonalOtherContent',
              component: () => import('../views/content/PersonalOtherContent.vue'),
              meta: { title: '其他用户' }
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => import('../views/RegView.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/forget',
      name: 'forget',
      component: () => import('../views/ForgetView.vue'),
      meta: { title: '忘记密码' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/MainView.vue'),
      meta: { title: '管理员中心' },
      children: [
        {
          path: '/admin',
          name: 'adminHome',
          component: () => import('../views/admin/HomeView.vue'),
          meta: { title: '管理面板-首页' }
        },
        {
          path: '/admin/ad',
          name: 'adminAd',
          component: () => import('../views/admin/AdView.vue'),
          meta: { title: '管理面板-广告' }
        },
        {
          path: '/admin/hometalk',
          name: 'adminHomeTalk',
          component: () => import('../views/admin/HomeTalkView.vue'),
          meta: { title: '管理面板-每日一言' }
        },
        {
          path: '/admin/live',
          name: 'adminLive',
          component: () => import('../views/admin/LiveApplyView.vue'),
          meta: { title: '管理面板-直播申请' }
        },
        {
          path: '/admin/notice',
          name: 'adminNotice',
          component: () => import('../views/admin/NoticeView.vue'),
          meta: { title: '管理面板-公告' }
        },
        {
          path: '/admin/topic',
          name: 'adminTopic',
          component: () => import('../views/admin/TopicView.vue'),
          meta: { title: '管理面板-主题' }
        },
        {
          path: '/admin/topic/comment',
          name: 'adminComment',
          component: () => import('../views/admin/CommentView.vue'),
          meta: { title: '管理面板-评论' }
        },
        {
          path: '/admin/topic/like',
          name: 'adminLike',
          component: () => import('../views/admin/LikeView.vue'),
          meta: { title: '管理面板-点赞' }
        },
        {
          path: '/admin/user',
          name: 'adminUser',
          component: () => import('../views/admin/UserView.vue'),
          meta: { title: '管理面板-用户' }
        },
        {
          path: '/admin/signIn',
          name: 'adminSignIn',
          component: () => import('../views/admin/SignInView.vue'),
          meta: { title: '管理面板-签到' }
        },
        {
          path: '/admin/chat',
          name: 'adminChat',
          component: () => import('../views/admin/ChatView.vue'),
          meta: { title: '管理面板-聊天' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const baseTitle = 'StarFall'
  
  if (to.meta.title) {
    document.title = `${baseTitle} - ${to.meta.title}`
  } else {
    document.title = baseTitle
  }
  
  next()
})

export default router
