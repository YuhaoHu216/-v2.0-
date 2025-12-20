<template>
  <PageContainer title="">
    <div class="admin-management">
      <!-- 高级搜索表单 -->
      <div class="advanced-search">
        <div class="search-row">
          <el-input v-model="searchParams.adminId" placeholder="管理员ID" class="search-input" />
          <el-input v-model="searchParams.username" placeholder="用户名" class="search-input" />
          <el-input v-model="searchParams.realName" placeholder="真实姓名" class="search-input" />
        </div>
        <div class="search-row">
          <el-date-picker
            v-model="searchParams.startTime"
            type="date"
            placeholder="开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="search-input"
          />
          <el-date-picker
            v-model="searchParams.endTime"
            type="date"
            placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="search-input"
          />
          <el-button type="primary" @click="searchAdmins">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" style="margin-left: auto" @click="showAddAdminModal">添加管理员</el-button>
        </div>
      </div>
      
      <!-- 添加管理员模态框 -->
      <el-dialog v-model="showAddModal" title="添加管理员" width="500px" @close="hideAddAdminModal">
        <el-form :model="newAdmin" label-width="100px">
          <el-form-item label="用户名:" prop="username" required>
            <el-input v-model="newAdmin.username" />
          </el-form-item>
          
          <el-form-item label="密码:" prop="password" required>
            <el-input v-model="newAdmin.password" type="password" />
          </el-form-item>
          
          <el-form-item label="真实姓名:" prop="realName" required>
            <el-input v-model="newAdmin.realName" />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hideAddAdminModal">取消</el-button>
            <el-button type="primary" @click="addNewAdmin">添加</el-button>
          </span>
        </template>
      </el-dialog>
      
      <!-- 编辑管理员模态框 -->
      <el-dialog v-model="showEditModal" title="编辑管理员" width="500px" @close="hideEditAdminModal">
        <el-form :model="editAdmin" label-width="100px">
          <el-form-item label="用户名:" prop="username" required>
            <el-input v-model="editAdmin.username" />
          </el-form-item>
          
          <el-form-item label="管理员类型:" prop="adminType" required>
            <el-select v-model="editAdmin.adminType" placeholder="请选择管理员类型">
              <el-option label="超级管理员" :value="1" />
              <el-option label="普通管理员" :value="0" />
            </el-select>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="hideEditAdminModal">取消</el-button>
            <el-button type="primary" @click="updateAdminInfo">更新</el-button>
          </span>
        </template>
      </el-dialog>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>真实姓名</th>
            <th>管理员类型</th>
            <th>最后登录时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in admins" :key="admin.adminId">
            <td>{{ admin.adminId }}</td>
            <td>{{ admin.username }}</td>
            <td>{{ admin.realName || '-' }}</td>
            <td>{{ admin.adminType === 1 ? '超级管理员' : '普通管理员' }}</td>
            <td>{{ admin.lastLogin || '从未登录' }}</td>
            <td>
              <el-button size="small" type="primary" @click="showEditAdminModal(admin)">编辑</el-button>
              <el-button size="small" type="warning" @click="resetPassword(admin.adminId)">重置密码</el-button>
              <el-button size="small" type="danger" @click="deleteAdminById(admin.adminId)" :disabled="admin.adminId === 1">删除</el-button>
            </td>
          </tr>
          <tr v-if="admins.length === 0">
            <td colspan="6" class="no-data">暂无数据</td>
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
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElMessage, ElMessageBox, ElDatePicker } from 'element-plus'
import PageContainer from './PageContainer.vue'
import { getAdminsPage, addAdmin, updateAdmin, deleteAdmin, resetAdminPassword } from '../api/admins.js'

// 管理员数据
const admins = ref([])
// 分页信息
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  total: 0
})
// 搜索参数
const searchParams = ref({
  adminId: '',
  username: '',
  realName: '',
  startTime: '',
  endTime: ''
})

// 新增管理员表单数据
const newAdmin = ref({
  username: '',
  password: '',
  realName: ''
})

// 编辑管理员表单数据
const editAdmin = ref({
  adminId: null,
  username: '',
  adminType: 0
})

// 控制添加管理员模态框显示状态
const showAddModal = ref(false)

// 控制编辑管理员模态框显示状态
const showEditModal = ref(false)

