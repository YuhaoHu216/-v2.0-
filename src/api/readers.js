import { post, get } from './http.js';

// 用户登录
export async function readerLogin(username, password) {
  const data = {
    account: username,
    password: password
  };
  
  return await post('/readers/login', data);
}

// 管理员登录
export async function adminLogin(username, password) {
  const data = {
    username: username,
    password: password
  };
  
  return await post('/admin/login', data);
}

// 获取管理员信息
export async function getAdminInfo() {
  return await get('/admin/me');
}