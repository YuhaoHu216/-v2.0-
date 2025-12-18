<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">登录</h2>
      <div class="role-selector">
        <div class="role-option" :class="{ active: loginForm.role === 'user' }" @click="selectRole('user')">
          用户
        </div>
        <div class="role-option" :class="{ active: loginForm.role === 'admin' }" @click="selectRole('admin')">
          管理员
        </div>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">账号:</label>
          <input 
            id="username" 
            v-model="loginForm.username" 
            type="text" 
            class="form-input" 
            placeholder="请输入账号" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码:</label>
          <input 
            id="password" 
            v-model="loginForm.password" 
            type="password" 
            class="form-input" 
            placeholder="请输入密码" 
            required
          />
        </div>
        
        <button type="submit" class="login-button">登录</button>
      </form>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { readerLogin, adminLogin, getAdminInfo } from '../api/readers.js'

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
  role: 'user' // 默认是用户角色
})

// 错误消息
const errorMessage = ref('')

// 路由实例
const router = useRouter()

// 选择角色
const selectRole = (role) => {
  loginForm.value.role = role
}

// 处理登录逻辑
const handleLogin = async () => {
  // 简单的验证（实际项目中应该与后端API交互）
  if (loginForm.value.username && loginForm.value.password) {
    try {
      let response;
      
      // 根据角色调用不同的登录接口
      if (loginForm.value.role === 'admin') {
        // 调用管理员登录接口
        response = await adminLogin(loginForm.value.username, loginForm.value.password)
      } else {
        // 调用用户登录接口
        response = await readerLogin(loginForm.value.username, loginForm.value.password)
      }
      
      if (response.code === 1) {
        // 登录成功，保存token和用户信息
        localStorage.setItem('token', response.data)
        localStorage.setItem('isUserLoggedIn', 'true')
        
        if (loginForm.value.role === 'admin') {
          // 管理员登录成功后获取管理员详细信息
          try {
            const adminInfoResponse = await getAdminInfo()
            if (adminInfoResponse.code === 1) {
              const adminInfo = adminInfoResponse.data
              localStorage.setItem('currentUser', JSON.stringify({ 
                username: loginForm.value.username,
                role: loginForm.value.role,
                adminType: adminInfo.adminType
              }))
              
              // 根据角色跳转到不同页面
              router.push('/admin/books')
            } else {
              errorMessage.value = adminInfoResponse.msg || '获取管理员信息失败'
            }
          } catch (infoError) {
            console.error('获取管理员信息错误:', infoError)
            errorMessage.value = '获取管理员信息失败'
          }
        } else {
          // 用户登录
          localStorage.setItem('currentUser', JSON.stringify({ 
            username: loginForm.value.username,
            role: loginForm.value.role
          }))
          
          // 根据角色跳转到不同页面
          router.push('/user/books')
        }
      } else {
        errorMessage.value = response.msg || '登录失败'
      }
    } catch (error) {
      console.error('登录错误:', error)
      errorMessage.value = '登录失败，请检查网络连接或稍后重试'
    }
  } else {
    errorMessage.value = '请输入账号和密码'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.role-selector {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.role-option {
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.role-option.active {
  background-color: #42b983;
  color: white;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.login-button {
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #359c6d;
}

.error-message {
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  text-align: center;
}
</style>