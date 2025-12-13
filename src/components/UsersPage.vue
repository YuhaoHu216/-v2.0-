<template>
  <PageContainer title="用户管理">
    <div class="user-management">
      <div class="toolbar">
        <button class="btn btn-primary">添加用户</button>
        <input type="text" placeholder="搜索用户..." class="search-input">
      </div>
      
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>注册时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>张三</td>
            <td>zhangsan@example.com</td>
            <td>2023-01-15</td>
            <td><span class="status active">活跃</span></td>
            <td>
              <button class="btn btn-sm btn-secondary">编辑</button>
              <button class="btn btn-sm btn-danger">禁用</button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>李四</td>
            <td>lisi@example.com</td>
            <td>2023-02-20</td>
            <td><span class="status inactive">_inactive</span></td>
            <td>
              <button class="btn btn-sm btn-secondary">编辑</button>
              <button class="btn btn-sm btn-success">启用</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button class="btn btn-secondary">上一页</button>
        <span class="page-info">第 1 页，共 5 页</span>
        <button class="btn btn-secondary">下一页</button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import PageContainer from './PageContainer.vue'
</script>

<style scoped>
.user-management {
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

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.user-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: #d4edda;
  color: #155724;
}

.status.inactive {
  background-color: #f8d7da;
  color: #721c24;
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

.btn-success {
  background-color: #28a745;
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