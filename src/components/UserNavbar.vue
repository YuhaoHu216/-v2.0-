<template>
  <nav class="user-navbar">
    <div class="nav-brand">书城用户中心</div>
    <ul class="nav-tabs">
      <li 
        v-for="tab in tabs" 
        :key="tab.path"
        :class="{ active: isActive(tab.path) }"
        @click="navigateTo(tab.path)"
        class="nav-tab"
      >
        {{ tab.name }}
      </li>
    </ul>
    <div class="user-actions">
      <span class="welcome-text">欢迎, {{ currentUser?.username || '用户' }}!</span>
      <button @click="logout" class="logout-btn">退出</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentUser = ref(null)

const tabs = [
  { path: '/user/books', name: '图书浏览' }
]

// 检查当前路由是否激活
const isActive = (path) => {
  return route.path === path
}

// 导航到指定路径
const navigateTo = (path) => {
  router.push(path)
}

// 退出登录
const logout = () => {
  localStorage.removeItem('isUserLoggedIn')
  localStorage.removeItem('currentUser')
  router.push('/login')
}

// 组件挂载时获取用户信息
onMounted(() => {
  const userStr = localStorage.getItem('currentUser')
  if (userStr) {
    currentUser.value = JSON.parse(userStr)
  }
})
</script>

<style scoped>
.user-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: #2c3e50;
  padding: 0 15px;
  height: 50px;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-tabs {
  display: flex;
  list-style: none;
}

.nav-tab {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 4px;
  margin: 0 5px;
}

.nav-tab:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-tab.active {
  background-color: #42b983;
  color: white;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: #666;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #d32f2f;
}
</style>