// 显示添加管理员模态框
const showAddAdminModal = () => {
  showAddModal.value = true
}

// 隐藏添加管理员模态框
const hideAddAdminModal = () => {
  showAddModal.value = false
  // 重置表单
  newAdmin.value = {
    username: '',
    password: '',
    realName: ''
  }
}

// 显示编辑管理员模态框
const showEditAdminModal = (admin) => {
  showEditModal.value = true
  // 填充表单数据
  editAdmin.value = {
    adminId: admin.adminId,
    username: admin.username,
    adminType: admin.adminType
  }
}

// 隐藏编辑管理员模态框
const hideEditAdminModal = () => {
  showEditModal.value = false
  // 重置表单
  editAdmin.value = {
    adminId: null,
    username: '',
    adminType: 0
  }
}

// 添加管理员
const addNewAdmin = async () => {
  if (!newAdmin.value.username || !newAdmin.value.password) {
    ElMessage.error('用户名和密码不能为空')
    return
  }
  
  try {
    const response = await addAdmin(newAdmin.value)
    if (response.code === 1) {
      // 添加成功后刷新列表
      fetchAdmins()
      // 隐藏模态框并重置表单
      hideAddAdminModal()
      ElMessage.success('管理员添加成功！')
    } else {
      ElMessage.error('管理员添加失败：' + response.msg)
    }
  } catch (error) {
    console.error('添加管理员失败:', error)
    ElMessage.error('添加管理员时发生错误，请查看控制台')
  }
}

// 更新管理员
const updateAdminInfo = async () => {
  if (!editAdmin.value.username) {
    ElMessage.error('用户名不能为空')
    return
  }
  
  try {
    const response = await updateAdmin(editAdmin.value)
    if (response.code === 1) {
      // 更新成功后刷新列表
      fetchAdmins()
      // 隐藏模态框并重置表单
      hideEditAdminModal()
      ElMessage.success('管理员更新成功！')
    } else {
      ElMessage.error('管理员更新失败：' + response.msg)
    }
  } catch (error) {
    console.error('更新管理员失败:', error)
    ElMessage.error('更新管理员时发生错误，请查看控制台')
  }
}

// 删除管理员
const deleteAdminById = async (adminId) => {
  // 禁止删除ID为1的管理员（通常是默认管理员）
  if (adminId === 1) {
    ElMessage.warning('不能删除默认管理员')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除这个管理员吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const response = await deleteAdmin(adminId);
    if (response.code === 1) {
      // 删除成功后刷新列表
      fetchAdmins();
      ElMessage.success('管理员删除成功！');
    } else {
      ElMessage.error('管理员删除失败：' + response.msg);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除管理员失败:', error);
      ElMessage.error('删除管理员时发生错误，请查看控制台');
    }
  }
}

// 重置管理员密码
const resetPassword = async (adminId) => {
  try {
    await ElMessageBox.confirm('确定要重置这个管理员的密码吗？默认密码为123456', '确认重置密码', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const response = await resetAdminPassword(adminId);
    if (response.code === 1) {
      ElMessage.success('管理员密码重置成功！');
    } else {
      ElMessage.error('管理员密码重置失败：' + response.msg);
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置管理员密码失败:', error);
      ElMessage.error('重置管理员密码时发生错误，请查看控制台');
    }
  }
}

// 获取管理员数据
const fetchAdmins = async (pageNum = 1) => {
  try {
    const response = await getAdminsPage(pageNum, 10, searchParams.value)
    
    if (response.code === 1) {
      admins.value = response.data.rows || []
      pagination.value.total = response.data.total
      pagination.value.currentPage = pageNum
      pagination.value.totalPages = Math.ceil(response.data.total / 10)
    }
  } catch (error) {
    console.error('获取管理员数据失败:', error)
  }
}

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    adminId: '',
    username: '',
    realName: '',
    startTime: '',
    endTime: ''
  }
  fetchAdmins(1)
}

// 页面切换
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= pagination.value.totalPages) {
    fetchAdmins(newPage)
  }
}

// 搜索管理员
const searchAdmins = () => {
  fetchAdmins(1)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchAdmins()
})
</script>

<style scoped>
.admin-management {
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

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed;
}

.admin-table th,
.admin-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-table th {
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
