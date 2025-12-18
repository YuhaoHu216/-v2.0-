import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import UserBooksPage from './components/UserBooksPage.vue'
import AdminLayout from './components/AdminLayout.vue'

// 管理员路由守卫
const requireAdminAuth = (to, from, next) => {
  // 在实际应用中，这里应该检查管理员身份验证状态
  // 目前我们简化处理，允许访问
  next()
}

// 用户路由守卫
const requireUserAuth = (to, from, next) => {
  const isLoggedIn = localStorage.getItem('isUserLoggedIn')
  if (isLoggedIn) {
    next()
  } else {
    next('/login')
  }
}

const routes = [
  // 用户路由
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/user/books', component: UserBooksPage, beforeEnter: requireUserAuth },
  
  // 管理员路由
  { path: '/admin', component: AdminLayout, beforeEnter: requireAdminAuth, children: [
    { path: '', redirect: 'books' },
    { path: 'books', component: () => import('./components/BooksPage.vue') },
    { path: 'users', component: () => import('./components/UsersPage.vue') },
    { path: 'borrowings', component: () => import('./components/Borrowings.vue') },
    { path: 'admins', component: () => import('./components/AdminsPage.vue') }
  ]}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router