import { get, post, put, del } from './http.js';

// 获取管理员分页数据
export async function getAdminsPage(pageNum = 1, pageSize = 10, searchParams = {}) {
  const requestData = {
    pageNum: pageNum,
    pageSize: pageSize,
    ...searchParams
  };
  
  return await post('/admins/page', requestData);
}

// 添加管理员
export async function addAdmin(adminData) {
  return await post('/admins', adminData);
}

// 更新管理员
export async function updateAdmin(adminData) {
  return await put('/admins', adminData);
}

// 删除管理员
export async function deleteAdmin(adminId) {
  return await del(`/admins?adminId=${adminId}`);
}

// 重置管理员密码
export async function resetAdminPassword(adminId) {
  return await put(`/admins/resetPassword?adminId=${adminId}`);
}