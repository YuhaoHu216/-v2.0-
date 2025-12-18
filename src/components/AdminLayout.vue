<template>
  <div class="admin-layout">
    <Navbar v-model:active-tab="activeTab" />
    <main class="admin-main">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from './Navbar.vue'
import BooksPage from './BooksPage.vue'
import UsersPage from './UsersPage.vue'
import BorrowingsPage from './Borrowings.vue'

const activeTab = ref('books')

// 根据当前活动标签计算要显示的组件
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'books':
      return BooksPage
    case 'users':
      return UsersPage
    case 'borrowings':
      return BorrowingsPage
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