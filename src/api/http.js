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