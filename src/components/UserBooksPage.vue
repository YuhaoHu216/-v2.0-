<template>
  <div class="user-books-page">
    <UserNavbar />
    <div class="content-wrapper">
      <header class="page-header">
        <!-- <h1>图书浏览</h1> -->
      </header>
    
      <div class="search-section">
      <div class="search-bar">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索书名、作者或ISBN..." 
          class="search-input"
          @keyup.enter="searchBooks"
        />
        <button @click="searchBooks" class="search-button">搜索</button>
      </div>
    </div>
    
    <div class="books-grid">
      <div v-for="book in books" :key="book.bookId" class="book-card">
        <div class="book-cover">
          <img v-if="book.image" :src="book.image" :alt="book.title" />
          <img v-else src="../assets/logo.svg" :alt="book.title" />
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">作者: {{ book.author }}</p>
          <p class="book-publisher">出版社: {{ book.publisher }}</p>
          <p class="book-category">分类: {{ book.category }}</p>
          <p class="book-available">可借数量: {{ book.availableCopies }}/{{ book.totalCopies }}</p>
          <button 
            @click="borrowBook(book)" 
            :disabled="book.availableCopies <= 0" 
            class="borrow-button"
          >
            {{ book.availableCopies > 0 ? '借阅' : '已借完' }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="books.length === 0" class="no-books">
      <p>暂无图书数据</p>
    </div>
    
    <div class="pagination">
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
import { getBooksPage } from '../api/books.js'
import { borrowBook as apiBorrowBook } from '../api/readers.js'
import UserNavbar from './UserNavbar.vue'

// 数据响应式变量
const books = ref([])
const searchKeyword = ref('')
const currentUser = ref(null)
const router = useRouter()

// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0
})

// 获取图书数据
const fetchBooks = async (pageNum = 1) => {
  try {
    // 构造搜索参数
    const searchParams = {}
    if (searchKeyword.value) {
      searchParams.title = searchKeyword.value
      searchParams.author = searchKeyword.value
      searchParams.isbn = searchKeyword.value
    }
    
    const response = await getBooksPage(pageNum, 12, searchParams)
    
    if (response.code === 1) {
      books.value = response.data.rows || []
      pagination.value.total = response.data.total
      pagination.value.currentPage = pageNum
      pagination.value.totalPages = Math.ceil(response.data.total / 12)
    }
  } catch (error) {
    console.error('获取图书数据失败:', error)
  }
}

// 搜索图书
const searchBooks = () => {
  fetchBooks(1)
}

// 页面切换
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    fetchBooks(newPage)
  }
}

// 借阅图书
const borrowBook = async (book) => {
  // 检查书籍是否可借
  if (book.availableCopies <= 0) {
    alert('该书籍已全部借出')
    return
  }
  
  try {
    const response = await apiBorrowBook(book.bookId)
    if (response.code === 1) {
      alert(`成功借阅《${book.title}》`)
      // 更新书籍的可借数量
      book.availableCopies -= 1
    } else if (response.code === -1) {
      // 处理特定错误码，比如已借阅过该书
      alert(`借阅失败: ${response.message || '您已借阅过此书'}`)
    } else {
      alert(`借阅失败: ${response.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('借阅失败:', error)
    if (error.response && error.response.status === 401) {
      alert('请先登录后再借书')
      router.push('/login')
    } else {
      alert('借阅失败，请稍后重试')
    }
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('isUserLoggedIn')
  localStorage.removeItem('currentUser')
  router.push('/login')
}

// 组件挂载时获取数据
onMounted(() => {
  // 获取当前用户信息
  const userStr = localStorage.getItem('currentUser')
  if (userStr) {
    currentUser.value = JSON.parse(userStr)
  }
  
  // 获取图书数据
  fetchBooks()
})
</script>

<style scoped>
.user-books-page {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.search-section {
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.search-button {
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #359c6d;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.book-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.book-cover {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.book-cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.book-info {
  padding: 15px;
}

.book-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-author,
.book-publisher,
.book-category,
.book-available {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.borrow-button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.borrow-button:hover:not(:disabled) {
  background-color: #359c6d;
}

.borrow-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-books {
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