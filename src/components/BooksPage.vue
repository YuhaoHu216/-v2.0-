<template>
  <PageContainer title="">
    <div class="book-management">
      <!-- 高级搜索表单 -->
      <div class="advanced-search">
        <div class="search-row">
          <input type="text" v-model="searchParams.isbn" placeholder="ISBN" class="search-input">
          <input type="text" v-model="searchParams.title" placeholder="书名" class="search-input">
          <input type="text" v-model="searchParams.author" placeholder="作者" class="search-input">
        </div>
        <div class="search-row">
          <input type="text" v-model="searchParams.publisher" placeholder="出版社" class="search-input">
          <input type="text" v-model="searchParams.category" placeholder="分类" class="search-input">
          <button class="btn btn-secondary" @click="searchBooks">搜索</button>
          <button class="btn btn-outline" @click="resetSearch">重置</button>
          <button class="btn btn-primary" style="margin-left: auto" @click="showAddBookModal">添加图书</button>
        </div>
      </div>
      
      <!-- 添加图书模态框 -->
      <div v-if="showAddModal" class="modal-overlay" @click="hideAddBookModal">
        <div class="modal-content" @click.stop>
          <h3>添加图书</h3>
          <form @submit.prevent="addNewBook">
            <div class="form-group">
              <label>ISBN:</label>
              <input type="text" v-model="newBook.isbn" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>书名:</label>
              <input type="text" v-model="newBook.title" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>作者:</label>
              <input type="text" v-model="newBook.author" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>出版社:</label>
              <input type="text" v-model="newBook.publisher" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>出版日期:</label>
              <input type="date" v-model="newBook.publishDate" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>分类:</label>
              <input type="text" v-model="newBook.category" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>总数量:</label>
              <input type="number" v-model="newBook.totalCopies" class="form-input" min="1" required>
            </div>
            
            <div class="form-group">
              <label>位置:</label>
              <input type="text" v-model="newBook.location" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>封面图片:</label>
              <input type="file" @change="handleImageSelect" accept="image/*" class="form-input">
              <div v-if="newBook.image" class="image-preview">
                <img :src="newBook.image.startsWith('http') ? newBook.image :  newBook.image" alt="预览图片" class="preview-image">
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" @click="hideAddBookModal">取消</button>
              <button type="submit" class="btn btn-primary">添加</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- 编辑图书模态框 -->
      <div v-if="showEditModal" class="modal-overlay" @click="hideEditBookModal">
        <div class="modal-content" @click.stop>
          <h3>编辑图书</h3>
          <form @submit.prevent="updateBookInfo">
            <div class="form-group">
              <label>ISBN:</label>
              <input type="text" v-model="editBook.isbn" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>书名:</label>
              <input type="text" v-model="editBook.title" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>作者:</label>
              <input type="text" v-model="editBook.author" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>出版社:</label>
              <input type="text" v-model="editBook.publisher" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>出版日期:</label>
              <input type="date" v-model="editBook.publishDate" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>分类:</label>
              <input type="text" v-model="editBook.category" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>总数量:</label>
              <input type="number" v-model="editBook.totalCopies" class="form-input" min="1" required>
            </div>
            
            <div class="form-group">
              <label>可借数量:</label>
              <input type="number" v-model="editBook.availableCopies" class="form-input" min="0" required>
            </div>
            
            <div class="form-group">
              <label>位置:</label>
              <input type="text" v-model="editBook.location" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label>封面图片:</label>
              <input type="file" @change="handleEditImageSelect" accept="image/*" class="form-input">
              <div v-if="editBook.image" class="image-preview">
                <img :src="editBook.image.startsWith('http') ? editBook.image : editBook.image" alt="预览图片" class="preview-image">
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" @click="hideEditBookModal">取消</button>
              <button type="submit" class="btn btn-primary">更新</button>
            </div>
          </form>
        </div>
      </div>
      
      <table class="book-table">
        <thead>
          <tr>
            <th>封面</th>
            <th>书名</th>
            <th>作者</th>
            <th>出版社</th>
            <th>出版日期</th>
            <th>分类</th>
            <th>总数量</th>
            <th>可借数量</th>
            <th>位置</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.bookId">
            <td>
              <img v-if="book.image" :src="book.image" :alt="book.title" class="book-cover">
              <img v-else src="../assets/logo.svg" :alt="book.title" class="book-cover">
            </td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.publisher }}</td>
            <td>{{ book.publishDate }}</td>
            <td>{{ book.category }}</td>
            <td>{{ book.totalCopies }}</td>
            <td>{{ book.availableCopies }}</td>
            <td>{{ book.location }}</td>
            <td>
              <button class="btn btn-sm btn-secondary" @click="showEditBookModal(book)">编辑</button>
              <button class="btn btn-sm btn-danger">删除</button>
            </td>
          </tr>
          <tr v-if="books.length === 0">
            <td colspan="10" class="no-data">暂无数据</td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button class="btn btn-secondary" @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage <= 1">上一页</button>
        <span class="page-info">第 {{ pagination.currentPage }} 页，共 {{ pagination.totalPages }} 页</span>
        <button class="btn btn-secondary" @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage >= pagination.totalPages">下一页</button>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageContainer from './PageContainer.vue'
import { getBooksPage, addBook, updateBook, uploadBookImage } from '../api/books.js'

// 图书数据
const books = ref([])
// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0
})
// 搜索参数
const searchParams = ref({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  category: ''
})

