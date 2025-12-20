<template>
  <PageContainer title="">
    <div class="borrowing-management">
      <!-- 高级搜索表单 -->
      <div class="advanced-search">
        <div class="search-row">
          <input type="text" v-model="searchParams.readerId" placeholder="读者ID" class="search-input">
          <input type="text" v-model="searchParams.bookTitle" placeholder="书名" class="search-input">
          <input type="text" v-model="searchParams.category" placeholder="分类" class="search-input">
        </div>
        <div class="search-row">
          <el-select v-model="searchParams.borrowStatus" placeholder="借阅状态" clearable class="search-input">
            <el-option label="逾期" value="0"></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="已归还" value="2"></el-option>
          </el-select>
          <el-button type="primary" @click="searchBorrowRecords">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
      </div>
      
      
      
      <table class="borrowing-table">
        <thead>
          <tr>
            <th>记录ID</th>
            <th>书名</th>
            <th>分类</th>
            <th>读者ID</th>
            <th>借阅日期</th>
            <th>应还日期</th>
            <th>归还日期</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in borrowRecords" :key="record.recordId">
            <td>{{ record.recordId }}</td>
            <td>{{ record.bookTitle }}</td>
            <td>{{ record.category }}</td>
            <td>{{ record.readerId }}</td>
            <td>{{ record.borrowDate }}</td>
            <td>{{ record.dueDate }}</td>
            <td>{{ record.returnDate || '-' }}</td>
            <td>
              <el-tag v-if="record.borrowStatus === 0" type="danger">逾期</el-tag>
              <el-tag v-else-if="record.borrowStatus === 1" type="success">正常</el-tag>
              <el-tag v-else-if="record.borrowStatus === 2" type="info">已归还</el-tag>
              <span v-else>未知</span>
            </td>
          </tr>
          <tr v-if="borrowRecords.length === 0">
            <td colspan="8" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <el-button type="primary" @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage <= 1">上一页</el-button>
        <span class="page-info">第 {{ pagination.currentPage }} 页，共 {{ pagination.totalPages }} 页</span>
        <el-button type="primary" @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage >= pagination.totalPages">下一页</el-button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElSelect, ElOption, ElTag } from 'element-plus'
import PageContainer from './PageContainer.vue'
import { getBorrowRecords } from '../api/readers.js'

// 借阅记录数据
const borrowRecords = ref([])
// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0
})
// 搜索参数
const searchParams = ref({
  readerId: '',
  borrowStatus: '',
  bookTitle: '',
  category: ''
})

// 获取借阅记录数据
const fetchBorrowRecords = async (pageNum = 1) => {
  try {
    // 构造请求参数
    const requestData = {
      page: pageNum,
      pageSize: 10,
      ...searchParams.value
    }
    
    // 如果readerId为空字符串，则不传递该参数
    if (!requestData.readerId) {
      delete requestData.readerId
    }
    
    // 如果borrowStatus为空字符串，则不传递该参数
    if (!requestData.borrowStatus) {
      delete requestData.borrowStatus
    }
    
    // 如果bookTitle为空字符串，则不传递该参数
    if (!requestData.bookTitle) {
      delete requestData.bookTitle
    }
    
    // 如果category为空字符串，则不传递该参数
    if (!requestData.category) {
      delete requestData.category
    }
    
    const response = await getBorrowRecords(requestData)
    
    if (response.code === 1) {
      borrowRecords.value = response.data.rows || []
      pagination.value.total = response.data.total
      pagination.value.currentPage = pageNum
      pagination.value.totalPages = Math.ceil(response.data.total / 10)
    }
  } catch (error) {
    console.error('获取借阅记录数据失败:', error)
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    readerId: '',
    borrowStatus: '',
    bookTitle: '',
    category: ''
  }
  fetchBorrowRecords(1)
}

// 页面切换
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    fetchBorrowRecords(newPage)
  }
}

// 搜索借阅记录
const searchBorrowRecords = () => {
  fetchBorrowRecords(1)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchBorrowRecords()
})
</script>

<style scoped>
.borrowing-management {
  width: 100%;
}

.advanced-search {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.search-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.search-row:last-child {
  margin-bottom: 0;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  max-width: 200px;
}

.borrowing-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}

.borrowing-table th,
.borrowing-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.borrowing-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.page-info {
  margin: 0 10px;
  white-space: nowrap;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}
</style>