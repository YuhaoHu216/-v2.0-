<template>
  <div class="borrowed-books-page">
    <UserNavbar />
    <div class="content-wrapper">
      <header class="page-header">
        <!-- <h1>已借书籍</h1> -->
      </header>
      
      <div class="borrowed-books-list">
        <div v-if="borrowRecords.length > 0" class="records-grid">
          <div v-for="record in borrowRecords" :key="record.recordId" class="record-card">
            <div class="record-info">
              <h3 class="book-title">{{ record.bookTitle }}</h3>
              <p class="book-category">分类: {{ record.category }}</p>
              <p class="borrow-date">借阅日期: {{ record.borrowDate }}</p>
              <p class="due-date">应还日期: {{ record.dueDate }}</p>
              <p class="return-date" v-if="record.returnDate">归还日期: {{ record.returnDate }}</p>
              <p class="status" :class="{ 'returned': record.borrowStatus === 2, 'borrowed': record.borrowStatus === 1 }">
                状态: {{ record.borrowStatus === 1 ? '借阅中' : '已归还' }}
              </p>
            </div>
          </div>
        </div>
        
        <div v-else class="no-records">
          <p>暂无借阅记录</p>
        </div>
      </div>
      
      <div class="pagination" v-if="borrowRecords.length > 0">
        <button 
          @click="changePage(pagination.currentPage - 1)" 
          :disabled="pagination.currentPage <= 1"
          class="page-button"
        >
          上一页
        </button>
        <span class="page-info">
          第 {{ pagination.currentPage }} 页，共 {{ pagination.totalPages }} 页
        </span>
        <button 
          @click="changePage(pagination.currentPage + 1)" 
          :disabled="pagination.currentPage >= pagination.totalPages"
          class="page-button"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getReaderInfo, getBorrowRecords } from '../api/readers.js'
import UserNavbar from './UserNavbar.vue'

// 数据响应式变量
const borrowRecords = ref([])
const currentUser = ref(null)
const router = useRouter()

// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0
})

// 获取借阅记录
const fetchBorrowRecords = async (pageNum = 1) => {
  try {
    // 先获取读者信息以获取readerId
    const readerResponse = await getReaderInfo()
    if (readerResponse.code !== 1) {
      alert('获取用户信息失败')
      return
    }
    
    const readerId = readerResponse.data.readerId
    
    // 构造分页参数
    const requestData = {
      readerId: readerId,
      pageNum: pageNum,
      pageSize: 10
    }
    
    const response = await getBorrowRecords(requestData)
    
    if (response.code === 1) {
      borrowRecords.value = response.data.rows || []
      pagination.value.total = response.data.total
      pagination.value.currentPage = pageNum
      pagination.value.totalPages = Math.ceil(response.data.total / 10)
    } else {
      alert('获取借阅记录失败: ' + (response.msg || '未知错误'))
    }
  } catch (error) {
    console.error('获取借阅记录失败:', error)
    alert('获取借阅记录失败，请稍后重试')
  }
}

// 页面切换
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    fetchBorrowRecords(newPage)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchBorrowRecords()
})
</script>

<style scoped>
.borrowed-books-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.record-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 20px;
}

.record-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.record-info h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.record-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.status.borrowed {
  color: #42b983;
  font-weight: bold;
}

.status.returned {
  color: #999;
  font-weight: bold;
}

.no-records {
  text-align: center;
  padding: 40px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.page-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.page-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  white-space: nowrap;
}
</style>