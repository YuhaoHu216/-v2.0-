// 封装axios用于发送HTTP请求
import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8080'

// 创建axios实例
const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 从localStorage中获取token
    const token = localStorage.getItem('token')
    if (token) {
      // 在请求头中添加Authorization字段
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('isUserLoggedIn')
      localStorage.removeItem('currentUser')
      // 这里可以添加跳转到登录页的逻辑
    }
    return Promise.reject(error)
  }
)

// 封装POST请求
export async function post(url, data) {
  try {
    const response = await http.post(url, data)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

// 封装PUT请求
export async function put(url, data) {
  try {
    const response = await http.put(url, data)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

// 封装文件上传POST请求
export async function uploadFile(url, file) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await axios.post(BASE_URL + url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  } catch (error) {
    console.error('文件上传失败:', error)
    throw error
  }
}

// 封装GET请求
export async function get(url, params = {}) {
  try {
    const response = await http.get(url, { params })
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

// 封装DELETE请求
export async function del(url) {
  try {
    const response = await http.delete(url)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}