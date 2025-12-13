<template>
  <PageContainer title="图书管理">
    <div class="book-management">
      <div class="toolbar">
        <button class="btn btn-primary">添加图书</button>
        <input type="text" placeholder="搜索图书..." class="search-input">
      </div>
      
      <table class="book-table">
        <thead>
          <tr>
            <th>封面</th>
            <th>书名</th>
            <th>作者</th>
            <th>价格</th>
            <th>库存</th>
            <th>分类</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img src="../assets/logo.svg" alt="书籍封面" class="book-cover"></td>
            <td>Vue.js实战</td>
            <td>张三</td>
            <td>¥69.00</td>
            <td>100</td>
            <td>计算机</td>
            <td>
              <button class="btn btn-sm btn-secondary">编辑</button>
              <button class="btn btn-sm btn-danger">删除</button>
            </td>
          </tr>
          <tr>
            <td><img src="../assets/logo.svg" alt="书籍封面" class="book-cover"></td>
            <td>React进阶之路</td>
            <td>李四</td>
            <td>¥79.00</td>
            <td>50</td>
            <td>计算机</td>
            <td>
              <button class="btn btn-sm btn-secondary">编辑</button>
              <button class="btn btn-sm btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button class="btn btn-secondary">上一页</button>
        <span class="page-info">第 1 页，共 10 页</span>
        <button class="btn btn-secondary">下一页</button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import PageContainer from './PageContainer.vue'
</script>

<style scoped>
.book-management {
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.book-table th,
.book-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.book-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 0.875rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.page-info {
  margin: 0 10px;
}
</style>