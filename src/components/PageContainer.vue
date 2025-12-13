<template>
  <div class="page-container">
    <h1>{{ title }}</h1>
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.page-container {
  margin-top: 10px;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}

.page-content {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  min-height: calc(100vh - 120px);
  width: 100%;
  box-sizing: border-box;
}
</style>