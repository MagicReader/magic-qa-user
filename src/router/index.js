import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push // 获取原型对象上的push函数
VueRouter.prototype.push = function push (location) { // 修改原型对象中的push方法
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'navigation',
    component: () => import('../views/navigation.vue'),
    redirect: { name: 'home-index' },
    children: [
      // 首页
      {
        path: '/home',
        name: 'home-index',
        component: () => import('../views/home/index.vue'),
        redirect: { name: 'home-post-list' },
        children: [
          {
            path: 'post/list',
            name: 'home-post-list',
            component: () => import('../views/home/post/list.vue')
          },
          {
            path: 'post/detail',
            name: 'home-post-detail',
            component: () => import('../views/home/post/detail.vue')
          },
          {
            path: 'post/commentDetail',
            name: 'home-post-commentDetail',
            component: () => import('../views/home/post/commentDetail.vue')
          }
        ]
      },
      // 公告
      {
        path: '/announcement',
        name: 'announcement-index',
        redirect: { name: 'announcement-list' },
        component: () => import('../views/announcement/index.vue'),
        children: [
          {
            path: 'list',
            name: 'announcement-list',
            component: () => import('../views/announcement/list.vue')
          },
          {
            path: 'detail',
            name: 'announcement-detail',
            component: () => import('../views/announcement/detail.vue')
          }
        ]
      },
      // 消息
      {
        path: '/message',
        name: 'message',
        component: () => import('../views/message.vue')
      },
      // 我
      {
        path: '/me',
        name: 'me-index',
        component: () => import('../views/me/index.vue'),
        redirect: { name: 'me-guide' },
        children: [
          {
            path: 'guide',
            name: 'me-guide',
            component: () => import('../views/me/guide.vue')
          },
          {
            path: 'certification',
            name: 'me-certification',
            component: () => import('../views/me/certification.vue')
          },
          {
            path: 'setting',
            name: 'me-setting',
            component: () => import('../views/me/setting.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
