<template>
  <div class="admin-layout">
    <Navbar v-model:active-tab="activeTab" :show-admin-tab="showAdminTab" />
    <main class="admin-main">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from './Navbar.vue'
import BooksPage from './BooksPage.vue'
import UsersPage from './UsersPage.vue'
import BorrowingsPage from './Borrowings.vue'

const activeTab = ref('books')
const showAdminTab = ref(false)

// 组件挂载时检查用户权限
onMounted(() => {
  // 从localStorage中获取用户信息
  const currentUserStr = localStorage.getItem('currentUser')
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr)
    // 如果adminType为1，则显示管理员管理页面
    if (currentUser.adminType === 1) {
      showAdminTab.value = true
    }
  }
})

// 根据当前活动标签计算要显示的组件
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'books':
      return BooksPage
    case 'users':
      return UsersPage
    case 'borrowings':
      return BorrowingsPage
    case 'admins':
      return () => import('./AdminsPage.vue')
    default:
      return BooksPage
  }
})
</script>

<style scoped>
.admin-main {
  padding-top: 50px;
}
</style>