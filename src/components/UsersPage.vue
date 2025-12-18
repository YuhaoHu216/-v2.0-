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
          <el-button type="primary" @click="searchBooks">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" style="margin-left: auto" @click="showAddBookModal">添加图书</el-button>
        </div>
      </div>
      
      <!-- 添加图书模态框 -->
      <el-dialog v-model="showAddModal" title="添加图书" width="650px" @close="hideAddBookModal">
        <el-form :model="newBook" label-width="130px">
          <el-form-item label="ISBN:" prop="isbn" required>
            <el-input v-model="newBook.isbn" />
          </el-form-item>
          
          <el-form-item label="书名:" prop="title" required>
            <el-input v-model="newBook.title" />
          </el-form-item>
          
          <el-form-item label="作者:" prop="author" required>
            <el-input v-model="newBook.author" />
          </el-form-item>
          
          <el-form-item label="出版社:" prop="publisher" required>
            <el-input v-model="newBook.publisher" />
          </el-form-item>
          
          <el-form-item label="出版日期:" prop="publishDate" required>
            <el-date-picker
              v-model="newBook.publishDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="分类:" prop="category" required>
            <el-input v-model="newBook.category" />
          </el-form-item>
          
          <el-form-item label="总数量:" prop="totalCopies" required>
            <el-input-number v-model="newBook.totalCopies" :min="1" controls-position="right" style="width: 100%" />
          </el-form-item>
          
          <el-form-item label="位置:" prop="location" required>
            <el-input v-model="newBook.location" />
          </el-form-item>
          
          <el-form-item label="封面图片:">
            <el-upload
              class="avatar-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleAddImageChange"
            >
              <img v-if="newBook.image" :src="newBook.image" class="avatar" />
              <el-button v-else>选择图片</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hideAddBookModal">取消</el-button>
            <el-button type="primary" @click="addNewBook">添加</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 编辑图书模态框 -->
      <el-dialog v-model="showEditModal" title="编辑图书" width="650px" @close="hideEditBookModal">
        <el-form :model="editBook" label-width="130px">
          <el-form-item label="ISBN:" prop="isbn" required>
            <el-input v-model="editBook.isbn" />
          </el-form-item>
          
          <el-form-item label="书名:" prop="title" required>
            <el-input v-model="editBook.title" />
          </el-form-item>
          
          <el-form-item label="作者:" prop="author" required>
            <el-input v-model="editBook.author" />
          </el-form-item>
          
          <el-form-item label="出版社:" prop="publisher" required>
            <el-input v-model="editBook.publisher" />
          </el-form-item>
          
          <el-form-item label="出版日期:" prop="publishDate" required>
            <el-date-picker
              v-model="editBook.publishDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
          
          <el-form-item label="分类:" prop="category" required>
            <el-input v-model="editBook.category" />
          </el-form-item>
          
          <el-form-item label="总数量:" prop="totalCopies" required>
            <el-input-number v-model="editBook.totalCopies" :min="1" controls-position="right" style="width: 100%" />
          </el-form-item>
          
          <el-form-item label="可借数量:" prop="availableCopies" required>
            <el-input-number v-model="editBook.availableCopies" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
          
          <el-form-item label="位置:" prop="location" required>
            <el-input v-model="editBook.location" />
          </el-form-item>
          
          <el-form-item label="封面图片:">
            <el-upload
              class="avatar-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleEditImageChange"
            >
              <img v-if="editBook.image" :src="editBook.image" class="avatar" />
              <el-button v-else>选择图片</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hideEditBookModal">取消</el-button>
            <el-button type="primary" @click="updateBookInfo">更新</el-button>
          </span>
        </template>
      </el-dialog>
      
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
              <el-button size="small" type="primary" @click="showEditBookModal(book)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteBookById(book.bookId)">删除</el-button>
            </td>
          </tr>
          <tr v-if="books.length === 0">
            <td colspan="10" class="no-data">暂无数据</td>
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
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElDatePicker, ElButton, ElUpload, ElMessage, ElMessageBox } from 'element-plus'
import PageContainer from './PageContainer.vue'
import { getBooksPage, addBook, updateBook, deleteBook, uploadBookImage } from '../api/books.js'

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

// 处理添加图书时的图片选择（Element Plus Upload）
const handleAddImageChange = (uploadFile) => {
  const file = uploadFile.raw
  if (file) {
    uploadBookImage(file)
      .then(uploadResponse => {
        if (uploadResponse.code === 1) {
          // 上传成功，设置图片URL
          newBook.value.image = uploadResponse.data
        } else {
          ElMessage.error('图片上传失败：' + uploadResponse.msg)
          newBook.value.image = ''
        }
      })
      .catch(error => {
        console.error('图片上传失败:', error)
        ElMessage.error('图片上传时发生错误，请查看控制台')
        newBook.value.image = ''
      })
  } else {
    newBook.value.image = ''
  }
}

// 处理编辑图书时的图片选择（Element Plus Upload）
const handleEditImageChange = (uploadFile) => {
  const file = uploadFile.raw
  if (file) {
    uploadBookImage(file)
      .then(uploadResponse => {
        if (uploadResponse.code === 1) {
          // 上传成功，设置图片URL
          editBook.value.image = uploadResponse.data
        } else {
          ElMessage.error('图片上传失败：' + uploadResponse.msg)
          editBook.value.image = ''
        }
      })
      .catch(error => {
        console.error('图片上传失败:', error)
        ElMessage.error('图片上传时发生错误，请查看控制台')
        editBook.value.image = ''
      })
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
      ElMessage.success('图书添加成功！')
    } else {
      ElMessage.error('图书添加失败：' + response.msg)
    }
  } catch (error) {
    console.error('添加图书失败:', error)
    ElMessage.error('添加图书时发生错误，请查看控制台')
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
      ElMessage.success('图书更新成功！')
    } else {
      ElMessage.error('图书更新失败：' + response.msg)
    }
  } catch (error) {
    console.error('更新图书失败:', error)
    ElMessage.error('更新图书时发生错误，请查看控制台')
  }
}

// 删除图书
const deleteBookById = async (bookId) => {
  try {
    await ElMessageBox.confirm('确定要删除这本书吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const response = await deleteBook(bookId);
    if (response.code === 1) {
      // 删除成功后刷新列表
      fetchBooks();
      ElMessage.success('图书删除成功！');
    } else {
      ElMessage.error('图书删除失败：' + response.msg);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除图书失败:', error);
      ElMessage.error('删除图书时发生错误，请查看控制台');
    }
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>