<script setup>
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'
import BooksPage from './components/BooksPage.vue'
import UsersPage from './components/UsersPage.vue'
import BorrowingsPage from './components/Borrowings.vue'

const activeTab = ref('books')
</script>
<template>
  <Navbar v-model:active-tab="activeTab" />
  
  <main>
    <BooksPage v-if="activeTab === 'books'" />
    <UsersPage v-if="activeTab === 'users'" />
    <BorrowingsPage v-if="activeTab === 'borrowings'" />
  </main>
</template>

<style scoped>
main {
  padding-top: 50px;
}
</style>