// 新增图书表单数据
const newBook = ref({
  isbn: '',
  image: '',
  title: '',
  author: '',
  publisher: '',
  publishDate: '',
  category: '',
  totalCopies: 1,
  availableCopies: 1,
  location: '',
  status: 1
})

// 编辑图书表单数据
const editBook = ref({
  bookId: null,
  isbn: '',
  image: '',
  title: '',
  author: '',
  publisher: '',
  publishDate: '',
  category: '',
  totalCopies: 1,
  availableCopies: 1,
  location: '',
  status: 1
})

// 控制添加图书模态框显示状态
const showAddModal = ref(false)

// 控制编辑图书模态框显示状态
const showEditModal = ref(false)

// 选中的图片文件
const selectedImageFile = ref(null)

// 显示添加图书模态框
const showAddBookModal = () => {
  showAddModal.value = true
}

// 隐藏添加图书模态框
const hideAddBookModal = () => {
  showAddModal.value = false
  // 重置表单
  newBook.value = {
    isbn: '',
    image: '',
    title: '',
    author: '',
    publisher: '',
    publishDate: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1,
    location: '',
    status: 1
  }
}

// 显示编辑图书模态框
const showEditBookModal = (book) => {
  showEditModal.value = true
  // 填充表单数据
  editBook.value = {
    bookId: book.bookId,
    isbn: book.isbn || '',
    image: book.image || '',
    title: book.title || '',
    author: book.author || '',
    publisher: book.publisher || '',
    publishDate: book.publishDate || '',
    category: book.category || '',
    totalCopies: book.totalCopies || 1,
    availableCopies: book.availableCopies || 1,
    location: book.location || '',
    status: book.status || 1
  }
}

// 隐藏编辑图书模态框
const hideEditBookModal = () => {
  showEditModal.value = false
  // 重置表单
  editBook.value = {
    bookId: null,
    isbn: '',
    image: '',
    title: '',
    author: '',
    publisher: '',
    publishDate: '',
    category: '',
    totalCopies: 1,
    availableCopies: 1,
    location: '',
    status: 1
  }
}

// 处理图片选择
const handleImageSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // 立即上传图片
      const uploadResponse = await uploadBookImage(file)
      if (uploadResponse.code === 1) {
        // 上传成功，设置图片URL
        newBook.value.image = uploadResponse.data
        // 清空选中的文件，因为我们已经上传了
        selectedImageFile.value = null
      } else {
        alert('图片上传失败：' + uploadResponse.msg)
        // 重置选择
        event.target.value = ''
        newBook.value.image = ''
      }
    } catch (error) {
      console.error('图片上传失败:', error)
      alert('图片上传时发生错误，请查看控制台')
      // 重置选择
      event.target.value = ''
      newBook.value.image = ''
    }
  } else {
    newBook.value.image = ''
  }
}

// 处理编辑时的图片选择
const handleEditImageSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      // 立即上传图片
      const uploadResponse = await uploadBookImage(file)
      if (uploadResponse.code === 1) {
        // 上传成功，设置图片URL
        editBook.value.image = uploadResponse.data
        // 清空选中的文件，因为我们已经上传了
        selectedImageFile.value = null
      } else {
        alert('图片上传失败：' + uploadResponse.msg)
        // 重置选择
        event.target.value = ''
        editBook.value.image = ''
      }
    } catch (error) {
      console.error('图片上传失败:', error)
      alert('图片上传时发生错误，请查看控制台')
      // 重置选择
      event.target.value = ''
      editBook.value.image = ''
    }
  } else {
    editBook.value.image = ''
  }
}

// 添加图书
const addNewBook = async () => {
  try {
    const response = await addBook(newBook.value)
    if (response.code === 1) {
      // 添加成功后刷新列表
      fetchBooks()
      // 隐藏模态框并重置表单
      hideAddBookModal()
      alert('图书添加成功！')
    } else {
      alert('图书添加失败：' + response.msg)
    }
  } catch (error) {
    console.error('添加图书失败:', error)
    alert('添加图书时发生错误，请查看控制台')
  }
}

// 更新图书
const updateBookInfo = async () => {
  try {
    const response = await updateBook(editBook.value)
    if (response.code === 1) {
      // 更新成功后刷新列表
      fetchBooks()
      // 隐藏模态框并重置表单
      hideEditBookModal()
      alert('图书更新成功！')
    } else {
      alert('图书更新失败：' + response.msg)
    }
  } catch (error) {
    console.error('更新图书失败:', error)
    alert('更新图书时发生错误，请查看控制台')
  }
}

// 获取图书数据
const fetchBooks = async (pageNum = 1) => {
  try {
    const response = await getBooksPage(pageNum, 10, searchParams.value)
    
    if (response.code === 1) {
      books.value = response.data.rows || []
      pagination.value.total = response.data.total
      pagination.value.currentPage = pageNum
      pagination.value.totalPages = Math.ceil(response.data.total / 10)
    }
  } catch (error) {
    console.error('获取图书数据失败:', error)
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    category: ''
  }
  fetchBooks(1)
}

// 页面切换
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    fetchBooks(newPage)
  }
}

// 搜索图书
const searchBooks = () => {
  fetchBooks(1)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.book-management {
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
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

.btn-outline {
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}

.book-table th,
.book-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  white-space: nowrap;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.image-preview {
  margin-top: 10px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}
</style>