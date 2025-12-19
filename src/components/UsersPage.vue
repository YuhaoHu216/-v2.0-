<template>
  <PageContainer title="">
    <div class="user-management">
      <!-- 高级搜索表单 -->
      <div class="advanced-search">
        <div class="search-row">
          <input type="text" v-model="searchParams.account" placeholder="账号" class="search-input">
          <input type="text" v-model="searchParams.readerName" placeholder="姓名" class="search-input">
          <input type="text" v-model="searchParams.phoneNumber" placeholder="手机号" class="search-input">
        </div>
        <div class="search-row">
          <input type="text" v-model="searchParams.department" placeholder="部门" class="search-input">
          <el-select v-model="searchParams.status" placeholder="状态" clearable class="search-input">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
          <el-button type="primary" @click="searchUsers">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" style="margin-left: auto" @click="showAddUserModal">添加用户</el-button>
        </div>
      </div>
      
      <!-- 添加用户模态框 -->
      <el-dialog v-model="showAddModal" title="添加用户" width="650px" @close="hideAddUserModal">
        <el-form :model="newUser" label-width="130px">
          <el-form-item label="账号:" prop="account" required>
            <el-input v-model="newUser.account" />
          </el-form-item>
          
          <el-form-item label="密码:" prop="password" required>
            <el-input v-model="newUser.password" type="password" />
          </el-form-item>
          
          <el-form-item label="姓名:" prop="readerName" required>
            <el-input v-model="newUser.readerName" />
          </el-form-item>
          
          <el-form-item label="手机号:" prop="phoneNumber" required>
            <el-input v-model="newUser.phoneNumber" />
          </el-form-item>
          
          <el-form-item label="部门:" prop="department" required>
            <el-input v-model="newUser.department" />
          </el-form-item>
          
          <el-form-item label="最大借阅数:" prop="maxBorrowCount" required>
            <el-input-number v-model="newUser.maxBorrowCount" :min="1" controls-position="right" style="width: 100%" />
          </el-form-item>
          
          <el-form-item label="用户类型:" prop="readerType" required>
            <el-select v-model="newUser.readerType" style="width: 100%">
              <el-option label="学生" :value="1"></el-option>
              <el-option label="教师" :value="2"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态:" prop="status" required>
            <el-radio-group v-model="newUser.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hideAddUserModal">取消</el-button>
            <el-button type="primary" @click="addNewUser">添加</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 编辑用户模态框 -->
      <el-dialog v-model="showEditModal" title="编辑用户" width="650px" @close="hideEditUserModal">
        <el-form :model="editUser" label-width="130px">
          <el-form-item label="账号:" prop="account" required>
            <el-input v-model="editUser.account" disabled />
          </el-form-item>
          
          <el-form-item label="姓名:" prop="readerName" required>
            <el-input v-model="editUser.readerName" />
          </el-form-item>
          
          <el-form-item label="手机号:" prop="phoneNumber" required>
            <el-input v-model="editUser.phoneNumber" />
          </el-form-item>
          
          <el-form-item label="部门:" prop="department" required>
            <el-input v-model="editUser.department" />
          </el-form-item>
          
          <el-form-item label="最大借阅数:" prop="maxBorrowCount" required>
            <el-input-number v-model="editUser.maxBorrowCount" :min="1" controls-position="right" style="width: 100%" />
          </el-form-item>
          
          <el-form-item label="当前借阅数:" prop="currentBorrowCount" required>
            <el-input-number v-model="editUser.currentBorrowCount" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
          
          <el-form-item label="用户类型:" prop="readerType" required>
            <el-select v-model="editUser.readerType" style="width: 100%">
              <el-option label="学生" :value="1"></el-option>
              <el-option label="教师" :value="2"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态:" prop="status" required>
            <el-radio-group v-model="editUser.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hideEditUserModal">取消</el-button>
            <el-button type="primary" @click="updateUserInfo">更新</el-button>
          </span>
        </template>
      </el-dialog>
      
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>账号</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>部门</th>
            <th>用户类型</th>
            <th>最大借阅数</th>
            <th>当前借阅数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.readerId">
            <td>{{ user.readerId }}</td>
            <td>{{ user.account }}</td>
            <td>{{ user.readerName }}</td>
            <td>{{ user.phoneNumber }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.readerType === 1 ? '学生' : user.readerType === 2 ? '教师' : '未知' }}</td>
            <td>{{ user.maxBorrowCount }}</td>
            <td>{{ user.currentBorrowCount }}</td>
            <td>
              <el-tag :type="user.status === 1 ? 'success' : 'danger'">
                {{ user.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </td>
            <td>
              <el-button size="small" type="primary" @click="showEditUserModal(user)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteUserById(user.readerId)">删除</el-button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
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
import { ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import PageContainer from './PageContainer.vue'
import { getReadersPage, addReader, updateReader, deleteReader } from '../api/readers.js'

// 用户数据
const users = ref([])
// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0
})
// 搜索参数
const searchParams = ref({
  account: '',
  readerName: '',
  phoneNumber: '',
  department: '',
  status: null
})

// 新增用户表单数据
const newUser = ref({
  account: '',
  password: '',
  readerName: '',
  phoneNumber: '',
  department: '',
  maxBorrowCount: 5,
  readerType: 1,
  status: 1
})

// 编辑用户表单数据
const editUser = ref({
  readerId: null,
  account: '',
  readerName: '',
  phoneNumber: '',
  department: '',
  maxBorrowCount: 5,
  currentBorrowCount: 0,
  readerType: 1,
  status: 1
})

// 控制添加用户模态框显示状态
const showAddModal = ref(false)

// 控制编辑用户模态框显示状态
const showEditModal = ref(false)

// 显示添加用户模态框
const showAddUserModal = () => {
  showAddModal.value = true
}

// 隐藏添加用户模态框
const hideAddUserModal = () => {
  showAddModal.value = false
  // 重置表单
  newUser.value = {
    account: '',
    password: '',
    readerName: '',
    phoneNumber: '',
    department: '',
    maxBorrowCount: 5,
    readerType: 1,
    status: 1
  }
}

// 显示编辑用户模态框
const showEditUserModal = (user) => {
  showEditModal.value = true
  // 填充表单数据
  editUser.value = {
    readerId: user.readerId,
    account: user.account || '',
    readerName: user.readerName || '',
    phoneNumber: user.phoneNumber || '',
    department: user.department || '',
    maxBorrowCount: user.maxBorrowCount || 5,
    currentBorrowCount: user.currentBorrowCount || 0,
    readerType: user.readerType || 1,
    status: user.status || 1
  }
}

// 隐藏编辑用户模态框
const hideEditUserModal = () => {
  showEditModal.value = false
  // 重置表单
  editUser.value = {
    readerId: null,
    account: '',
    readerName: '',
    phoneNumber: '',
    department: '',
    maxBorrowCount: 5,
    currentBorrowCount: 0,
    readerType: 1,
    status: 1
  }
}

// 添加用户
const addNewUser = async () => {
  try {
    const response = await addReader(newUser.value)
    if (response.code === 1) {
      ElMessage.success('用户添加成功！')
      // 添加成功后刷新列表
      fetchUsers()
      // 隐藏模态框并重置表单
      hideAddUserModal()
    } else {
      ElMessage.error('用户添加失败：' + response.msg)
    }
  } catch (error) {
    console.error('添加用户失败:', error)
    ElMessage.error('添加用户时发生错误，请查看控制台')
  }
}

// 更新用户
const updateUserInfo = async () => {
  try {
    const response = await updateReader(editUser.value)
    if (response.code === 1) {
      ElMessage.success('用户更新成功！')
      // 更新成功后刷新列表
      fetchUsers()
      // 隐藏模态框并重置表单
      hideEditUserModal()
    } else {
      ElMessage.error('用户更新失败：' + response.msg)
    }
  } catch (error) {
    console.error('更新用户失败:', error)
    ElMessage.error('更新用户时发生错误，请查看控制台')
  }
}

// 删除用户
const deleteUserById = async (readerId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个用户吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const response = await deleteReader(readerId);
    if (response.code === 1) {
      ElMessage.success('用户删除成功！');
      // 删除成功后刷新列表
      fetchUsers();
    } else {
      ElMessage.error('用户删除失败：' + response.msg);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error);
      ElMessage.error('删除用户时发生错误，请查看控制台');
    }
  }
}

// 获取用户数据
const fetchUsers = async (pageNum = 1) => {
  try {
    const response = await getReadersPage(pageNum, 10, searchParams.value)
    
    if (response.code === 1) {
      users.value = response.data.rows || []
      pagination.value.total = response.data.total
      pagination.value.currentPage = pageNum
      pagination.value.totalPages = Math.ceil(response.data.total / 10)
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    account: '',
    readerName: '',
    phoneNumber: '',
    department: '',
    status: null
  }
  fetchUsers(1)
}

// 页面切换
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    fetchUsers(newPage)
  }
}

// 搜索用户
const searchUsers = () => {
  fetchUsers(1)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.user-management {
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

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-table th {
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