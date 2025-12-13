<template>
  <nav class="navbar">
    <div class="nav-brand">书城管理系统</div>
    <ul class="nav-tabs">
      <li 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
        class="nav-tab"
      >
        {{ tab.name }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = defineModel('activeTab')

const tabs = [
  { id: 'books', name: '图书管理' },
  { id: 'users', name: '用户管理' },
  { id: 'borrowings', name: '借阅管理' },
]

const switchTab = (tabId) => {
  activeTab.value = tabId
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
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
</style>